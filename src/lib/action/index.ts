"use server"

import { auth } from "@/lib/auth"
import { audienceRequestSchema, LoginFormData, RegisterFormData } from "@/schema"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export const SignIn = async (params: LoginFormData): Promise<AuthPromise> => {
  try {
    const { url } = await auth.api.signInEmail(
      {
        headers: await headers(),
        body: {
          email: params.email,
          password: params.password,
          callbackURL: `${process.env.BETTER_AUTH_URL}/admin`
        }
      }
    )
    return { success: true, message: "Connexion réussie", callbackURL: url }
  } catch (error) {
    const e = error as Error
    console.log(e);
    return { success: false, message: "Erreur de connexion" }
  }
}

export const SignUp = async (params: RegisterFormData): Promise<AuthPromise> => {
  try {
    await auth.api.signUpEmail(
      {
        body: {
          name: params.email.split("@")[0], // Utiliser l'email pour générer un nom par défaut
          email: params.email,
          password: params.password,
          // role: params.role,
          callbackURL: `${process.env.NEXT_PUBLIC_BASE_URL}/login`
        }
      }
    )

    return { success: true, message: "Inscription réussie" }
  } catch (error) {
    const e = error as Error
    console.log(e);

    return { success: false, message: "Erreur d'inscription" }
  }
}

export const SignOut = async () => {

  await auth.api.signOut({
    headers: await headers()
  })
  redirect('/login')
}

export const SubmitAudience = async () => {

}

export async function submitAudienceRequest(formData: FormData) {

  const rawData = {
    firstName: formData.get("firstName") as string,
    lastName: formData.get("lastName") as string,
    email: formData.get("email") as string,
    phone: formData.get("phone") as string,
    nationalId: formData.get("nationalId") as string,
    ministryId: formData.get("ministryId") as string,
    subject: formData.get("subject") as string,
    description: formData.get("description") as string,
    identityDoc: formData.get("identityDoc") as File | null,
    requestLetter: formData.get("requestLetter") as File | null,
  }

  const result = audienceRequestSchema.safeParse(rawData)

  if (!result.success) {
    return {
      success: false as const,
      errors: result.error,
    }
  }
  // File validation simulation

  if (!rawData.identityDoc || rawData.identityDoc.size === 0) {
    return {
      success: false as const,
      errors: { identityDoc: ["La piece d'identite est requise"] },
    }
  }
  if (!rawData.requestLetter || rawData.requestLetter.size === 0) {
    return {
      success: false as const,
      errors: { requestLetter: ["La lettre de demande est requise"] },
    }
  }

  // Validate file types
  const allowedTypes = ["application/pdf", "image/jpeg", "image/png"]
  if (!allowedTypes.includes(rawData.identityDoc.type)) {
    return {
      success: false as const,
      errors: { identityDoc: ["Format accepte: PDF, JPEG, PNG"] },
    }
  }
  if (rawData.requestLetter.type !== "application/pdf") {
    return {
      success: false as const,
      errors: { requestLetter: ["Format accepte: PDF uniquement"] },
    }
  }

  // Validate file sizes (max 5MB)
  const maxSize = 5 * 1024 * 1024
  if (rawData.identityDoc.size > maxSize) {
    return {
      success: false as const,
      errors: { identityDoc: ["La taille maximale est de 5 Mo"] },
    }
  }
  if (rawData.requestLetter.size > maxSize) {
    return {
      success: false as const,
      errors: { requestLetter: ["La taille maximale est de 5 Mo"] },
    }
  }

  const newRequest = createRequest(result.data)

  return {
    success: true as const,
    trackingCode: newRequest.trackingCode,
  }
}

export type AuthPromise = {
  success: boolean
  message: string
  callbackURL?: string
}