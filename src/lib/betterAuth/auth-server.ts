import { headers } from "next/headers";
import { auth } from "./auth";
// import { auth } from "./auth";

export async function getSession() {
  try {
    const session = await auth.api.getSession({
      headers: await headers() // Utiliser headers() de Next.js
    });
    return session;
  } catch (error) {
    console.error('Erreur récupération session:', error);
    return null;
  }
}

export async function requireAuth() {
  const session = await getSession();
  if (!session?.session || !session?.user) {
    throw new Error('Authentication required');
  }
  return session;
}