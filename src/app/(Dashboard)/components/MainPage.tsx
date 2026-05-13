'use client'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDashboardContext } from "@/context/dashboardProvider";
import { FilterStatus, TabsNav } from "@/lib/data/index_data";
import { BarChart3Icon, FileTextIcon } from "lucide-react";
import StatCard from "./admin/StatCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import RequestTable from "./admin/RequestTable";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import TablePagination from "./admin/TablePagination";
import { AudienceRequest } from "@/generated/prisma/client";
import AudienceDetail from "./admin/AudienceDetail";

export default function MainPage() {

    const { stats, statsData, audienceRequests } = useDashboardContext()

    const [selectedAudienceId, setSelectedAudienceId] = useState<AudienceRequest | null>(null)
    const [filterStatus, setFilterStatus] = useState("ALL")
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)

    const Filter = filterStatus === "ALL"
        ? audienceRequests
        : audienceRequests?.filter((request) => request.status === filterStatus)


    const totalPages = Math.max(1, Math.ceil(Filter.length / pageSize))
    const safePage = Math.min(currentPage, totalPages)
    const startIdx = (safePage - 1) * pageSize
    const paginatedRequests = Filter.slice(startIdx, startIdx + pageSize)

    const Audience = audienceRequests?.slice(0, 5) ?? []

    return (
        <main className="mx-auto max-w-7xl px-4 py-6">
            {
                selectedAudienceId ? <AudienceDetail onBack={() => setSelectedAudienceId(null)} request={selectedAudienceId} /> : (
                    <Tabs defaultValue="overview" >
                        <TabsList className="w-fit">
                            {
                                TabsNav.map(({ value, label, icon: Icon }) => (
                                    <TabsTrigger key={value} value={value}>
                                        <Icon className="mr-2 h-4 w-4" />
                                        {label}
                                    </TabsTrigger>
                                ))
                            }
                        </TabsList>
                        {/* les statistiques */}
                        <TabsContent value="overview">
                            <div className="flex flex-col gap-6">
                                {/* affichage des stats */}
                                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                                    {
                                        statsData.map(({ label, value, icon, color, bg }, index) => (
                                            <StatCard
                                                key={index}
                                                label={label}
                                                value={value}
                                                icon={icon}
                                                color={color}
                                                bg={bg}
                                            />
                                        ))
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
                                        <RequestTable onView={setSelectedAudienceId} requests={Audience} />
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>
                        {/* demandes  */}
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
                                            <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value)} >
                                                <SelectTrigger className="w-full sm:w-48">
                                                    <SelectValue placeholder="Filtrer par statut" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {FilterStatus.map((f) => (
                                                        <SelectItem key={f.value} value={f.value}>
                                                            {f.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <Select value={pageSize.toString()} onValueChange={(value) => setPageSize(Number(value))}>
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
                                    <RequestTable onView={setSelectedAudienceId} requests={paginatedRequests} />
                                    {Filter.length > 0 && (
                                        <TablePagination
                                            currentPage={safePage}
                                            totalPages={totalPages}
                                            onPageChange={setCurrentPage}
                                            startIdx={startIdx}
                                            pageSize={pageSize}
                                            total={Filter.length}
                                        />
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                    </Tabs>
                )
            }

        </main>
    );
}