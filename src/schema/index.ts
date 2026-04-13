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

/*------ schema Demande audience -----*/

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const ACCEPTED_PDF_TYPE = "application/pdf";


export const audienceRequestSchema = z.object({
  identityDoc: z.file(),
  requestLetter: z.file(),
  firstName: z
    .string()
    .min(2, "Le prenom doit contenir au moins 2 caracteres")
    .max(50, "Le prenom ne peut exceder 50 caracteres"),
  lastName: z
    .string()
    .min(2, "Le nom doit contenir au moins 2 caracteres")
    .max(50, "Le nom ne peut exceder 50 caracteres"),
  email: z.email("Adresse email invalide"),
  phone: z
    .string()
    .regex(
      /^\+241\s?\d{2}\s?\d{2}\s?\d{2}\s?\d{2}$/,
      "Format: +241 XX XX XX XX"
    ),
  nationalId: z
    .string()
    .min(5, "Numero de piece d'identite requis"),
  ministryId: z
    .string()
    .min(1, "Veuillez selectionner un ministere"),
  subject: z
    .string()
    .min(10, "L'objet doit contenir au moins 10 caracteres")
    .max(150, "L'objet ne peut exceder 150 caracteres"),
  description: z
    .string()
    .min(30, "La description doit contenir au moins 30 caracteres")
    .max(2000, "La description ne peut exceder 2000 caracteres"),
})

export type RegisterFormData = z.infer<typeof RegisterSchema>
export type LoginFormData = z.infer<typeof loginFormSchema>
export type AudienceRequestFormData = z.infer<typeof audienceRequestSchema>