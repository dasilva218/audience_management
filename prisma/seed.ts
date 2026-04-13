import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

enum UserRole {
  AGENT = "AGENT",
  ADMIN = "ADMIN",
}

async function main() {
  // Récupération des ministères existants
  const ministries = await prisma.ministry.findMany({
    select: { id: true, slug: true },
  });

  if (ministries.length === 0) {
    throw new Error("Aucun ministère trouvé. Veuillez d'abord exécuter le seed des ministères.");
  }

  const usersData = [
    // Ministère de l'Économie Numérique
    {
      slug: 'ministere-economie-numerique',
      users: [
        {
          name: 'Aminata Diallo',
          email: 'admin@economie-numerique.gouv.ga',
          password: 'Admin1234!',
          role: UserRole.ADMIN,
        },
        {
          name: 'Serge Ondo',
          email: 'agent@economie-numerique.gouv.ga',
          password: 'Agent1234!',
          role: UserRole.AGENT,
        },
      ],
    },
    // Ministère de la Santé Publique
    {
      slug: 'ministere-sante-publique',
      users: [
        {
          name: 'Marie-Claire Nzengue',
          email: 'admin@sante-publique.gouv.ga',
          password: 'Admin1234!',
          role: UserRole.ADMIN,
        },
        {
          name: 'Bruno Mba',
          email: 'agent@sante-publique.gouv.ga',
          password: 'Agent1234!',
          role: UserRole.AGENT,
        },
      ],
    },
    // Ministère de l'Éducation Nationale
    {
      slug: 'ministere-education-nationale',
      users: [
        {
          name: 'Pauline Obiang',
          email: 'admin@education-nationale.gouv.ga',
          password: 'Admin1234!',
          role: UserRole.ADMIN,
        },
        {
          name: 'Didier Nguema',
          email: 'agent@education-nationale.gouv.ga',
          password: 'Agent1234!',
          role: UserRole.AGENT,
        },
      ],
    },
  ];

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
          // role: user.role,
          password: user.password,
        },
      });

      // Mise à jour des champs personnalisés (role + ministryId)
      await prisma.user.update({
        where: { email: user.email },
        data: {
          role: user.role,
          ministryId: ministry.id,
          emailVerified: true,
        },
      });

      console.log(`✅ ${user.role} — ${user.name} (${user.email})`);
    }
  }

  console.log('\n🎉 Tous les utilisateurs ont été créés avec succès.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });