'use client'
import { AudienceRequest } from "@/generated/prisma/client";
import { getAudienceRequests, getDashboardStats, getMinistryById } from "@/lib/action";
import { AuthUser } from "@/lib/betterAuth/auth";
import { useSession } from "@/lib/betterAuth/auth-client";
import { MinistryType, StatCardProps, StatsType } from "@/lib/types/index_type";
import { Calendar, CheckCircle, Clock, FileText } from "lucide-react";
import { createContext, useCallback, useContext, useEffect, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface DashboardContextType {
    audienceRequests: AudienceRequest[];
    setAudienceRequests: (requests: AudienceRequest[]) => void;
    ministry: MinistryType | null;
    setMinistry: (ministry: MinistryType) => void;
    user: AuthUser | null;
    stats: StatsType | null;
    setStats: (stats: StatsType) => void;
    statsData: StatCardProps[];
    isLoading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

// ─── Valeur par défaut du contexte ───────────────────────────────────────────

const defaultContext: DashboardContextType = {
    audienceRequests: [],
    setAudienceRequests: () => { },
    ministry: null,
    setMinistry: () => { },
    user: null,
    stats: null,
    setStats: () => { },
    statsData: [],
    isLoading: false,
    error: null,
    refetch: async () => { },
};

// ─── Contexte ─────────────────────────────────────────────────────────────────

const DashboardContext = createContext<DashboardContextType>(defaultContext);

export const useDashboardContext = () => useContext(DashboardContext);

// ─── Provider ─────────────────────────────────────────────────────────────────

export default function DashboardProvider({ children }: { children: React.ReactNode }) {
    const [ministry, setMinistry] = useState<MinistryType | null>(null);
    const [stats, setStats] = useState<StatsType | null>(null);
    const [audienceRequests, setAudienceRequests] = useState<AudienceRequest[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { data: session } = useSession();
    const user = session?.user ?? null;

    // ── Fetch ──────────────────────────────────────────────────────────────────

    const fetchDataDashboard = useCallback(async () => {
        const ministryId = user?.ministryId;
        if (!ministryId) return;

        setIsLoading(true);
        setError(null);

        try {
            const [ministryData, audienceData, statsData] = await Promise.all([
                getMinistryById(ministryId),
                getAudienceRequests(ministryId),
                getDashboardStats(ministryId),
            ]);

            setMinistry(ministryData);
            setAudienceRequests(audienceData);
            if (statsData) setStats(statsData);
        } catch (err) {
            console.error("Erreur lors du chargement du dashboard :", err);
            setError("Impossible de charger les données. Veuillez réessayer.");
        } finally {
            setIsLoading(false);
        }
    }, [user?.ministryId]);

    useEffect(() => {
        fetchDataDashboard();
    }, [fetchDataDashboard]);

    // ── Stats cards ────────────────────────────────────────────────────────────

    const statsData: StatCardProps[] = [
        {
            label: "Total",
            value: stats?.total ?? 0,
            icon: FileText,
            color: "text-foreground",
            bg: "bg-muted",
        },
        {
            label: "En attente",
            value: stats?.pending ?? 0,
            icon: Clock,
            color: "text-foreground",
            bg: "bg-muted",
        },
        {
            label: "Programmées",
            value: stats?.scheduled ?? 0,
            icon: Calendar,
            color: "text-foreground",
            bg: "bg-muted",
        },
        {
            label: "Effectuées",
            value: stats?.completed ?? 0,
            icon: CheckCircle,
            color: "text-foreground",
            bg: "bg-muted",
        },
    ];

    // ── Rendu ──────────────────────────────────────────────────────────────────

    return (
        <DashboardContext.Provider
            value={{
                audienceRequests,
                setAudienceRequests,
                ministry,
                setMinistry,
                user,
                stats,
                setStats,
                statsData,
                isLoading,
                error,
                refetch: fetchDataDashboard,
            }}
        >
            {children}
        </DashboardContext.Provider>
    );
}