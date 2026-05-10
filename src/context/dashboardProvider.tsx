'use client'
import { AudienceRequest } from "@/generated/prisma/client";
import { getAudienceRequests, getDashboardStats, getMinistryById } from "@/lib/action";
import { AuthUser } from "@/lib/betterAuth/auth";
import { useSession } from "@/lib/betterAuth/auth-client";
import { MinistryType, StatCardProps, StatsType } from "@/lib/types/index_type";
import { FileText } from "lucide-react";
import { createContext, useContext, useEffect, useState } from "react";

const contextType = {
    audienceRequests: [] as AudienceRequest[],
    setAudienceRequests: (requests: AudienceRequest[]) => { },
    ministry: {} as MinistryType | null,
    setMinistry: (ministry: MinistryType) => { },
    user: {} as AuthUser | null,
    stats: {} as StatsType | null,
    setStats: (stats: StatsType) => { },
    StatsData: {} as StatCardProps[],
}

const dashboardContext = createContext<typeof contextType>(contextType)

export const useDashboardContext = () => useContext<typeof contextType>(dashboardContext)


export default function DashboardProvider({ children }: { children: React.ReactNode }) {

    const [ministry, setMinistry] = useState<MinistryType | null>(null)
    const [stats, setStats] = useState<StatsType | null>(null)
    const [audienceRequests, setAudienceRequests] = useState<AudienceRequest[]>([])
    const { isPending, data: session } = useSession()

    const user = session?.user

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
        // {
        //     label: "Rejetees",
        //     value: stats?.rejected ?? 0,
        //     icon: FileText,
        //     color: "text-foreground",
        //     bg: "bg-muted",
        // }
    ]


    const fetchDataDashboard = async () => {
        const [ministry, audienceRequest, stats] = await Promise.all([
            await getMinistryById(user?.ministryId ?? ""),
            await getAudienceRequests(user?.ministryId ?? ""),
            await getDashboardStats(user?.ministryId ?? "")
        ])

        setMinistry(ministry)
        setAudienceRequests(audienceRequest)
        if (stats) {
            setStats(stats)
        }
    }

    useEffect(() => {
        fetchDataDashboard()
    }, [])

    return (
        <dashboardContext.Provider value={{ audienceRequests, setAudienceRequests, ministry, setMinistry, user: user ?? null, stats, setStats, StatsData }}>
            {children}
        </dashboardContext.Provider>
    );
}
