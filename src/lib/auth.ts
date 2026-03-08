import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { createAuthMiddleware } from "better-auth/api";
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
        input: false,
        // default: "AGENT" // Valeur par défaut si non spécifié
      },
      // ministryId: {
      //   type: "string",
      //   input:true,

      // }
    }
  },
  // hooks: {
  //   after: createAuthMiddleware(async (ctx) => {
  //     // On cible uniquement la route de sign-in
  //     if (ctx.path !== "/sign-in/email") return;

  //     const response = ctx.context.returned;

  //     // Vérifie que la réponse contient bien un utilisateur connecté
  //     if (!response || !("user" in response) || !response.user) return;

  //     const user = response.user as { role?: string };

  //     if (user.role === "ADMIN") {
  //       throw ctx.redirect("/admin");
  //     } else {
  //       throw ctx.redirect("/dashboard");
  //     }
  //   }),
  // },

  session: {
    expiresIn: 60 * 60, // date d'expiration de la session (7 jours)
    updateAge: 60 * 60 * 24 // 1 jour (la date d'expiration de la session est mise à jour tous les 1 jour)
  },
  plugins: [nextCookies()],

});

export type AuthSession = typeof auth.$Infer.Session
export type AuthUser = typeof auth.$Infer.Session.user