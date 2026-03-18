'use client'
import { PublicHeaderContextType } from "@/lib/types/index_type";
import { usePathname } from "next/navigation";
import { createContext, useContext, useState } from "react";


const data: PublicHeaderContextType = {
  pathname: "",
  setMobileOpen: (open: boolean) => { },
  mobileOpen: false
}

const PublicHeaderContext = createContext(data)

export const usePublicHeaderContext = () => useContext(PublicHeaderContext)

export const PublicHeaderProvider = ({ children }: { children: React.ReactNode }) => {

  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <PublicHeaderContext.Provider value={{ pathname, setMobileOpen, mobileOpen }}>
    { children }
    </PublicHeaderContext.Provider>
  )
}   