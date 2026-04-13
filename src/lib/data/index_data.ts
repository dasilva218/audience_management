
import { Ministri, NavLink } from "../types/index_type";

export const navLinks: NavLink[] = [
  { href: "/", label: "Accueil" },
  { href: "/demande", label: "Nouvelle demande" },
  { href: "/suivi", label: "Suivi" },
]

export const MINISTRIES: Ministri[] = [
  { id: "1", name: "Ministere de l'Interieur", slug: "interieur" },
  { id: "2", name: "Ministere de l'Economie et des Finances", slug: "economie-finances" },
  { id: "3", name: "Ministere de la Sante", slug: "sante" },
  { id: "4", name: "Ministere de l'Education Nationale", slug: "education" },
  { id: "5", name: "Ministere de la Justice", slug: "justice" },
  { id: "6", name: "Ministere des Affaires Etrangeres", slug: "affaires-etrangeres" },
  { id: "7", name: "Ministere des Travaux Publics", slug: "travaux-publics" },
  { id: "8", name: "Ministere de l'Agriculture", slug: "agriculture" },
  { id: "9", name: "Ministere du Petrole et du Gaz", slug: "petrole-gaz" },
  { id: "10", name: "Ministere de la Communication", slug: "communication" },
]