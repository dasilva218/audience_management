"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AudienceRequest, RequestStatus } from "@/generated/prisma/client";
import { lookupRequest } from "@/lib/action";
import { CheckCircle, Clock, FileCheck, LucideLoader2, Search, XCircle } from "lucide-react";
import { useState, useTransition } from "react";


const statusConfig: Record<RequestStatus, { icon: typeof Clock; label: string; color: string }> = {
    PENDING: { icon: Clock, label: "En attente", color: "bg-amber-100 text-amber-800 border-amber-200" },
    PROCESSING: { icon: CheckCircle, label: "Acceptee", color: "bg-emerald-100 text-emerald-800 border-emerald-200" },
    SCHEDULED: { icon: FileCheck, label: "Terminee", color: "bg-blue-100 text-blue-800 border-blue-200" },
    REJECTED: { icon: XCircle, label: "Rejetee", color: "bg-red-100 text-red-800 border-red-200" },
    COMPLETED: { icon: FileCheck, label: "Terminee", color: "bg-blue-100 text-blue-800 border-blue-200" },
}

export default function TrackingSearch() {

    const [code, setCode] = useState("")
    const [isPending, startTransition] = useTransition()
    const [result, setResult] = useState<AudienceRequest | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [hasSearched, setHasSearched] = useState(false)

    function handleSearch() {
        if (!code.trim()) return
        setError(null)
        setResult(null)
        setHasSearched(true)

        startTransition(async () => {
            const response = await lookupRequest(code)
            if (response.success) {
                setResult(response.request ?? null)
            } else {
                console.log(response.message);
                setError(response.message || "Erreur lors de la recherche")
            }
        })
    }

    return (
        <div className="mx-auto max-w-2xl flex flex-col gap-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl text-foreground">Suivre ma demande</CardTitle>
                    <CardDescription>
                        Entrez votre code de suivi pour consulter l{"'"}etat de votre demande d{"'"}audience.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="trackingCode">Code de suivi</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="trackingCode"
                                    placeholder="AUD-2026-XXXXXX"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                    className="font-mono"
                                />
                                <Button
                                    onClick={handleSearch}
                                    disabled={isPending || !code.trim()}
                                    className="shrink-0 bg-primary text-primary-foreground hover:bg-primary/90"
                                >
                                    {isPending ? (
                                        <LucideLoader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Search className="h-4 w-4" />
                                    )}
                                    <span className="ml-2 hidden sm:inline">Rechercher</span>
                                </Button>
                            </div>
                        </div>

                        {/* Demo codes */}
                        <div className="rounded-lg bg-muted/50 p-3">
                            <p className="text-xs text-muted-foreground mb-2">Codes de demonstration :</p>
                            <div className="flex flex-wrap gap-2">
                                {["AUD-2026-001457", "AUD-2026-001458", "AUD-2026-001460"].map((demoCode) => (
                                    <button
                                        key={demoCode}
                                        type="button"
                                        onClick={() => {
                                            setCode(demoCode)
                                        }}
                                        className="rounded-md bg-background px-2 py-1 text-xs font-mono text-foreground border border-border hover:bg-muted transition-colors"
                                    >
                                        {demoCode}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {error && hasSearched && (
                <Card className="border-destructive/30 bg-destructive/5">
                    <CardContent className="flex items-center gap-3 p-4">
                        <XCircle className="h-5 w-5 shrink-0 text-destructive" />
                        <p className="text-sm text-destructive">{error}</p>
                    </CardContent>
                </Card>
            )}

            {result && (
                <Card>
                    <CardHeader>
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <CardTitle className="text-lg text-foreground">{result.subject}</CardTitle>
                                <CardDescription className="font-mono">{result.trackingCode}</CardDescription>
                            </div>
                            <StatusBadge status={result.status} />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-4">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <InfoField label="Demandeur" value={`${result.fullName}`} />
                                {/* <InfoField label="Ministere" value={result.ministry?.name} /> */}
                                <InfoField label="Date de soumission" value={formatDate(result.createdAt)} />
                                <InfoField label="Derniere mise a jour" value={formatDate(result.updatedAt)} />
                            </div>
                            <div className="border-t pt-4">
                                <p className="text-sm font-medium text-foreground mb-1">Description</p>
                                <p className="text-sm text-muted-foreground leading-relaxed">{result.message}</p>
                            </div>

                            {/* Timeline */}
                            <div className="border-t pt-4">
                                <p className="text-sm font-medium text-foreground mb-3">Progression</p>
                                <div className="flex items-center gap-0">
                                    {(["PENDING", "PROCESSING", "REJECTED", "COMPLETED"] as RequestStatus[]).map((step, i) => {
                                        const isActive = getStepIndex(result.status) >= i
                                        const isRejected = result.status === "REJECTED"
                                        return (
                                            <div key={step} className="flex items-center flex-1">
                                                <div className="flex flex-col items-center gap-1 flex-1">
                                                    <div
                                                        className={`h-3 w-3 rounded-full ${isRejected && i > 0
                                                            ? "bg-muted"
                                                            : isActive
                                                                ? "bg-primary"
                                                                : "bg-muted"
                                                            }`}
                                                    />
                                                    <span className="text-xs text-muted-foreground">
                                                        {statusConfig[step].label}
                                                    </span>
                                                </div>
                                                {i < 2 && (
                                                    <div
                                                        className={`h-0.5 flex-1 ${isRejected
                                                            ? "bg-muted"
                                                            : getStepIndex(result.status) > i
                                                                ? "bg-primary"
                                                                : "bg-muted"
                                                            }`}
                                                    />
                                                )}
                                            </div>
                                        )
                                    })}
                                </div>
                                {result.status === "REJECTED" && (
                                    <p className="mt-2 text-sm text-destructive">
                                        Cette demande a ete rejetee. Veuillez contacter le ministere pour plus d{"'"}informations.
                                    </p>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

        </div>
    );
}


function StatusBadge({ status }: { status: RequestStatus }) {
    const config = statusConfig[status]
    const Icon = config.icon
    return (
        <div className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium ${config.color}`}>
            <Icon className="h-3.5 w-3.5" />
            {config.label}
        </div>
    )
}

function InfoField({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex flex-col gap-0.5">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-sm font-medium text-foreground">{value}</p>
        </div>
    )
}

function formatDate(iso: Date) {
    return new Date(iso).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    })
}

function getStepIndex(status: RequestStatus): number {
    const steps: RequestStatus[] = ["PENDING", "PROCESSING", "SCHEDULED", "REJECTED", "COMPLETED"]
    return steps.indexOf(status)
}