'use client'
import { useCallback, useEffect, useState, useTransition } from "react";
import { StatCardProps, StatsType } from "@/lib/types/index_type";
import { BarChart3, CheckCircle, ChevronLeftCircle, Clock, Eye, FileCheck, FileText, Loader2, PencilIcon, XCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AudienceRequest, RequestStatus } from "@/generated/prisma/client";
import { getDashboardStats } from "@/lib/action";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { toast } from "sonner";
import { useDashboardContext } from "@/context/dashboardProvider";

const statusStyles: Record<RequestStatus, string> = {
  PENDING: "bg-amber-100 text-amber-800 border-amber-200",
  REJECTED: "bg-red-100 text-red-800 border-red-200",
  SCHEDULED: "bg-blue-100 text-blue-800 border-blue-200",
  COMPLETED: "bg-green-100 text-green-800 border-green-200",
}

export const STATUS_LABELS: Record<string, string> = {
  PENDING: "En attente",
  REJECTED: "Rejetee",
  SCHEDULED: "Acceptee",
  COMPLETED: "Terminee",
}

export default function Main() {

  const { ministry, audienceRequests } = useDashboardContext()
  const [selectedRequest, setSelectedRequest] = useState<AudienceRequest | null>(null)
  const [stats, setStats] = useState<StatsType | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>("ALL")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const StatsData = [
    {
      label: "Total",
      value: stats?.total!,
      icon: FileText,
      color: "text-foreground",
      bg: "bg-muted",
    },
    {
      label: "En Attente",
      value: stats?.pending ?? 0,
      icon: FileText,
      color: "text-foreground",
      bg: "bg-muted",
    },
    {
      label: "Programmees",
      value: stats?.scheduled ?? 0,
      icon: FileText,
      color: "text-foreground",
      bg: "bg-muted",
    },
    {
      label: "Effectuees  ",
      value: stats?.completed ?? 0,
      icon: FileText,
      color: "text-foreground",
      bg: "bg-muted",
    },
    {
      label: "Rejetees",
      value: stats?.rejected ?? 0,
      icon: FileText,
      color: "text-foreground",
      bg: "bg-muted",
    }
  ]

  const filter = filterStatus === "ALL" ? audienceRequests : audienceRequests?.filter((r) => r.status === filterStatus as RequestStatus)

  const filteredRequests: AudienceRequest[] = filter ?? []

  const totalPages = Math.max(1, Math.ceil(filteredRequests.length / pageSize))
  const safePage = Math.min(currentPage, totalPages)
  const startIdx = (safePage - 1) * pageSize
  const paginatedRequests = filteredRequests.slice(startIdx, startIdx + pageSize)




  const getData = useCallback(async () => {
    const stats = await getDashboardStats(ministry?.id_ministry ?? "")
    if (stats) {
      setStats(stats)
    }
  }, [ministry])

  useEffect(() => {
    getData()
  }, [getData])

  return (
    <main className="mx-auto max-w-7xl px-4 py-6">
      {
        selectedRequest ? (

          <RequestDetail
            request={selectedRequest}
            onBack={() => {
              setSelectedRequest(null)
              // refreshData()
            }}
          // onStatusChange={() => refreshData()}
          />
        ) : (
          <Tabs defaultValue="overview">
            <TabsList className="w-fit">
              <TabsTrigger value="overview">
                <BarChart3 className="mr-2 h-4 w-4" />
                Vue d{"'"}ensemble
              </TabsTrigger>
              <TabsTrigger value="requests">
                <FileText className="mr-2 h-4 w-4" />
                Demandes
              </TabsTrigger>
            </TabsList>

            {/* Les states */}
            <TabsContent value="overview">
              <div className="flex flex-col gap-6">
                {/* affichage des stats */}
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                  {StatsData.map((stat, index) => (
                    <StatCard
                      key={index}
                      label={stat.label}
                      value={stat.value}
                      icon={stat.icon}
                      color={stat.color}
                      bg={stat.bg}
                    />))
                  }
                </div>

                {/* affichage des demandes recentes */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg text-foreground">Demandes recentes</CardTitle>
                    <CardDescription>
                      Les 5 dernieres demandes adressees a votre ministere.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RequestTable
                      requests={audienceRequests?.slice(0, 5) ?? []}
                      onView={setSelectedRequest}
                    />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="requests">
              <Card>
                <CardHeader>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <CardTitle className="text-lg text-foreground">
                        Toutes les demandes
                      </CardTitle>
                      <CardDescription>
                        {audienceRequests?.length} demande(s) trouvee(s)
                      </CardDescription>
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value)}>
                        <SelectTrigger className="w-full sm:w-48">
                          <SelectValue placeholder="Filtrer par statut" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ALL">Tous les statuts</SelectItem>
                          <SelectItem value="PENDING">En attente</SelectItem>
                          <SelectItem value="SCHEDULED">Acceptees</SelectItem>
                          <SelectItem value="REJECTED">Rejetees</SelectItem>
                          <SelectItem value="COMPLETED">Terminees</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select
                        value={String(pageSize)}
                        onValueChange={(v) => setPageSize(Number(v))}
                      >
                        <SelectTrigger className="w-full sm:w-36">
                          <SelectValue placeholder="Par page" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">5 par page</SelectItem>
                          <SelectItem value="10">10 par page</SelectItem>
                          <SelectItem value="20">20 par page</SelectItem>
                          <SelectItem value="50">50 par page</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <RequestTable
                    requests={paginatedRequests}
                    onView={setSelectedRequest}
                  />
                  {filteredRequests?.length > 0 && (
                    <TablePagination
                      currentPage={safePage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                      startIdx={startIdx}
                      pageSize={pageSize}
                      total={filteredRequests.length}
                    />
                  )}
                </CardContent>
              </Card>
            </TabsContent>

          </Tabs>)
      }

    </main>
  );

}


