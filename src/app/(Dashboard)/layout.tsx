import { getSession } from "@/lib/auth-server";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function DashboardLayout({ children }: { children: ReactNode }) {

  // const session = await getSession()

  // if (!session) {
  //   redirect("/login")
  // }

  return (
    <div className="min-h-screen bg-background" >

      {children}

    </div>
  );
}