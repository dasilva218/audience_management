'use client'
import { useCallback, useEffect, useState } from "react";
import { StatCardProps } from "@/lib/types/index_type";
import { BarChart3, CheckCircle, Clock, Eye, FileCheck, FileText } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AudienceRequest, RequestStatus } from "@/generated/prisma/client";
import { getDashboardStats } from "@/lib/action";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

const statusStyles: Record<RequestStatus, string> = {
  PENDING: "bg-amber-100 text-amber-800 border-amber-200",
  REJECTED: "bg-red-100 text-red-800 border-red-200",
  SCHEDULED: "bg-blue-100 text-blue-800 border-blue-200",
  PROCESSING: "bg-purple-100 text-purple-800 border-purple-200",
  COMPLETED: "bg-green-100 text-green-800 border-green-200",
}

export const STATUS_LABELS: Record<string, string> = {
  PENDING: "En attente",
  REJECTED: "Rejetee",
  SCHEDULED: "Acceptee",
  PROCESSING: "En traitement",
  COMPLETED: "Terminee",
}

export default function Main({ ministryId, audienceRequests }: { ministryId: string, audienceRequests: AudienceRequest[] | null }) {

  const [selectedRequest, setSelectedRequest] = useState<AudienceRequest | null>(null)
  const [stats, setStats] = useState({ total: 0, pending: 0, rejected: 0, scheduled: 0, processing: 0, completed: 0 })

  const getData = useCallback(async () => {
    const stats = await getDashboardStats(ministryId)
    if (stats) {
      setStats(stats)
    }
  }, [ministryId])

  useEffect(() => {
    getData()
  }, [getData])

  return (
    <main className="mx-auto max-w-7xl px-4 py-6">
      {
        selectedRequest ? (
          "Hello World"
          // <RequestDetail
          //   request={selectedRequest}
          //   onBack={() => {
          //     setSelectedRequest(null)
          //     refreshData()
          //   }}
          //   onStatusChange={() => refreshData()}
          // />
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
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                  <StatCard
                    label="Total"
                    value={stats.total}
                    icon={FileText}
                    color="text-foreground"
                    bg="bg-muted"
                  />
                  <StatCard
                    label="En attente"
                    value={stats.pending}
                    icon={Clock}
                    color="text-amber-700"
                    bg="bg-amber-50"
                  />
                  <StatCard
                    label="Acceptees"
                    value={stats.scheduled}
                    icon={CheckCircle}
                    color="text-emerald-700"
                    bg="bg-emerald-50"
                  />
                  <StatCard
                    label="Terminees"
                    value={stats.completed}
                    icon={FileCheck}
                    color="text-blue-700"
                    bg="bg-blue-50"
                  />
                </div>

                {/* Recent requests */}
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


// function RequestDetail({
//   request,
//   onBack,
//   onStatusChange,
// }: {
//   request: AudienceRequest
//   onBack: () => void
//   onStatusChange: () => void
// }) {
//   const [isPending, startTransition] = useTransition()
//   const [currentStatus, setCurrentStatus] = useState(request.status)

//   function handleStatusChange(newStatus: RequestStatus) {
//     startTransition(async () => {
//       const result = await changeRequestStatus(request.id, newStatus)
//       if (result.success) {
//         setCurrentStatus(newStatus)
//         onStatusChange()
//         toast.success(`Statut mis a jour: ${STATUS_LABELS[newStatus]}`)
//       } else {
//         toast.error(result.error)
//       }
//     })
//   }

//   return (
//     <div className="flex flex-col gap-6">
//       <Button variant="ghost" onClick={onBack} className="w-fit text-muted-foreground">
//         <ChevronLeft className="mr-1 h-4 w-4" />
//         Retour a la liste
//       </Button>

//       <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
//         {/* Main info */}
//         <Card className="lg:col-span-2">
//           <CardHeader>
//             <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
//               <div>
//                 <CardTitle className="text-lg text-foreground">{request.subject}</CardTitle>
//                 <CardDescription className="font-mono">{request.trackingCode}</CardDescription>
//               </div>
//               <span
//                 className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium ${statusStyles[currentStatus]}`}
//               >
//                 {STATUS_LABELS[currentStatus]}
//               </span>
//             </div>
//           </CardHeader>
//           <CardContent className="flex flex-col gap-6">
//             <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//               <DetailField label="Nom" value={request.lastName} />
//               <DetailField label="Prenom" value={request.firstName} />
//               <DetailField label="Email" value={request.email} />
//               <DetailField label="Telephone" value={request.phone} />
//               <DetailField label="Piece d'identite" value={request.nationalId} />
//               <DetailField
//                 label="Date de soumission"
//                 value={new Date(request.createdAt).toLocaleDateString("fr-FR", {
//                   day: "numeric",
//                   month: "long",
//                   year: "numeric",
//                 })}
//               />
//             </div>
//             <div className="border-t pt-4">
//               <p className="text-sm font-medium text-foreground mb-2">Description</p>
//               <p className="text-sm text-muted-foreground leading-relaxed">
//                 {request.description}
//               </p>
//             </div>

//             {/* Documents */}
//             <div className="border-t pt-4">
//               <p className="text-sm font-medium text-foreground mb-3">Documents joints</p>
//               <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
//                 <div className="flex items-center gap-3 rounded-lg border p-3">
//                   <FileText className="h-5 w-5 text-primary" />
//                   <div className="flex flex-col">
//                     <p className="text-sm font-medium text-foreground">Piece d{"'"}identite</p>
//                     <p className="text-xs text-muted-foreground">Document CNI/Passeport</p>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-3 rounded-lg border p-3">
//                   <FileText className="h-5 w-5 text-primary" />
//                   <div className="flex flex-col">
//                     <p className="text-sm font-medium text-foreground">Lettre de demande</p>
//                     <p className="text-xs text-muted-foreground">Document PDF</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Actions sidebar */}
//         <Card>
//           <CardHeader>
//             <CardTitle className="text-base text-foreground">Actions</CardTitle>
//             <CardDescription>Modifier le statut de cette demande.</CardDescription>
//           </CardHeader>
//           <CardContent className="flex flex-col gap-2">
//             {currentStatus !== "ACCEPTEE" && (
//               <Button
//                 onClick={() => handleStatusChange("ACCEPTEE")}
//                 disabled={isPending}
//                 className="w-full justify-start bg-emerald-600 text-white hover:bg-emerald-700"
//               >
//                 {isPending ? (
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                 ) : (
//                   <CheckCircle className="mr-2 h-4 w-4" />
//                 )}
//                 Accepter
//               </Button>
//             )}
//             {currentStatus !== "REJETEE" && (
//               <Button
//                 onClick={() => handleStatusChange("REJETEE")}
//                 disabled={isPending}
//                 variant="destructive"
//                 className="w-full justify-start"
//               >
//                 {isPending ? (
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                 ) : (
//                   <XCircle className="mr-2 h-4 w-4" />
//                 )}
//                 Rejeter
//               </Button>
//             )}
//             {currentStatus === "ACCEPTEE" && (
//               <Button
//                 onClick={() => handleStatusChange("TERMINEE")}
//                 disabled={isPending}
//                 className="w-full justify-start bg-blue-600 text-white hover:bg-blue-700"
//               >
//                 {isPending ? (
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                 ) : (
//                   <FileCheck className="mr-2 h-4 w-4" />
//                 )}
//                 Marquer comme terminee
//               </Button>
//             )}
//             {currentStatus !== "EN_ATTENTE" && (
//               <Button
//                 onClick={() => handleStatusChange("EN_ATTENTE")}
//                 disabled={isPending}
//                 variant="outline"
//                 className="w-full justify-start"
//               >
//                 {isPending ? (
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                 ) : (
//                   <Clock className="mr-2 h-4 w-4" />
//                 )}
//                 Remettre en attente
//               </Button>
//             )}
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   )
// }