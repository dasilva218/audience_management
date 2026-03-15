import { Clock } from "lucide-react";

export type StatCardProps = {
  label: string
  value: number
  icon: typeof Clock
  color: string
  bg: string
};

export interface Ministry {
  id: string
  name: string
  slug: string
}