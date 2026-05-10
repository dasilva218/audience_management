"use client"
import { useState } from "react"
import { useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AudienceRequest, RequestDocument, RequestStatus } from "@/generated/prisma/client"
import { STATUS_LABELS } from "@/lib/data/index_data"
import { CalendarClock, CheckCircle2, ChevronLeftCircle, Clock2Icon, FileCheck2Icon, Loader2Icon, MapPin, PencilIcon, XCircleIcon } from "lucide-react"
import { toast } from "sonner"

export default function AudienceDetail({
    request,
    onBack,
    // onStatusChange,
}: {
    request: AudienceRequest
    onBack: () => void
    // onStatusChange: () => void
}) {
    const [isPending, startTransition] = useTransition()
    const [currentStatus, setCurrentStatus] = useState(request.status)
    const [audienceDate, setAudienceDate] = useState<string | null>(request.audienceDate)
    const [audienceLocation, setAudienceLocation] = useState<string | null>(request.audienceLocation)
    const [activeDocument, setActiveDocument] = useState<{
        doc: RequestDocument
        label: string
    } | null>(null)
    const [scheduleOpen, setScheduleOpen] = useState(false)
    const [scheduleMode, setScheduleMode] = useState<"accept" | "edit">("accept")

    function handleStatusChange(newStatus: RequestStatus) {
        // For ACCEPTEE, force the user through the scheduler dialog.
        if (newStatus === "ACCEPTEE") {
            setScheduleMode("accept")
            setScheduleOpen(true)
            return
        }
        startTransition(async () => {
            const result = await changeRequestStatus(request.id, newStatus)
            if (result.success) {
                setCurrentStatus(newStatus)
                setAudienceDate(result.request.audienceDate)
                setAudienceLocation(result.request.audienceLocation)
                onStatusChange()
                toast.success(`Statut mis a jour: ${STATUS_LABELS[newStatus]}`)
            } else {
                toast.error(result.error)
            }
        })
    }

    function handleSchedule(date: string, location: string | null) {
        if (scheduleMode === "accept") {
            startTransition(async () => {
                const result = await changeRequestStatus(request.id, "ACCEPTEE", {
                    audienceDate: date,
                    audienceLocation: location,
                })
                if (result.success) {
                    setCurrentStatus("ACCEPTEE")
                    setAudienceDate(result.request.audienceDate)
                    setAudienceLocation(result.request.audienceLocation)
                    setScheduleOpen(false)
                    onStatusChange()
                    toast.success("Demande acceptee. La date de l'audience a ete enregistree.")
                } else {
                    toast.error(result.error)
                }
            })
        } else {
            startTransition(async () => {
                const result = await rescheduleAudience(request.id, date, location)
                if (result.success) {
                    setAudienceDate(result.request.audienceDate)
                    setAudienceLocation(result.request.audienceLocation)
                    setScheduleOpen(false)
                    onStatusChange()
                    toast.success("La date de l'audience a ete mise a jour.")
                } else {
                    toast.error(result.error)
                }
            })
        }
    }

    return (
        <div className="flex flex-col gap-6">
            <Button variant="ghost" onClick={onBack} className="w-fit text-muted-foreground">
                <ChevronLeftCircle className="mr-1 h-4 w-4" />
                Retour a la liste
            </Button>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Main info */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                                <CardTitle className="text-lg text-foreground">{request.subject}</CardTitle>
                                <CardDescription className="font-mono">{request.trackingCode}</CardDescription>
                            </div>
                            <span
                                className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium ${statusStyles[currentStatus]}`}
                            >
                                {STATUS_LABELS[currentStatus]}
                            </span>
                        </div>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-6">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <DetailField label="Nom" value={request.lastName} />
                            <DetailField label="Prenom" value={request.firstName} />
                            <DetailField label="Email" value={request.email} />
                            <DetailField label="Telephone" value={request.phone} />
                            <DetailField label="Piece d'identite" value={request.nationalId} />
                            <DetailField
                                label="Date de soumission"
                                value={new Date(request.createdAt).toLocaleDateString("fr-FR", {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                })}
                            />
                        </div>
                        <div className="border-t pt-4">
                            <p className="text-sm font-medium text-foreground mb-2">Description</p>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {request.description}
                            </p>
                        </div>

                        {/* Audience scheduling info */}
                        {currentStatus === "ACCEPTEE" || currentStatus === "TERMINEE" ? (
                            <div className="rounded-lg border border-emerald-200 bg-emerald-50/60 p-4">
                                <div className="flex items-start gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-emerald-100">
                                        <CalendarClock className="h-5 w-5 text-emerald-700" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-emerald-900">
                                            {currentStatus === "TERMINEE" ? "Audience tenue" : "Audience programmee"}
                                        </p>
                                        {audienceDate ? (
                                            <p className="text-sm text-emerald-800 mt-0.5">
                                                {formatAudienceDate(audienceDate)}
                                            </p>
                                        ) : (
                                            <p className="text-sm text-emerald-800/80 mt-0.5 italic">
                                                Date non renseignee
                                            </p>
                                        )}
                                        {audienceLocation && (
                                            <p className="mt-1 flex items-start gap-1.5 text-xs text-emerald-800/80">
                                                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                                                <span>{audienceLocation}</span>
                                            </p>
                                        )}
                                    </div>
                                    {currentStatus === "ACCEPTEE" && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            className="shrink-0 border-emerald-300 bg-white text-emerald-800 hover:bg-emerald-50"
                                            onClick={() => {
                                                setScheduleMode("edit")
                                                setScheduleOpen(true)
                                            }}
                                        >
                                            <PencilIcon className="mr-1.5 h-3.5 w-3.5" />
                                            Modifier
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ) : null}

                        {/* Documents */}
                        <div className="border-t pt-4">
                            <p className="text-sm font-medium text-foreground mb-3">Documents joints</p>
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <DocumentCard
                                    label="Piece d'identite"
                                    description="CNI / Passeport"
                                    document={request.identityDoc}
                                    onView={(doc) => setActiveDocument({ doc, label: "Piece d'identite" })}
                                />
                                <DocumentCard
                                    label="Lettre de demande"
                                    description="Lettre officielle"
                                    document={request.requestLetter}
                                    onView={(doc) => setActiveDocument({ doc, label: "Lettre de demande" })}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Actions sidebar */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base text-foreground">Actions</CardTitle>
                        <CardDescription>Modifier le statut de cette demande.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-2">
                        {currentStatus !== "ACCEPTEE" && (
                            <Button
                                onClick={() => handleStatusChange("ACCEPTEE")}
                                disabled={isPending}
                                className="w-full justify-start bg-emerald-600 text-white hover:bg-emerald-700"
                            >
                                {isPending ? (
                                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <CheckCircle2 className="mr-2 h-4 w-4" />
                                )}
                                Accepter
                            </Button>
                        )}
                        {currentStatus !== "REJETEE" && (
                            <Button
                                onClick={() => handleStatusChange("REJETEE")}
                                disabled={isPending}
                                variant="destructive"
                                className="w-full justify-start"
                            >
                                {isPending ? (
                                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <XCircleIcon className="mr-2 h-4 w-4" />
                                )}
                                Rejeter
                            </Button>
                        )}
                        {currentStatus === "ACCEPTEE" && (
                            <Button
                                onClick={() => handleStatusChange("TERMINEE")}
                                disabled={isPending}
                                className="w-full justify-start bg-blue-600 text-white hover:bg-blue-700"
                            >
                                {isPending ? (
                                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <FileCheck2Icon className="mr-2 h-4 w-4" />
                                )}
                                Marquer comme terminee
                            </Button>
                        )}
                        {currentStatus !== "EN_ATTENTE" && (
                            <Button
                                onClick={() => handleStatusChange("EN_ATTENTE")}
                                disabled={isPending}
                                variant="outline"
                                className="w-full justify-start"
                            >
                                {isPending ? (
                                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <Clock2Icon className="mr-2 h-4 w-4" />
                                )}
                                Remettre en attente
                            </Button>
                        )}
                    </CardContent>
                </Card>
            </div>

            <DocumentViewer
                document={activeDocument?.doc ?? null}
                label={activeDocument?.label ?? ""}
                onClose={() => setActiveDocument(null)}
            />

            <ScheduleAudienceDialog
                open={scheduleOpen}
                mode={scheduleMode}
                initialDate={audienceDate}
                initialLocation={audienceLocation}
                isPending={isPending}
                onCancel={() => setScheduleOpen(false)}
                onConfirm={handleSchedule}
            />
        </div>
    )
}