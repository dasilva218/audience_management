import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AudienceRequest } from "@/generated/prisma/client"
import { STATUS_LABELS, statusStyles } from "@/lib/data/index_data"
import { Eye, FileTextIcon } from "lucide-react"

export default function RequestTable({
    requests,
    onView
}: {
    requests: AudienceRequest[]
    onView: (r: AudienceRequest) => void
}) {
    if (requests.length === 0) {
        return (
            <div className="flex flex-col items-center gap-2 py-12 text-center">
                <FileTextIcon className="h-8 w-8 text-muted-foreground/50" />
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
                            <Button onClick={() => onView(req)} variant="ghost" size="sm">
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