function StatCard({
  label,
  value,
  icon: Icon,
  color,
  bg,
}: StatCardProps) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-4">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${bg}`}>
          <Icon className={`h-5 w-5 ${color}`} />
        </div>
        <div className="flex flex-col">
          <span className="text-2xl font-bold text-foreground">{value}</span>
          <span className="text-xs text-muted-foreground">{label}</span>
        </div>
      </CardContent>
    </Card>
  )
}


function RequestTable({
  requests,
  onView,
}: {
  requests: AudienceRequest[]
  onView: (r: AudienceRequest) => void
}) {
  if (requests.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-12 text-center">
        <FileText className="h-8 w-8 text-muted-foreground/50" />
        <p className="text-sm text-muted-foreground">Aucune demande trouvee.</p>
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Code</TableHead>
          <TableHead className="hidden sm:table-cell">Demandeur</TableHead>
          <TableHead className="hidden md:table-cell">Objet</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead className="hidden lg:table-cell">Date</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {requests.map((req) => (
          <TableRow key={req.id_audience}>
            <TableCell className="font-mono text-xs">{req.trackingCode}</TableCell>
            <TableCell className="hidden sm:table-cell">
              {req.fullName}
            </TableCell>
            <TableCell className="hidden md:table-cell max-w-[200px] truncate">
              {req.subject}
            </TableCell>
            <TableCell>
              <span
                className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${statusStyles[req.status]}`}
              >
                {STATUS_LABELS[req.status]}
              </span>
            </TableCell>
            <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
              {new Date(req.createdAt).toLocaleDateString("fr-FR")}
            </TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" size="sm" onClick={() => onView(req)}>
                <Eye className="h-4 w-4" />
                <span className="sr-only">Voir</span>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}


// function TablePagination({
//   currentPage,
//   totalPages,
//   onPageChange,
//   startIdx,
//   pageSize,
//   total,
// }: {
//   currentPage: number
//   totalPages: number
//   onPageChange: (page: number) => void
//   startIdx: number
//   pageSize: number
//   total: number
// }) {
//   const endIdx = Math.min(startIdx + pageSize, total)

//   // Build a compact list of pages with ellipses
//   const pages = getPageNumbers(currentPage, totalPages)

//   return (
//     <div className="flex flex-col items-center gap-3 border-t pt-4 sm:flex-row sm:justify-between">
//       <p className="text-xs text-muted-foreground">
//         Affichage de <span className="font-medium text-foreground">{startIdx + 1}</span> a{" "}
//         <span className="font-medium text-foreground">{endIdx}</span> sur{" "}
//         <span className="font-medium text-foreground">{total}</span> demande(s)
//       </p>

//       <Pagination className="mx-0 w-fit justify-end">
//         <PaginationContent>
//           <PaginationItem>
//             <PaginationPrevious
//               href="#"
//               aria-disabled={currentPage <= 1}
//               tabIndex={currentPage <= 1 ? -1 : 0}
//               className={
//                 currentPage <= 1
//                   ? "pointer-events-none opacity-50"
//                   : "cursor-pointer"
//               }
//               onClick={(e) => {
//                 e.preventDefault()
//                 if (currentPage > 1) onPageChange(currentPage - 1)
//               }}
//             />
//           </PaginationItem>

//           {pages.map((p, i) =>
//             p === "ellipsis" ? (
//               <PaginationItem key={`e-${i}`}>
//                 <PaginationEllipsis />
//               </PaginationItem>
//             ) : (
//               <PaginationItem key={p}>
//                 <PaginationLink
//                   href="#"
//                   isActive={p === currentPage}
//                   className="cursor-pointer"
//                   onClick={(e) => {
//                     e.preventDefault()
//                     onPageChange(p)
//                   }}
//                 >
//                   {p}
//                 </PaginationLink>
//               </PaginationItem>
//             ),
//           )}

//           <PaginationItem>
//             <PaginationNext
//               href="#"
//               aria-disabled={currentPage >= totalPages}
//               tabIndex={currentPage >= totalPages ? -1 : 0}
//               className={
//                 currentPage >= totalPages
//                   ? "pointer-events-none opacity-50"
//                   : "cursor-pointer"
//               }
//               onClick={(e) => {
//                 e.preventDefault()
//                 if (currentPage < totalPages) onPageChange(currentPage + 1)
//               }}
//             />
//           </PaginationItem>
//         </PaginationContent>
//       </Pagination>
//     </div>
//   )
// }

function RequestDetail({
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
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle className="mr-2 h-4 w-4" />
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
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <XCircle className="mr-2 h-4 w-4" />
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
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <FileCheck className="mr-2 h-4 w-4" />
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
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Clock className="mr-2 h-4 w-4" />
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

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} o`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`
  return `${(bytes / (1024 * 1024)).toFixed(2)} Mo`
}

function formatAudienceDate(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function ScheduleAudienceDialog({
  open,
  mode,
  initialDate,
  initialLocation,
  isPending,
  onCancel,
  onConfirm,
}: {
  open: boolean
  mode: "accept" | "edit"
  initialDate: string | null
  initialLocation: string | null
  isPending: boolean
  onCancel: () => void
  onConfirm: (isoDate: string, location: string | null) => void
}) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [time, setTime] = useState<string>("10:00")
  const [location, setLocation] = useState<string>("")
  const [error, setError] = useState<string | null>(null)

  // Reset internal state whenever the dialog opens
  useEffect(() => {
    if (open) {
      const initial = initialDate ? new Date(initialDate) : null
      setSelectedDate(initial ?? undefined)
      setTime(
        initial
          ? `${String(initial.getHours()).padStart(2, "0")}:${String(initial.getMinutes()).padStart(2, "0")}`
          : "10:00",
      )
      setLocation(initialLocation ?? "")
      setError(null)
    }
  }, [open, initialDate, initialLocation])

  function handleConfirm() {
    if (!selectedDate) {
      setError("Veuillez choisir une date pour l'audience.")
      return
    }
    if (!/^\d{2}:\d{2}$/.test(time)) {
      setError("Veuillez saisir une heure valide.")
      return
    }
    const [hours, minutes] = time.split(":").map(Number)
    const combined = new Date(selectedDate)
    combined.setHours(hours, minutes, 0, 0)

    if (combined.getTime() < Date.now() - 60 * 60 * 1000) {
      setError("La date de l'audience doit etre dans le futur.")
      return
    }

    onConfirm(combined.toISOString(), location.trim() ? location.trim() : null)
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onCancel()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            {mode === "accept" ? "Programmer l'audience" : "Modifier la date de l'audience"}
          </DialogTitle>
          <DialogDescription>
            {mode === "accept"
              ? "Selectionnez une date et un lieu pour confirmer l'acceptation de cette demande. Le citoyen sera notifie."
              : "Mettez a jour les informations de l'audience pour cette demande."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="audience-date">Date de l&apos;audience</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="audience-date"
                    type="button"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate
                      ? format(selectedDate, "PPP", { locale: fr })
                      : "Choisir une date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < today}
                    locale={fr}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="audience-time">Heure</Label>
              <Input
                id="audience-time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                step={300}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="audience-location">Lieu (optionnel)</Label>
            <Textarea
              id="audience-location"
              placeholder="Ex: Cabinet du Ministre, Ministere de l'Interieur, Libreville"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              rows={2}
            />
          </div>

          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
            Annuler
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={isPending}
            className="bg-emerald-600 text-white hover:bg-emerald-700"
          >
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <CheckCircle className="mr-2 h-4 w-4" />
            )}
            {mode === "accept" ? "Confirmer et accepter" : "Enregistrer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function TablePagination({
  currentPage,
  totalPages,
  onPageChange,
  startIdx,
  pageSize,
  total,
}: {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  startIdx: number
  pageSize: number
  total: number
}) {
  const endIdx = Math.min(startIdx + pageSize, total)

  // Build a compact list of pages with ellipses
  const pages = getPageNumbers(currentPage, totalPages)

  return (
    <div className="flex flex-col items-center gap-3 border-t pt-4 sm:flex-row sm:justify-between">
      <p className="text-xs text-muted-foreground">
        Affichage de <span className="font-medium text-foreground">{startIdx + 1}</span> a{" "}
        <span className="font-medium text-foreground">{endIdx}</span> sur{" "}
        <span className="font-medium text-foreground">{total}</span> demande(s)
      </p>

      <Pagination className="mx-0 w-fit justify-end">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              aria-disabled={currentPage <= 1}
              tabIndex={currentPage <= 1 ? -1 : 0}
              className={
                currentPage <= 1
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer"
              }
              onClick={(e) => {
                e.preventDefault()
                if (currentPage > 1) onPageChange(currentPage - 1)
              }}
            />
          </PaginationItem>

          {pages.map((p, i) =>
            p === "ellipsis" ? (
              <PaginationItem key={`e-${i}`}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={p}>
                <PaginationLink
                  href="#"
                  isActive={p === currentPage}
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault()
                    onPageChange(p)
                  }}
                >
                  {p}
                </PaginationLink>
              </PaginationItem>
            ),
          )}

          <PaginationItem>
            <PaginationNext
              href="#"
              aria-disabled={currentPage >= totalPages}
              tabIndex={currentPage >= totalPages ? -1 : 0}
              className={
                currentPage >= totalPages
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer"
              }
              onClick={(e) => {
                e.preventDefault()
                if (currentPage < totalPages) onPageChange(currentPage + 1)
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}

function getPageNumbers(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const pages: (number | "ellipsis")[] = [1]

  if (current > 3) {
    pages.push("ellipsis")
  }

  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  if (current < total - 2) {
    pages.push("ellipsis")
  }

  pages.push(total)
  return pages
}
