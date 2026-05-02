'use client'
// import AdminDashboard from "@/components/admin/AdminDashboard"
import { useSession } from "@/lib/betterAuth/auth-client"
import { Loader2Icon } from "lucide-react"
import Header from "../components/admin/Header"
import Main from "../components/admin/Main"
import { useCallback, useEffect, useState } from "react"
import { MinistryType } from "@/lib/types/index_type"
import { getAudienceRequests, getMinistryById } from "@/lib/action"
import { AudienceRequest } from "@/generated/prisma/client"

export default function AdminPage() {

  const [ministry, setMinistry] = useState<MinistryType | null>(null)
  const [audienceRequests, setAudienceRequests] = useState<AudienceRequest[] | null>(null)

  const { isPending, data: session } = useSession()

  const user = session?.user

  const refreshData = useCallback(async () => {
    const [ministry, audienceRequest] = await Promise.all([
      await getMinistryById(user?.ministryId ?? ""),
      await getAudienceRequests(user?.ministryId ?? ""),
    ])

    setMinistry(ministry)
    setAudienceRequests(audienceRequest)
  }, [user?.ministryId])

  useEffect(() => {
    refreshData()
  }, [refreshData])

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2Icon className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">

      {/* Admin Header */}
      <Header ministry={ministry} user={user ?? null} />
      {/* Admin main */}
      <Main audienceRequests={audienceRequests} />

    </div>
  )


}