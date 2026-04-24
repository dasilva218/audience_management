
import { MinistryType, NavLink } from "../types/index_type";


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