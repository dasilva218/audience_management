
import { NavLink } from "../types/index_type";


enum UserRole {
  AGENT = "AGENT",
  ADMIN = "ADMIN",
}

export const navLinks: NavLink[] = [
  { href: "/", label: "Accueil" },
  { href: "/demande", label: "Nouvelle demande" },
  { href: "/suivi", label: "Suivi" },
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