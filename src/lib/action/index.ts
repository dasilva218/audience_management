"use server"

import { auth } from "@/lib/betterAuth/auth"
import { audienceRequestSchema, LoginFormData, RegisterFormData } from "@/schema"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import prisma from "../prisma"
import { MinistryType } from "../types/index_type"
import { GenerateTrackingCode } from "../services"
import { supabaseClient } from "../supabase/client"
import { AudienceRequest } from "@/generated/prisma/client"

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

// suivre une demande d'audience
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

// soumettre une demande d'audience
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

// recuperation de la liste des ministeres
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

// recuperation d'un ministere par son id
export const getMinistryById = async (id: string) => {

  try {

    const res = await prisma.ministry.findUnique({
      where: {
        id_ministry: id,
      },
      select: {
        id_ministry: true,
        name: true,
        slug: true,
      },
    })

    if (!res) {
      return null
    }

    const ministry: MinistryType = {
      id_ministry: res.id_ministry,
      name: res.name,
      slug: res.slug,
    }

    return ministry

  } catch (error) {
    console.log(error)
    return null
  }
}

// recuperation de la liste des demandes d'audience
export const getAudienceRequests = async (ministryId: string) => {

  try {

    const res = await prisma.audienceRequest.findMany({
      where: {
        ministryId: ministryId,
      },
      select: {
        id_audience: true,
        trackingCode: true,
        fullName: true,
        email: true,
        phone: true,
        subject: true,
        message: true,
        identityDocUrl: true,
        requestLetterUrl: true,
        ministryId: true,
        status: true,
        adminNote: true,
        scheduledAt: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    if (!res) {
      return []
    }

    const audienceRequests: AudienceRequest[] = res.map((item) => ({
      id_audience: item.id_audience,
      trackingCode: item.trackingCode,
      fullName: item.fullName,
      email: item.email,
      phone: item.phone,
      subject: item.subject,
      message: item.message,
      identityDocUrl: item.identityDocUrl,
      requestLetterUrl: item.requestLetterUrl,
      ministryId: item.ministryId,
      status: item.status,
      adminNote: item.adminNote,
      scheduledAt: item.scheduledAt,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }))

    return audienceRequests

  } catch (error) {
    console.log(error)
    return []
  }
}


export const getDashboardStats = async (ministryId: string) => {

  try {

    const res = await prisma.audienceRequest.findMany({
      where: {
        ministryId: ministryId,
      },
      select: {
        status: true,
      },
    })

    if (!res) {
      return null
    }

    const stats = {
      total: res.length,
      pending: res.filter((item) => item.status === "PENDING").length,
      rejected: res.filter((item) => item.status === "REJECTED").length,
      scheduled: res.filter((item) => item.status === "SCHEDULED").length,
      processing: res.filter((item) => item.status === "PROCESSING").length,
      completed: res.filter((item) => item.status === "COMPLETED").length,
    }


    return stats

  } catch (error) {
    console.log(error)
    return
  }
}


export type AuthPromise = {
  success: boolean
  message: string
  callbackURL?: string
}