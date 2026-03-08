'use client'
import AdminDashboard from "@/components/admin/AdminDashboard"
import { useSession } from "@/lib/auth-client"
import { Loader2Icon } from "lucide-react"

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
      {session ? (
        <AdminDashboard />
      ) : (
          <AdminDashboard />
        // <div className="flex min-h-screen items-center justify-center bg-background">
        //   <h1 className="text-4xl font-bold text-primary">You are not authorized to view this page</h1>
        // </div>
      )}
    </div>
  )


}