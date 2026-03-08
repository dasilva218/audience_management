"use server"

import { auth } from "@/lib/auth"
import { LoginFormData, RegisterFormData } from "@/schema"
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

export type AuthPromise = {
  success: boolean
  message: string
  callbackURL?: string
}