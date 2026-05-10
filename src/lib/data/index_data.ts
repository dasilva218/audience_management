
import { BarChart3Icon, FileTextIcon } from "lucide-react";
import { MinistryType, NavLink } from "../types/index_type";
import { RequestStatus } from "@/generated/prisma/enums";


enum UserRole {
  AGENT = "AGENT",
  ADMIN = "ADMIN",
}

export const navLinks: NavLink[] = [
  { href: "/", label: "Accueil" },
  { href: "/demande", label: "Nouvelle demande" },
  { href: "/suivi", label: "Suivi" },
]

export const MINISTRIES: Omit<MinistryType, 'id_ministry'>[] = [

  { name: "Ministere de l'Economie Numérique", slug: "ministere-economie-numerique" },
  { name: "Ministere de la Santé", slug: "ministere-sante-publique" },
  { name: "Ministere de l'Education Nationale", slug: "ministere-education-nationale" },

]

export const STATUS_LABELS: Record<string, string> = {
  PENDING: "En attente",
  REJECTED: "Rejetee",
  SCHEDULED: "Acceptee",
  COMPLETED: "Terminee",
}

export const statusStyles: Record<RequestStatus, string> = {
  PENDING: "bg-amber-100 text-amber-800 border-amber-200",
  REJECTED: "bg-red-100 text-red-800 border-red-200",
  SCHEDULED: "bg-blue-100 text-blue-800 border-blue-200",
  COMPLETED: "bg-green-100 text-green-800 border-green-200",
}

export const usersData = [
  // Ministère de l'Économie Numérique
  {
    slug: 'ministere-economie-numerique',
    users: [
      {
        name: 'Aminata Diallo',
        email: 'admin@economie-numerique.gouv.ga',
        password: 'Admin1234!',
        role: UserRole.ADMIN,
      },
      {
        name: 'Serge Ondo',
        email: 'agent@economie-numerique.gouv.ga',
        password: 'Agent1234!',
        role: UserRole.AGENT,
      },
    ],
  },
  // Ministère de la Santé Publique
  {
    slug: 'ministere-sante-publique',
    users: [
      {
        name: 'Marie-Claire Nzengue',
        email: 'admin@sante-publique.gouv.ga',
        password: 'Admin1234!',
        role: UserRole.ADMIN,
      },
      {
        name: 'Bruno Mba',
        email: 'agent@sante-publique.gouv.ga',
        password: 'Agent1234!',
        role: UserRole.AGENT,
      },
    ],
  },
  // Ministère de l'Éducation Nationale
  {
    slug: 'ministere-education-nationale',
    users: [
      {
        name: 'Pauline Obiang',
        email: 'admin@education-nationale.gouv.ga',
        password: 'Admin1234!',
        role: UserRole.ADMIN,
      },
      {
        name: 'Didier Nguema',
        email: 'agent@education-nationale.gouv.ga',
        password: 'Agent1234!',
        role: UserRole.AGENT,
      },
    ],
  },
];

export enum NavTab {
  OVERVIEW = "overview",
  REQUESTS = "requests",
}

export const TabsNav = [
  { value: NavTab.OVERVIEW, label: "Vue d'ensemble", icon: BarChart3Icon },
  { value: NavTab.REQUESTS, label: "Demandes", icon: FileTextIcon },
]


export const FilterStatus = [
  { value: "ALL", label: "Tous" },
  { value: "PENDING", label: "En attente" },
  { value: "SCHEDULED", label: "Acceptees" },
  { value: "REJECTED", label: "Rejetees" },
  { value: "COMPLETED", label: "Terminees" },
]
