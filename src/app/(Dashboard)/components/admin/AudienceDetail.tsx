import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AudienceRequest } from "@/generated/prisma/client";
import { STATUS_LABELS, statusStyles } from "@/lib/data/index_data";
// import { formatAudienceDate } from "@/lib/services";
import { CalendarClockIcon, ChevronLeftCircleIcon } from "lucide-react";
import { useState } from "react";

export default function AudienceDetail({ onBack, request }: { onBack: () => void, request: AudienceRequest }) {
    const [currentStatus, setCurrentStatus] = useState(request.status)
    const [audienceDate, setAudienceDate] = useState<Date | string | null>(new Date(request.scheduledAt).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }))

    return (
        <div className="flex flex-col gap-6" >
            <Button variant="ghost" onClick={onBack} className="w-fit text-muted-foreground">
                <ChevronLeftCircleIcon className="mr-1 h-4 w-4" />
                Retour a la liste
            </Button>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* main info */}
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
                    <CardContent className="flex flex-col gap-6" >
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                            <DetailField label="Demandeur" value={request.fullName} />
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
                            <p className="text-sm font-medium text-foreground mb-2">Objet de la demande</p>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {request.message}
                            </p>
                        </div>
                        {/* info sur le statut de l'audience */}
                        {
                            currentStatus === "SCHEDULED" || currentStatus === "COMPLETED" ?
                                (
                                    <div className="rounded-lg border border-emerald-200 bg-emerald-50/60 p-4">
                                        <div className="flex items-start gap-3">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-emerald-100">
                                                <CalendarClockIcon className="h-5 w-5 text-emerald-700" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-emerald-900">
                                                    {currentStatus === "COMPLETED" ? "Audience tenue" : "Audience programmee"}
                                                </p>
                                                {audienceDate ? (
                                                    <p className="text-sm text-emerald-800 mt-0.5">
                                                        {audienceDate}
                                                    </p>
                                                ) : (
                                                    <p className="text-sm text-emerald-800/80 mt-0.5 italic">
                                                        Date non renseignee
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    ""
                                )
                        }





                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function DetailField({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex flex-col gap-0.5">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-sm font-medium text-foreground">{value}</p>
        </div>
    )
}

function DocumentCard({
    label,
    description,
    document,
    onView,
}: {
    label: string
    description: string
    document: RequestDocument | null
    onView: (doc: RequestDocument) => void
}) {
    if (!document) {
        return (
            <div className="flex items-center gap-3 rounded-lg border border-dashed p-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-muted">
                    <FileQuestion className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex flex-col">
                    <p className="text-sm font-medium text-foreground">{label}</p>
                    <p className="text-xs text-muted-foreground">Document non disponible</p>
                </div>
            </div>
        )
    }

    const isImage = document.mimeType.startsWith("image/")
    const Icon = isImage ? ImageIcon : FileText

    return (
        <div className="flex flex-col gap-3 rounded-lg border p-3 transition-colors hover:border-primary/40 hover:bg-primary/5">
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex min-w-0 flex-col">
                    <p className="text-sm font-medium text-foreground">{label}</p>
                    <p className="truncate text-xs text-muted-foreground" title={document.name}>
                        {document.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                        {description} - {formatFileSize(document.size)}
                    </p>
                </div>
            </div>
            <div className="flex gap-2">
                <Button
                    type="button"
                    variant="default"
                    size="sm"
                    className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={() => onView(document)}
                >
                    <Eye className="mr-2 h-4 w-4" />
                    Consulter
                </Button>
                <Button type="button" variant="outline" size="sm" asChild>
                    <a href={document.dataUrl} download={document.name} aria-label={`Telecharger ${label}`}>
                        <Download className="h-4 w-4" />
                    </a>
                </Button>
            </div>
        </div>
    )
}

function DocumentViewer({
    document,
    label,
    onClose,
}: {
    document: RequestDocument | null
    label: string
    onClose: () => void
}) {
    const open = document !== null
    const isImage = document?.mimeType.startsWith("image/") ?? false

    return (
        <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
            <DialogContent className="flex h-[90vh] max-w-4xl flex-col gap-4 p-0">
                <DialogHeader className="border-b px-6 pt-6 pb-4">
                    <DialogTitle className="text-foreground">{label}</DialogTitle>
                    {document && (
                        <DialogDescription>
                            {document.name} - {formatFileSize(document.size)}
                        </DialogDescription>
                    )}
                </DialogHeader>

                <div className="flex-1 overflow-auto bg-muted/30 px-6">
                    {document ? (
                        isImage ? (
                            <div className="flex h-full items-center justify-center py-4">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={document.dataUrl || "/placeholder.svg"}
                                    alt={label}
                                    className="max-h-full max-w-full rounded-md border bg-white shadow-sm"
                                />
                            </div>
                        ) : (
                            <iframe
                                src={document.dataUrl}
                                title={label}
                                className="h-full w-full rounded-md border bg-white"
                            />
                        )
                    ) : null}
                </div>

                <div className="flex items-center justify-end gap-2 border-t px-6 py-4">
                    <Button variant="outline" onClick={onClose}>
                        Fermer
                    </Button>
                    {document && (
                        <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
                            <a href={document.dataUrl} download={document.name}>
                                <Download className="mr-2 h-4 w-4" />
                                Telecharger
                            </a>
                        </Button>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}


// "use client"
// import { useState } from "react"
// import { useTransition } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { AudienceRequest, RequestDocument, RequestStatus } from "@/generated/prisma/client"
// import { STATUS_LABELS } from "@/lib/data/index_data"
// import { CalendarClock, CheckCircle2, ChevronLeftCircle, Clock2Icon, FileCheck2Icon, Loader2Icon, MapPin, PencilIcon, XCircleIcon } from "lucide-react"
// import { toast } from "sonner"

// export default function AudienceDetail({
//     request,
//     onBack,
//     // onStatusChange,
// }: {
//     request: AudienceRequest
//     onBack: () => void
//     // onStatusChange: () => void
// }) {
//     // const [isPending, startTransition] = useTransition()
//     // const [currentStatus, setCurrentStatus] = useState(request.status)
//     // const [audienceDate, setAudienceDate] = useState<string | null>(request.audienceDate)
//     // const [audienceLocation, setAudienceLocation] = useState<string | null>(request.audienceLocation)
//     // const [activeDocument, setActiveDocument] = useState<{
//     //     doc: RequestDocument
//     //     label: string
//     // } | null>(null)
//     // const [scheduleOpen, setScheduleOpen] = useState(false)
//     // const [scheduleMode, setScheduleMode] = useState<"accept" | "edit">("accept")

//     // function handleStatusChange(newStatus: RequestStatus) {
//     //     // For ACCEPTEE, force the user through the scheduler dialog.
//     //     if (newStatus === "ACCEPTEE") {
//     //         setScheduleMode("accept")
//     //         setScheduleOpen(true)
//     //         return
//     //     }
//     //     startTransition(async () => {
//     //         const result = await changeRequestStatus(request.id, newStatus)
//     //         if (result.success) {
//     //             setCurrentStatus(newStatus)
//     //             setAudienceDate(result.request.audienceDate)
//     //             setAudienceLocation(result.request.audienceLocation)
//     //             onStatusChange()
//     //             toast.success(`Statut mis a jour: ${STATUS_LABELS[newStatus]}`)
//     //         } else {
//     //             toast.error(result.error)
//     //         }
//     //     })
//     // }

//     // function handleSchedule(date: string, location: string | null) {
//     //     if (scheduleMode === "accept") {
//     //         startTransition(async () => {
//     //             const result = await changeRequestStatus(request.id, "ACCEPTEE", {
//     //                 audienceDate: date,
//     //                 audienceLocation: location,
//     //             })
//     //             if (result.success) {
//     //                 setCurrentStatus("ACCEPTEE")
//     //                 setAudienceDate(result.request.audienceDate)
//     //                 setAudienceLocation(result.request.audienceLocation)
//     //                 setScheduleOpen(false)
//     //                 onStatusChange()
//     //                 toast.success("Demande acceptee. La date de l'audience a ete enregistree.")
//     //             } else {
//     //                 toast.error(result.error)
//     //             }
//     //         })
//     //     } else {
//     //         startTransition(async () => {
//     //             const result = await rescheduleAudience(request.id, date, location)
//     //             if (result.success) {
//     //                 setAudienceDate(result.request.audienceDate)
//     //                 setAudienceLocation(result.request.audienceLocation)
//     //                 setScheduleOpen(false)
//     //                 onStatusChange()
//     //                 toast.success("La date de l'audience a ete mise a jour.")
//     //             } else {
//     //                 toast.error(result.error)
//     //             }
//     //         })
//     //     }
//     // }

//     return (
//         <div className="flex flex-col gap-6">
//             <Button variant="ghost" onClick={onBack} className="w-fit text-muted-foreground">
//                 <ChevronLeftCircle className="mr-1 h-4 w-4" />
//                 Retour a la liste
//             </Button>

//             <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
//                 {/* Main info */}
//                 <Card className="lg:col-span-2">
//                     <CardHeader>
//                         <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
//                             <div>
//                                 <CardTitle className="text-lg text-foreground">{request.subject}</CardTitle>
//                                 <CardDescription className="font-mono">{request.trackingCode}</CardDescription>
//                             </div>
//                             <span
//                                 className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium ${statusStyles[currentStatus]}`}
//                             >
//                                 {/* {STATUS_LABELS[currentStatus]} */}
//                             </span>
//                         </div>
//                     </CardHeader>
//                     <CardContent className="flex flex-col gap-6">
//                         <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//                             <DetailField label="Nom" value={request.lastName} />
//                             <DetailField label="Prenom" value={request.firstName} />
//                             <DetailField label="Email" value={request.email} />
//                             <DetailField label="Telephone" value={request.phone} />
//                             <DetailField label="Piece d'identite" value={request.nationalId} />
//                             <DetailField
//                                 label="Date de soumission"
//                                 value={new Date(request.createdAt).toLocaleDateString("fr-FR", {
//                                     day: "numeric",
//                                     month: "long",
//                                     year: "numeric",
//                                 })}
//                             />
//                         </div>
//                         <div className="border-t pt-4">
//                             <p className="text-sm font-medium text-foreground mb-2">Description</p>
//                             <p className="text-sm text-muted-foreground leading-relaxed">
//                                 {request.description}
//                             </p>
//                         </div>

//                         {/* Audience scheduling info */}
//                         {currentStatus === "ACCEPTEE" || currentStatus === "TERMINEE" ? (
//                             <div className="rounded-lg border border-emerald-200 bg-emerald-50/60 p-4">
//                                 <div className="flex items-start gap-3">
//                                     <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-emerald-100">
//                                         <CalendarClock className="h-5 w-5 text-emerald-700" />
//                                     </div>
//                                     <div className="flex-1 min-w-0">
//                                         <p className="text-sm font-medium text-emerald-900">
//                                             {currentStatus === "TERMINEE" ? "Audience tenue" : "Audience programmee"}
//                                         </p>
//                                         {audienceDate ? (
//                                             <p className="text-sm text-emerald-800 mt-0.5">
//                                                 {formatAudienceDate(audienceDate)}
//                                             </p>
//                                         ) : (
//                                             <p className="text-sm text-emerald-800/80 mt-0.5 italic">
//                                                 Date non renseignee
//                                             </p>
//                                         )}
//                                         {audienceLocation && (
//                                             <p className="mt-1 flex items-start gap-1.5 text-xs text-emerald-800/80">
//                                                 <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
//                                                 <span>{audienceLocation}</span>
//                                             </p>
//                                         )}
//                                     </div>
//                                     {currentStatus === "ACCEPTEE" && (
//                                         <Button
//                                             type="button"
//                                             variant="outline"
//                                             size="sm"
//                                             className="shrink-0 border-emerald-300 bg-white text-emerald-800 hover:bg-emerald-50"
//                                             onClick={() => {
//                                                 setScheduleMode("edit")
//                                                 setScheduleOpen(true)
//                                             }}
//                                         >
//                                             <PencilIcon className="mr-1.5 h-3.5 w-3.5" />
//                                             Modifier
//                                         </Button>
//                                     )}
//                                 </div>
//                             </div>
//                         ) : null}

//                         {/* Documents */}
//                         <div className="border-t pt-4">
//                             <p className="text-sm font-medium text-foreground mb-3">Documents joints</p>
//                             <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
//                                 <DocumentCard
//                                     label="Piece d'identite"
//                                     description="CNI / Passeport"
//                                     document={request.identityDoc}
//                                     onView={(doc) => setActiveDocument({ doc, label: "Piece d'identite" })}
//                                 />
//                                 <DocumentCard
//                                     label="Lettre de demande"
//                                     description="Lettre officielle"
//                                     document={request.requestLetter}
//                                     onView={(doc) => setActiveDocument({ doc, label: "Lettre de demande" })}
//                                 />
//                             </div>
//                         </div>
//                     </CardContent>
//                 </Card>

//                 {/* Actions sidebar */}
//                 <Card>
//                     <CardHeader>
//                         <CardTitle className="text-base text-foreground">Actions</CardTitle>
//                         <CardDescription>Modifier le statut de cette demande.</CardDescription>
//                     </CardHeader>
//                     <CardContent className="flex flex-col gap-2">
//                         {currentStatus !== "ACCEPTEE" && (
//                             <Button
//                                 onClick={() => handleStatusChange("ACCEPTEE")}
//                                 disabled={isPending}
//                                 className="w-full justify-start bg-emerald-600 text-white hover:bg-emerald-700"
//                             >
//                                 {isPending ? (
//                                     <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
//                                 ) : (
//                                     <CheckCircle2 className="mr-2 h-4 w-4" />
//                                 )}
//                                 Accepter
//                             </Button>
//                         )}
//                         {currentStatus !== "REJETEE" && (
//                             <Button
//                                 onClick={() => handleStatusChange("REJETEE")}
//                                 disabled={isPending}
//                                 variant="destructive"
//                                 className="w-full justify-start"
//                             >
//                                 {isPending ? (
//                                     <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
//                                 ) : (
//                                     <XCircleIcon className="mr-2 h-4 w-4" />
//                                 )}
//                                 Rejeter
//                             </Button>
//                         )}
//                         {currentStatus === "ACCEPTEE" && (
//                             <Button
//                                 onClick={() => handleStatusChange("TERMINEE")}
//                                 disabled={isPending}
//                                 className="w-full justify-start bg-blue-600 text-white hover:bg-blue-700"
//                             >
//                                 {isPending ? (
//                                     <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
//                                 ) : (
//                                     <FileCheck2Icon className="mr-2 h-4 w-4" />
//                                 )}
//                                 Marquer comme terminee
//                             </Button>
//                         )}
//                         {currentStatus !== "EN_ATTENTE" && (
//                             <Button
//                                 onClick={() => handleStatusChange("EN_ATTENTE")}
//                                 disabled={isPending}
//                                 variant="outline"
//                                 className="w-full justify-start"
//                             >
//                                 {isPending ? (
//                                     <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
//                                 ) : (
//                                     <Clock2Icon className="mr-2 h-4 w-4" />
//                                 )}
//                                 Remettre en attente
//                             </Button>
//                         )}
//                     </CardContent>
//                 </Card>
//             </div>

//             <DocumentViewer
//                 document={activeDocument?.doc ?? null}
//                 label={activeDocument?.label ?? ""}
//                 onClose={() => setActiveDocument(null)}
//             />

//             <ScheduleAudienceDialog
//                 open={scheduleOpen}
//                 mode={scheduleMode}
//                 initialDate={audienceDate}
//                 initialLocation={audienceLocation}
//                 isPending={isPending}
//                 onCancel={() => setScheduleOpen(false)}
//                 onConfirm={handleSchedule}
//             />
//         </div>
//     )
// }