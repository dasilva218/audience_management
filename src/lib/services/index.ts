import { RequestStatus } from "@/generated/prisma/enums";
import { auth } from "../betterAuth/auth";
import { MINISTRIES, usersData } from "../data/index_data";
import prisma from "../prisma";

export const hashedPassword = async (password: string) => {
  const context = await auth.$context;
  return context.password.hash(password);
};

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

export const GenerateTrackingCode = (): string => {
  const year = new Date().getFullYear()
  const num = String(Math.floor(Math.random() * 999999)).padStart(6, "0")
  return `AUD-${year}-${num}`
}

export const SeedAudienceRequests = async () => {
  const MINISTRY_ID = 'cmoj6wkj90000hdcpdtgs8hni';

  const audienceRequests = [
    {
      trackingCode: 'AUD-2024-0001',
      fullName: 'Aminata Diallo',
      email: 'aminata.diallo@gmail.com',
      phone: '+221 77 123 45 67',
      subject: 'Demande de subvention pour startup EdTech',
      message: 'Notre startup développe une plateforme d\'apprentissage en ligne adaptée aux réalités locales. Nous sollicitons une audience pour présenter notre projet et explorer les dispositifs de soutien disponibles.',
      identityDocUrl: 'https://storage.example.com/ids/aminata-diallo-cni.pdf',
      requestLetterUrl: 'https://storage.example.com/letters/AUD-2024-0001-lettre.pdf',
      status: RequestStatus.COMPLETED,
      adminNote: 'Dossier complet. Audience accordée avec le directeur de cabinet.',
      scheduledAt: new Date('2024-03-15T09:00:00Z'),
      ministryId: MINISTRY_ID,
    },
    {
      trackingCode: 'AUD-2024-0002',
      fullName: 'Moussa Konaté',
      email: 'moussa.konate@outlook.com',
      phone: '+221 76 234 56 78',
      subject: 'Recours suite à suspension de licence d\'opérateur télécom',
      message: 'Ma licence d\'opérateur de services télécom a été suspendue administrativement le 12 janvier 2024. Je conteste cette décision et souhaite exposer ma situation au Ministre.',
      identityDocUrl: 'https://storage.example.com/ids/moussa-konate-passport.pdf',
      requestLetterUrl: 'https://storage.example.com/letters/AUD-2024-0002-lettre.pdf',
      status: RequestStatus.PENDING,
      adminNote: null,
      scheduledAt: null,
      ministryId: MINISTRY_ID,
    },
    {
      trackingCode: 'AUD-2024-0003',
      fullName: 'Fatoumata Traoré',
      email: 'f.traore@yahoo.fr',
      phone: '+221 78 345 67 89',
      subject: 'Partenariat pour déploiement de points d\'accès Internet ruraux',
      message: 'Notre association souhaite déployer des hotspots WiFi communautaires dans 12 villages isolés. Nous avons besoin d\'un appui institutionnel pour l\'attribution des fréquences et le financement.',
      identityDocUrl: 'https://storage.example.com/ids/fatoumata-traore-cni.pdf',
      requestLetterUrl: 'https://storage.example.com/letters/AUD-2024-0003-lettre.pdf',
      status: RequestStatus.REJECTED,
      adminNote: 'Dossier incomplet. Manque étude de faisabilité technique. Notifier la demandeuse.',
      scheduledAt: null,
      ministryId: MINISTRY_ID,
    },
    {
      trackingCode: 'AUD-2024-0004',
      fullName: 'Ibrahima Sow',
      email: 'ibrahima.sow@techsn.com',
      phone: '+221 77 456 78 90',
      subject: 'Proposition de partenariat PPP pour digitalisation des services publics',
      message: 'Notre entreprise tech souhaite proposer une solution de digitalisation des actes d\'état civil. Nous sollicitons une audience pour présenter notre offre et discuter des modalités de partenariat.',
      identityDocUrl: 'https://storage.example.com/ids/ibrahima-sow-cni.pdf',
      requestLetterUrl: 'https://storage.example.com/letters/AUD-2024-0004-lettre.pdf',
      status: RequestStatus.COMPLETED,
      adminNote: 'Présentation très intéressante. Réunion technique avec la DSI programmée.',
      scheduledAt: new Date('2024-03-22T14:30:00Z'),
      ministryId: MINISTRY_ID,
    },
    {
      trackingCode: 'AUD-2024-0005',
      fullName: 'Mariam Coulibaly',
      email: 'mariam.coulibaly@gmail.com',
      phone: '+221 70 567 89 01',
      subject: 'Accréditation d\'un centre de formation aux métiers du numérique',
      message: 'Notre centre forme des jeunes au développement web et à la cybersécurité depuis 2021. Nous souhaitons obtenir une accréditation officielle pour pouvoir délivrer des certifications reconnues par l\'État.',
      identityDocUrl: 'https://storage.example.com/ids/mariam-coulibaly-passport.pdf',
      requestLetterUrl: 'https://storage.example.com/letters/AUD-2024-0005-lettre.pdf',
      status: RequestStatus.PENDING,
      adminNote: null,
      scheduledAt: null,
      ministryId: MINISTRY_ID,
    },
    {
      trackingCode: 'AUD-2024-0006',
      fullName: 'Ousmane Bah',
      email: 'ousmane.bah@hotmail.com',
      phone: '+221 76 678 90 12',
      subject: 'Signalement d\'une fraude à grande échelle sur mobile money',
      message: 'J\'ai été victime d\'une escroquerie en ligne via une plateforme mobile money non régulée. Plusieurs centaines de personnes semblent touchées. Je demande une audience urgente pour signaler ce réseau frauduleux.',
      identityDocUrl: 'https://storage.example.com/ids/ousmane-bah-cni.pdf',
      requestLetterUrl: 'https://storage.example.com/letters/AUD-2024-0006-lettre.pdf',
      status: RequestStatus.COMPLETED,
      adminNote: 'Cas urgent. Transmettre immédiatement à l\'ARTP et à la cellule cybersécurité.',
      scheduledAt: new Date('2024-04-02T10:00:00Z'),
      ministryId: MINISTRY_ID,
    },
    {
      trackingCode: 'AUD-2024-0007',
      fullName: 'Kadiatou Camara',
      email: 'kadiatou.camara@gmail.com',
      phone: '+221 78 789 01 23',
      subject: 'Demande de révision des tarifs d\'accès à Internet pour les PME',
      message: 'En tant que représentante d\'un groupement de PME, je constate que les tarifs d\'accès à Internet professionnel restent prohibitifs. Nous sollicitons une audience pour proposer un cadre tarifaire encadré.',
      identityDocUrl: 'https://storage.example.com/ids/kadiatou-camara-cni.pdf',
      requestLetterUrl: 'https://storage.example.com/letters/AUD-2024-0007-lettre.pdf',
      status: RequestStatus.PENDING,
      adminNote: 'À vérifier avec l\'ARTP avant toute réponse.',
      scheduledAt: null,
      ministryId: MINISTRY_ID,
    },
    {
      trackingCode: 'AUD-2024-0008',
      fullName: 'Sékou Touré',
      email: 'sekou.toure@devagency.sn',
      phone: '+221 77 890 12 34',
      subject: 'Inclusion dans le registre national des entreprises du numérique',
      message: 'Notre agence de développement logiciel existe depuis 3 ans mais n\'est pas répertoriée dans le registre officiel des entreprises du secteur numérique, ce qui nous exclut des appels d\'offres publics.',
      identityDocUrl: 'https://storage.example.com/ids/sekou-toure-passport.pdf',
      requestLetterUrl: 'https://storage.example.com/letters/AUD-2024-0008-lettre.pdf',
      status: RequestStatus.REJECTED,
      adminNote: 'Dossier NINEA non valide. Demander mise à jour des documents légaux.',
      scheduledAt: null,
      ministryId: MINISTRY_ID,
    },
    {
      trackingCode: 'AUD-2024-0009',
      fullName: 'Aïssatou Barry',
      email: 'aissatou.barry@gmail.com',
      phone: '+221 70 901 23 45',
      subject: 'Protection des données personnelles — plainte contre opérateur',
      message: 'Un opérateur télécom a divulgué mes données personnelles à des tiers sans mon consentement. Je sollicite une audience pour signaler cette violation et connaître les recours disponibles.',
      identityDocUrl: 'https://storage.example.com/ids/aissatou-barry-cni.pdf',
      requestLetterUrl: 'https://storage.example.com/letters/AUD-2024-0009-lettre.pdf',
      status: RequestStatus.COMPLETED,
      adminNote: 'Cas relevant de la CDP. Audience accordée pour orientation.',
      scheduledAt: new Date('2024-04-10T11:00:00Z'),
      ministryId: MINISTRY_ID,
    },
    {
      trackingCode: 'AUD-2024-0010',
      fullName: 'Cheikh Diop',
      email: 'cheikh.diop@incubateur.sn',
      phone: '+221 76 012 34 56',
      subject: 'Labellisation d\'un incubateur de startups technologiques',
      message: 'Notre incubateur a accompagné 40 startups depuis 2020. Nous sollicitons une labellisation officielle du Ministère afin de renforcer notre crédibilité auprès des investisseurs et partenaires internationaux.',
      identityDocUrl: 'https://storage.example.com/ids/cheikh-diop-cni.pdf',
      requestLetterUrl: 'https://storage.example.com/letters/AUD-2024-0010-lettre.pdf',
      status: RequestStatus.PENDING,
      adminNote: null,
      scheduledAt: null,
      ministryId: MINISTRY_ID,
    },
    {
      trackingCode: 'AUD-2024-0011',
      fullName: 'Ndeye Fatou Mbaye',
      email: 'ndeye.mbaye@gmail.com',
      phone: '+221 77 123 98 76',
      subject: 'Bourse de formation en cybersécurité à l\'étranger',
      message: 'Ingénieure informatique diplômée avec mention, je souhaite me spécialiser en cybersécurité dans une université partenaire. Je sollicite une bourse dans le cadre du programme de formation aux métiers du numérique.',
      identityDocUrl: 'https://storage.example.com/ids/ndeye-mbaye-cni.pdf',
      requestLetterUrl: 'https://storage.example.com/letters/AUD-2024-0011-lettre.pdf',
      status: RequestStatus.COMPLETED,
      adminNote: 'Profil excellent. Transmettre au programme de bourses numériques.',
      scheduledAt: new Date('2024-04-18T09:30:00Z'),
      ministryId: MINISTRY_ID,
    },
    {
      trackingCode: 'AUD-2024-0012',
      fullName: 'Alioune Badara Diagne',
      email: 'alioune.diagne@gmail.com',
      phone: '+221 78 234 56 78',
      subject: 'Demande d\'agrément pour solution de paiement en ligne',
      message: 'Notre fintech a développé une solution de paiement mobile interopérable. Nous avons besoin d\'un agrément du Ministère pour lancer commercialement notre produit sur le territoire national.',
      identityDocUrl: 'https://storage.example.com/ids/alioune-diagne-cni.pdf',
      requestLetterUrl: 'https://storage.example.com/letters/AUD-2024-0012-lettre.pdf',
      status: RequestStatus.PENDING,
      adminNote: null,
      scheduledAt: null,
      ministryId: MINISTRY_ID,
    },
    {
      trackingCode: 'AUD-2024-0013',
      fullName: 'Rokhaya Sarr',
      email: 'rokhaya.sarr@gmail.com',
      phone: '+221 70 345 67 89',
      subject: 'Plainte pour concurrence déloyale — marché des solutions cloud',
      message: 'Des opérateurs étrangers proposent des services cloud sur le territoire national sans être enregistrés ni fiscalisés localement, créant une concurrence déloyale envers les acteurs locaux.',
      identityDocUrl: 'https://storage.example.com/ids/rokhaya-sarr-passport.pdf',
      requestLetterUrl: 'https://storage.example.com/letters/AUD-2024-0013-lettre.pdf',
      status: RequestStatus.REJECTED,
      adminNote: 'Compétence partagée avec le Ministère du Commerce. Rediriger.',
      scheduledAt: null,
      ministryId: MINISTRY_ID,
    },
    {
      trackingCode: 'AUD-2024-0014',
      fullName: 'Mamadou Lamine Fall',
      email: 'ml.fall@hotmail.fr',
      phone: '+221 76 456 78 90',
      subject: 'Proposition de plateforme nationale de télémédecine',
      message: 'Notre équipe pluridisciplinaire a développé une plateforme de télémédecine connectant médecins et patients en zones rurales. Nous cherchons un portage institutionnel du Ministère du Numérique.',
      identityDocUrl: 'https://storage.example.com/ids/mamadou-fall-cni.pdf',
      requestLetterUrl: 'https://storage.example.com/letters/AUD-2024-0014-lettre.pdf',
      status: RequestStatus.COMPLETED,
      adminNote: 'Projet stratégique. Réunion interministérielle à organiser.',
      scheduledAt: new Date('2024-05-06T10:00:00Z'),
      ministryId: MINISTRY_ID,
    },
    {
      trackingCode: 'AUD-2024-0015',
      fullName: 'Aminata Balde',
      email: 'aminata.balde@ong-digital.org',
      phone: '+221 78 567 89 01',
      subject: 'Programme d\'alphabétisation numérique pour femmes rurales',
      message: 'Notre ONG forme des femmes en milieu rural à l\'usage du smartphone et des services numériques de base. Nous souhaitons formaliser un partenariat avec le Ministère pour étendre le programme à 10 nouvelles régions.',
      identityDocUrl: 'https://storage.example.com/ids/aminata-balde-cni.pdf',
      requestLetterUrl: 'https://storage.example.com/letters/AUD-2024-0015-lettre.pdf',
      status: RequestStatus.COMPLETED,
      adminNote: 'Initiative alignée avec la stratégie d\'inclusion numérique. À intégrer au plan national.',
      scheduledAt: new Date('2024-05-14T14:00:00Z'),
      ministryId: MINISTRY_ID,
    },
    {
      trackingCode: 'AUD-2024-0016',
      fullName: 'Boubacar Keïta',
      email: 'b.keita@gmail.com',
      phone: '+221 77 678 90 12',
      subject: 'Régularisation d\'un réseau de cybercafés communautaires',
      message: 'Je gère un réseau de 8 cybercafés dans des quartiers populaires de Dakar et Thiès. Ces espaces ne sont plus régulièrement inspectés depuis 2021. Je souhaite régulariser leur statut et obtenir un label officiel.',
      identityDocUrl: 'https://storage.example.com/ids/boubacar-keita-cni.pdf',
      requestLetterUrl: 'https://storage.example.com/letters/AUD-2024-0016-lettre.pdf',
      status: RequestStatus.PENDING,
      adminNote: 'Dossier en cours de vérification au bureau des agréments.',
      scheduledAt: null,
      ministryId: MINISTRY_ID,
    },
    {
      trackingCode: 'AUD-2024-0017',
      fullName: 'Hawa Diakité',
      email: 'hawa.diakite@yahoo.com',
      phone: '+221 76 789 01 23',
      subject: 'Intégration de l\'IA dans les programmes scolaires nationaux',
      message: 'En tant qu\'enseignante et chercheuse, je propose un curriculum d\'initiation à l\'intelligence artificielle pour le secondaire. Je souhaite présenter ce projet au Ministère pour une expérimentation nationale.',
      identityDocUrl: 'https://storage.example.com/ids/hawa-diakite-passport.pdf',
      requestLetterUrl: 'https://storage.example.com/letters/AUD-2024-0017-lettre.pdf',
      status: RequestStatus.COMPLETED,
      adminNote: 'Projet innovant. Audience accordée avec le conseiller technique.',
      scheduledAt: new Date('2024-05-20T09:00:00Z'),
      ministryId: MINISTRY_ID,
    },
    {
      trackingCode: 'AUD-2024-0018',
      fullName: 'Lamine Cissé',
      email: 'lamine.cisse@gmail.com',
      phone: '+221 70 890 12 34',
      subject: 'Demande d\'extension de la couverture 4G en zones périurbaines',
      message: 'Plusieurs communes périurbaines de Dakar sont encore exclues de la couverture 4G malgré leur densité de population. Je viens au nom de mes administrés pour demander l\'accélération du déploiement.',
      identityDocUrl: 'https://storage.example.com/ids/lamine-cisse-cni.pdf',
      requestLetterUrl: 'https://storage.example.com/letters/AUD-2024-0018-lettre.pdf',
      status: RequestStatus.PENDING,
      adminNote: null,
      scheduledAt: null,
      ministryId: MINISTRY_ID,
    },
    {
      trackingCode: 'AUD-2024-0019',
      fullName: 'Oumou Kouyaté',
      email: 'oumou.kouyate@gmail.com',
      phone: '+221 77 901 23 45',
      subject: 'Demande de soutien pour hackathon national de jeunes développeurs',
      message: 'Nous organisons le 2e Hackathon National du Numérique qui rassemblera 500 jeunes développeurs. Nous sollicitons un patronage officiel et une contribution logistique du Ministère.',
      identityDocUrl: 'https://storage.example.com/ids/oumou-kouyate-cni.pdf',
      requestLetterUrl: 'https://storage.example.com/letters/AUD-2024-0019-lettre.pdf',
      status: RequestStatus.REJECTED,
      adminNote: 'Budget annuel déjà alloué. Encourager à soumettre pour l\'édition 2025.',
      scheduledAt: null,
      ministryId: MINISTRY_ID,
    },
    {
      trackingCode: 'AUD-2024-0020',
      fullName: 'Thierno Amadou Ba',
      email: 'thierno.ba@mediatech.sn',
      phone: '+221 76 012 34 56',
      subject: 'Accréditation d\'un média spécialisé dans l\'actualité tech',
      message: 'Notre média en ligne couvre exclusivement l\'actualité technologique et numérique en Afrique de l\'Ouest depuis 2023. Nous souhaitons obtenir une accréditation officielle pour accéder aux événements et conférences du Ministère.',
      identityDocUrl: 'https://storage.example.com/ids/thierno-ba-cni.pdf',
      requestLetterUrl: 'https://storage.example.com/letters/AUD-2024-0020-lettre.pdf',
      status: RequestStatus.PENDING,
      adminNote: null,
      scheduledAt: null,
      ministryId: MINISTRY_ID,
    },
  ];

  console.log('Seeding AudienceRequests...');

  for (const request of audienceRequests) {
    await prisma.audienceRequest.create({ data: request });
  }

  console.log(`✓ ${audienceRequests.length} AudienceRequests créées avec succès.`);
}

