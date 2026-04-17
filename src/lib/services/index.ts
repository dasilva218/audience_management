

import { auth } from "../auth";
import { MINISTRIES, usersData } from "../data/index_data";
import prisma from "../prisma";

export const SeedMinistries = async () => {
  const ministriesData = MINISTRIES

  for (const { name, slug } of ministriesData) {
    // Vérifie si le ministère existe déjà
    const existing = await prisma.ministry.findUnique({
      where: { name },
    });

    if (existing) {
      console.log(`⏭️  Déjà existant : ${name}`);
      continue;
    }

    // Création du ministère
    await prisma.ministry.create({
      data: {
        name,
        slug
      },
    });

    console.log(`✅ Ministère créé : ${name}`);
  }

  console.log('\n🎉 Tous les ministères ont été créés avec succès.');

}

export const SeedUsers = async () => {
  // Récupération des ministères existants
  const ministries = await prisma.ministry.findMany({
    select: { id_ministry: true, slug: true },
  });

  if (ministries.length === 0) {
    throw new Error("Aucun ministère trouvé. Veuillez d'abord exécuter le seed des ministères.");
  }


  for (const { slug, users } of usersData) {
    const ministry = ministries.find((m) => m.slug === slug);

    if (!ministry) {
      console.warn(`⚠️  Ministère introuvable pour le slug : ${slug}`);
      continue;
    }

    for (const user of users) {
      // Vérifie si l'utilisateur existe déjà
      const existing = await prisma.user.findUnique({
        where: { email: user.email },
      });

      if (existing) {
        console.log(`⏭️  Déjà existant : ${user.email}`);
        continue;
      }

      // Création via Better Auth (gère le hash du mot de passe)
      await auth.api.signUpEmail({
        body: {
          name: user.name,
          email: user.email,
          role: user.role,
          password: user.password,
        },
      });

      // Mise à jour des champs personnalisés (role + ministryId)
      await prisma.user.update({
        where: { email: user.email },
        data: {
          role: user.role,
          ministryId: ministry.id_ministry,
          emailVerified: true,
        },
      });

      console.log(`✅ ${user.role} — ${user.name} (${user.email})`);
    }
  }

  console.log('\n🎉 Tous les utilisateurs ont été créés avec succès.');
}