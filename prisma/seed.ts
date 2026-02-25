import { Ministry } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";

async function main() {
  const ministries: Partial<Ministry>[] = [
    {
      name: "Ministère de l'Économie Numérique",
      slug: 'ministere-economie-numerique',
      description: 'Responsable de la transformation numérique et du développement des technologies de l\'information.',
    },
    {
      name: 'Ministère de la Santé Publique',
      slug: 'ministere-sante-publique',
      description: 'Chargé de la politique nationale de santé, de la prévention et de l\'organisation des soins.',
    },
    {
      name: 'Ministère de l\'Éducation Nationale',
      slug: 'ministere-education-nationale',
      description: 'Responsable de l\'organisation et du financement du système éducatif public.',
    },
  ];

  for (const ministry of ministries) {
    await prisma.ministry.upsert({
      where: { slug: ministry.slug },
      update: {},
      create: ministry as Ministry,
    });
  }

  console.log('✅ Trois ministères créés avec succès.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });