import { Card, CardContent } from "@/components/ui/card";
import { StatCardProps } from "@/lib/types/index_type";

export default function StatCard({
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