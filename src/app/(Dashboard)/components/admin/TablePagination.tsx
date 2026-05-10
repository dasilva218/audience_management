import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"

export default function TablePagination({
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