'use client'
import { useState } from "react";
import { StatCardProps } from "@/lib/types/index_type";
import { BarChart3, CheckCircle, Clock, FileCheck, FileText } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Main() {

  const [stats, setStats] = useState({ total: 0, enAttente: 0, acceptees: 0, rejetees: 0, terminees: 0 })

  return (
    <main className="mx-auto max-w-7xl px-4 py-6">
      <Tabs>
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
                value={stats.enAttente}
                icon={Clock}
                color="text-amber-700"
                bg="bg-amber-50"
              />
              <StatCard
                label="Acceptees"
                value={stats.acceptees}
                icon={CheckCircle}
                color="text-emerald-700"
                bg="bg-emerald-50"
              />
              <StatCard
                label="Terminees"
                value={stats.terminees}
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
                {/* <RequestTable
                  requests={requests.slice(0, 5)}
                  onView={setSelectedRequest}
                /> */}
              </CardContent>
            </Card>
          </div>
        </TabsContent>


      </Tabs>
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