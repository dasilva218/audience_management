import * as z from "zod";

const passwordSchema = z
  .string()
  .min(8, "Le mot de passe doit contenir au moins 8 caractères")
// .regex(/[A-Z]/, "Doit contenir au moins une majuscule")
// .regex(/[0-9]/, "Doit contenir au moins un chiffre")
// .regex(/[!@#$%^&*]/, "Doit contenir au moins un caractère spécial");

const emailSchema = z
  .email("Format d'email invalide")
  .trim()
  .min(1, "L'email est requis")
  .toLowerCase(); // Normalise automatiquement l'email en minuscules

export const loginFormSchema = z.object({
  email: emailSchema,

  password: z
    .string()
    .min(1, "Le mot de passe est requis")
    .min(6, "Le mot de passe doit contenir au moins 6 caractères"),
})

export const RegisterSchema = z.object({
  name: z
    .string().trim()
    .min(1, "Le nom est requis"),

  email: emailSchema,

  password: passwordSchema,

  role: z.enum(["AGENT", "ADMIN"]),
})

// password: passwordSchema,
// passwordConfirmation: z.string(),
// })
// .refine(data => data.password === data.passwordConfirmation, {
// message: "Les mots de passe ne correspondent pas",
// path: ["passwordConfirmation"], // Cible l'erreur sur ce champ
// });

export type RegisterFormData = z.infer<typeof RegisterSchema>
export type LoginFormData = z.infer<typeof loginFormSchema>