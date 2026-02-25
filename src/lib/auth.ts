import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import prisma from "./prisma";


export const auth = betterAuth({
  emailAndPassword: {
    enabled: true
  },
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),
  user: {
    additionalFields: {
      role: {
        type: ["AGENT", "ADMIN"],
        input: true,
        default: "AGENT" // Valeur par défaut si non spécifié
      }
    }
  },
  session: {
    expiresIn: 60 * 60, // date d'expiration de la session (7 jours)
    updateAge: 60 * 60 * 24 // 1 jour (la date d'expiration de la session est mise à jour tous les 1 jour)
  },
  plugins: [nextCookies()],

});

export type AuthSession = typeof auth.$Infer.Session
export type AuthUser = typeof auth.$Infer.Session.user