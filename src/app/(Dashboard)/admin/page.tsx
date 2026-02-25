'use client'
import Login from "@/components/admin/Login"
import { Loader2Icon } from "lucide-react"
import { useEffect, useState } from "react"

export default function AdminPage() {

  const [user] = useState(null)
  const [mounted, setMounted] = useState<boolean>(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2Icon className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) {
    return <Login />
  }


}