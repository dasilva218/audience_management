'use client'
// import AdminDashboard from "@/components/admin/AdminDashboard"
import { useSession } from "@/lib/betterAuth/auth-client"
import { Loader2Icon } from "lucide-react"
import AdminDashboard from "../components/admin/AdminDashboard"

export default function AdminPage() {

  const { isPending, data: session } = useSession()

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2Icon className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">

      <AdminDashboard />

    </div>
  )


}