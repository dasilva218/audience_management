"use server"

import { auth } from "@/lib/auth"
import { audienceRequestSchema, LoginFormData, RegisterFormData } from "@/schema"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import prisma from "../prisma"
import { Ministry } from "@/generated/prisma/client"
import { MinistryType } from "../types/index_type"
import { GenerateTrackingCode } from "../services"
import { supabaseClient } from "../supabase/client"

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
          role: params.role,
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

export const lookupRequest = async (trackingCode: string) => {
  try {
    const request = await prisma.audienceRequest.findUnique({
      where: {
        trackingCode: trackingCode,
      },
    })
    if (!request) {
      return { success: false, message: "Demande non trouvée" }
    }
    return { success: true, request }
  } catch (error) {
    console.log(error)
    return { success: false, message: "Erreur lors de la recherche" }
  }
}

export const submitAudienceRequest = async (formData: FormData) => {

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
  // validation des fichiers pdf et image et format
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

  try {

    // Création de nom unique pour la demande
    const timestamp = Date.now();
    const letterFileName = `${timestamp}-${result.data.lastName.replace(/\s+/g, '-')}-letter-demande`;
    const identityFileName = `${timestamp}-${result.data.lastName.replace(/\s+/g, '-')}-piece-identity`;

    // Création du chemin pour les fichiers
    const identityFilePath = `identity/${identityFileName}`;
    const letterFilePath = `letter/${letterFileName}`;

    // upload des fichiers avec supabase storage
    const [identityDocUrl, requestLetterUrl] = await Promise.all([

      await supabaseClient().storage.from('request').upload(
        identityFilePath,
        result.data.identityDoc,
        {
          contentType: result.data.identityDoc.type,
          cacheControl: '3600'
        }
      ),

      await supabaseClient().storage.from('request').upload(
        letterFilePath,
        result.data.requestLetter,
        {
          contentType: result.data.requestLetter.type,
          cacheControl: '3600'
        }
      )
    ])

    if (identityDocUrl.error || requestLetterUrl.error) {
      return {
        success: false as const,
        errors: { identityDoc: [identityDocUrl.error?.message || ""], requestLetter: [requestLetterUrl.error?.message || ""] },
      }
    }
    // Récupération de l'URL publique
    const { data: urlIdentityDoc } = supabaseClient().storage
      .from('request')
      .getPublicUrl(identityFilePath);

    const { data: urlRequestLetter } = supabaseClient().storage
      .from('request')
      .getPublicUrl(letterFilePath);

    const newAudienceRequest = {
      trackingCode: GenerateTrackingCode(),
      fullName: `${result.data.firstName} ${result.data.lastName}`,
      email: result.data.email,
      phone: result.data.phone,
      subject: result.data.subject,
      message: result.data.description,
      identityDocUrl: urlIdentityDoc.publicUrl,
      requestLetterUrl: urlRequestLetter.publicUrl,
      ministryId: result.data.ministryId,
    }

    const createdRequest = await prisma.audienceRequest.create({
      data: newAudienceRequest
    })

    if (!createdRequest) {
      return {
        success: false as const,
        errors: { message: "Erreur lors de la création de la demande" },
      }
    }

    return {
      success: true as const,
      trackingCode: createdRequest.trackingCode,
    }

  } catch (error) {
    console.log(error)
    return {
      success: false as const,
      errors: { message: "Erreur lors de la création de la demande" },
    }
  }
}


export const getMinistries = async () => {

  try {

    const res = await prisma.ministry.findMany({
      select: {
        id_ministry: true,
        name: true,
        slug: true,
      },
      orderBy: {
        name: "asc",
      },
    })

    if (!res) {
      return []
    }

    const ministries: MinistryType[] = res.map((item) => ({
      id_ministry: item.id_ministry,
      name: item.name,
      slug: item.slug,
    }))

    return ministries

  } catch (error) {
    console.log(error)
    return []
  }
}




export type AuthPromise = {
  success: boolean
  message: string
  callbackURL?: string
}