'use client'
// import AdminDashboard from "@/components/admin/AdminDashboard"
import { useSession } from "@/lib/betterAuth/auth-client"
import { Loader2Icon } from "lucide-react"
import Header from "../components/admin/Header"
import Main from "../components/admin/Main"
import MainPage from "../components/MainPage"


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
    <>
      {/* Admin Header */}
      <Header />
      {/* Admin main */}
      <MainPage />
      {/* <Main /> */}
    </>
  )


}