import { Ministry } from "@/generated/prisma/client";
import { Clock } from "lucide-react";

export type StatCardProps = {
  label: string
  value: number
  icon: typeof Clock
  color: string
  bg: string
};

export type MinistryType = Omit<Ministry, "description" | "createdAt" | "updatedAt">


// context publicHeader type
export type PublicHeaderContextType = {
  pathname: string
  setMobileOpen: (open: boolean) => void
  mobileOpen: boolean
}


// typages des liens de navigation
export type NavLink = {
  href: string;
  label: string;
}

export type StatsType = {
  total: number
  pending: number
  rejected: number
  scheduled: number
  processing: number
  completed: number
}