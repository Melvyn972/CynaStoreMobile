// Fictional catalogue for the public demo. Nothing here is a customer,
// a credential, or a live offer.

export const DEMO_TOKEN = 'demo-local-not-a-secret';

export const DEMO_USER = {
  id: 'user-lea',
  name: 'Léa Bernard',
  email: 'lea.bernard@hexashield.example',
  phone: '06 18 44 20 73',
  address: '18 rue de la Victoire, 75009 Paris',
  createdAt: '2024-03-12T09:00:00.000Z',
};

const PHOTOS = [
  'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=60',
  'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=60',
  'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=60',
  'https://images.unsplash.com/photo-1510511459019-5dda7724fd87?auto=format&fit=crop&w=1200&q=60',
  'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=60',
  'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&w=1200&q=60',
];

export const SPECS = [
  { id: 's-ue', name: 'Hébergement UE' },
  { id: 's-aes', name: 'Chiffrement AES-256' },
  { id: 's-247', name: 'Support 24/7' },
  { id: 's-sso', name: 'SSO SAML' },
  { id: 's-siem', name: 'Journalisation SIEM' },
];

const CATEGORY_META = {
  soc: { id: 'c-soc', name: 'SOC' },
  endpoint: { id: 'c-endpoint', name: 'Endpoint' },
  iam: { id: 'c-iam', name: 'Identité' },
  training: { id: 'c-training', name: 'Formation' },
  mail: { id: 'c-mail', name: 'Messagerie' },
  cloud: { id: 'c-cloud', name: 'Cloud' },
  compliance: { id: 'c-compliance', name: 'Conformité' },
};

function article(partial) {
  const category = CATEGORY_META[partial.categoryId];
  return {
    id: partial.id,
    title: partial.title,
    description: partial.description,
    price: partial.price,
    stock: partial.stock,
    image: partial.image,
    images: partial.images || [],
    subscriptionDuration: partial.subscriptionDuration,
    category: category.name,
    categoryObj: { id: category.id, name: category.name },
    specifications: partial.specIds.map((id) => ({
      technicalSpecificationId: id,
      technicalSpecification: SPECS.find((spec) => spec.id === id),
    })),
  };
}

export const PRODUCTS = [
  article({
    id: 'p01',
    categoryId: 'soc',
    title: 'Sentinel SOC 24/7',
    description: 'Supervision continue, alertes priorisées et première réponse sur incident.',
    price: 890,
    stock: 25,
    subscriptionDuration: '1 an',
    image: PHOTOS[0],
    images: [{ url: PHOTOS[0] }, { url: PHOTOS[1] }],
    specIds: ['s-ue', 's-247', 's-siem'],
  }),
  article({
    id: 'p02',
    categoryId: 'endpoint',
    title: 'EDR Shield',
    description: 'Détection sur les postes, isolation à distance et enquête guidée.',
    price: 49,
    stock: 480,
    subscriptionDuration: '1 an',
    image: PHOTOS[1],
    specIds: ['s-aes', 's-247'],
  }),
  article({
    id: 'p03',
    categoryId: 'iam',
    title: 'Identity Gate',
    description: "SSO, MFA et revue des droits d'accès pour les applications SaaS.",
    price: 18,
    stock: 900,
    subscriptionDuration: '1 mois',
    image: PHOTOS[5],
    specIds: ['s-ue', 's-sso'],
  }),
  article({
    id: 'p04',
    categoryId: 'iam',
    title: 'Coffre Secrets',
    description: "Coffre d'équipe, rotation des secrets et journal des consultations.",
    price: 79,
    stock: 160,
    subscriptionDuration: '1 an',
    image: PHOTOS[2],
    specIds: ['s-ue', 's-aes', 's-sso'],
  }),
  article({
    id: 'p05',
    categoryId: 'training',
    title: 'PhishTrainer',
    description: 'Campagnes de phishing simulé et modules courts pour les collaborateurs.',
    price: 6,
    stock: 2000,
    subscriptionDuration: '1 an',
    image: PHOTOS[3],
    specIds: ['s-ue'],
  }),
  article({
    id: 'p06',
    categoryId: 'mail',
    title: 'Mail Armor',
    description: "Filtrage des pièces jointes, des liens suspects et de l'usurpation.",
    price: 8,
    stock: 750,
    subscriptionDuration: '1 an',
    image: PHOTOS[4],
    specIds: ['s-ue', 's-siem'],
  }),
  article({
    id: 'p07',
    categoryId: 'cloud',
    title: 'Cloud Posture',
    description: 'Écarts de configuration cloud et plan de remédiation priorisé.',
    price: 320,
    stock: 60,
    subscriptionDuration: '6 mois',
    image: PHOTOS[0],
    specIds: ['s-ue', 's-siem', 's-247'],
  }),
  article({
    id: 'p08',
    categoryId: 'compliance',
    title: 'RGPD Desk',
    description: 'Registre des traitements, droits des personnes et preuves de consentement.',
    price: 190,
    stock: 80,
    subscriptionDuration: '1 an',
    image: PHOTOS[2],
    specIds: ['s-ue', 's-aes'],
  }),
  article({
    id: 'p09',
    categoryId: 'soc',
    title: 'Playbooks Incident',
    description: 'Scénarios prêts : ransomware, fuite de données, compte compromis.',
    price: 240,
    stock: 40,
    subscriptionDuration: '3 mois',
    image: PHOTOS[1],
    specIds: ['s-247', 's-siem'],
  }),
  article({
    id: 'p10',
    categoryId: 'iam',
    title: 'Accès Zero Trust',
    description: "Accès aux outils internes selon l'identité, l'appareil et le contexte.",
    price: 15,
    stock: 640,
    subscriptionDuration: '1 mois',
    image: PHOTOS[5],
    specIds: ['s-sso', 's-aes', 's-ue'],
  }),
  article({
    id: 'p11',
    categoryId: 'endpoint',
    title: 'Sauvegarde Immuable',
    description: 'Copies chiffrées avec rétention verrouillée contre le chiffrement malveillant.',
    price: 110,
    stock: 120,
    subscriptionDuration: '1 an',
    image: PHOTOS[4],
    specIds: ['s-aes', 's-ue'],
  }),
  article({
    id: 'p12',
    categoryId: 'compliance',
    title: "Piste d'audit",
    description: "Journal d'audit exportable pour les contrôles internes. Offre affichée épuisée.",
    price: 95,
    stock: 0,
    subscriptionDuration: '1 an',
    image: PHOTOS[3],
    specIds: ['s-siem', 's-ue', 's-aes'],
  }),
];

export const CATEGORIES = (() => {
  const map = new Map();
  PRODUCTS.forEach((product) => {
    const id = product.categoryObj.id;
    if (!map.has(id)) {
      map.set(id, {
        id,
        name: product.categoryObj.name,
        image: product.image,
        _count: { articles: 0 },
      });
    }
    map.get(id)._count.articles += 1;
  });
  return Array.from(map.values());
})();

export const CAROUSEL = [
  {
    id: 'slide-1',
    title: 'La cybersécurité, en abonnement',
    subtitle: 'Catalogue SaaS',
    description: 'Douze offres fictives pour superviser, protéger et montrer la conformité.',
    buttonText: 'Voir les offres',
    buttonLink: '/produits',
    image: PHOTOS[0],
  },
  {
    id: 'slide-2',
    title: 'Un SOC externalisé, sans astreinte réelle',
    subtitle: 'Détection',
    description: 'Alertes, playbooks et réponse initiale : le parcours, pas la production.',
    buttonText: 'Explorer le SOC',
    buttonLink: '/produits',
    image: PHOTOS[1],
  },
  {
    id: 'slide-3',
    title: 'RGPD et facture au même endroit',
    subtitle: 'Conformité',
    description: 'Registre, consentements et commandes restent dans ce navigateur.',
    buttonText: 'Voir la conformité',
    buttonLink: '/produits',
    image: PHOTOS[2],
  },
];

export const CONTENT_BLOCKS = [
  {
    id: 'block-text',
    blockType: 'text',
    pageLocation: 'homepage',
    title: 'Une vitrine, pas une production',
    content:
      "Cette démo fonctionne sans serveur. Le catalogue, le panier, les commandes, l'entreprise et les réglages RGPD restent dans le navigateur.",
  },
  {
    id: 'block-image',
    blockType: 'text_image',
    pageLocation: 'homepage',
    title: 'Pensé pour une PME',
    content:
      "Des offres courtes, un prix affiché et un paiement simulé que l'on peut montrer sans écrire dans la base réelle.",
    image: PHOTOS[4],
  },
  {
    id: 'block-quote',
    blockType: 'testimonial',
    pageLocation: 'homepage',
    title: 'Retour fictif',
    content:
      "Le parcours d'achat est enfin lisible pour une offre de sécurité. Le registre et la facture tiennent sur le même écran.",
    author: 'Camille H., DSI, Atelier Nord',
  },
];

function productById(id) {
  return PRODUCTS.find((product) => product.id === id);
}

function snapshot(id) {
  const product = productById(id);
  return {
    id: product.id,
    title: product.title,
    image: product.image,
    price: product.price,
  };
}

export function createSeedState() {
  const sentinel = productById('p01');
  const edr = productById('p02');

  return {
    version: 1,
    seq: 100,
    user: { ...DEMO_USER },
    cart: [
      {
        id: 'ci-seed-1',
        productId: sentinel.id,
        quantity: 1,
        price: sentinel.price,
        title: sentinel.title,
        product: { id: sentinel.id, title: sentinel.title, image: sentinel.image },
      },
      {
        id: 'ci-seed-2',
        productId: edr.id,
        quantity: 2,
        price: edr.price,
        title: edr.title,
        product: { id: edr.id, title: edr.title, image: edr.image },
      },
    ],
    orders: [
      {
        id: 'ord-seed-1',
        date: '2026-05-14T16:20:00.000Z',
        status: 'delivered',
        total: 200,
        items: [{ quantity: 25, article: snapshot('p06') }],
      },
      {
        id: 'ord-seed-2',
        date: '2026-08-28T10:05:00.000Z',
        status: 'delivered',
        total: 190,
        items: [{ quantity: 1, article: snapshot('p08') }],
      },
    ],
    companies: [
      {
        id: 'co-hexashield',
        name: 'HexaShield',
        siret: '85231467900024',
        tva: 'FR12852314679',
        address: '12 rue des Archivistes, 75003 Paris',
        phone: '01 86 65 20 10',
        email: 'contact@hexashield.example',
        website: 'https://hexashield.example',
        description: 'Cabinet fictif de conseil en cybersécurité, utilisé uniquement pour la démo.',
        role: 'owner',
        createdAt: '2024-04-02T10:00:00.000Z',
        members: [
          {
            id: 'user-lea',
            name: 'Léa Bernard',
            email: 'lea.bernard@hexashield.example',
            role: 'owner',
          },
          {
            id: 'user-hugo',
            name: 'Hugo Petit',
            email: 'hugo.petit@hexashield.example',
            role: 'admin',
          },
          {
            id: 'user-ines',
            name: 'Inès Colin',
            email: 'ines.colin@hexashield.example',
            role: 'member',
          },
        ],
        orders: [
          {
            id: 'po-1',
            description: 'Sentinel SOC 24/7',
            date: '2026-06-18T09:00:00.000Z',
            status: 'completed',
            amount: 890,
          },
          {
            id: 'po-2',
            description: 'Cloud Posture',
            date: '2026-09-03T11:30:00.000Z',
            status: 'pending',
            amount: 320,
          },
        ],
      },
    ],
    invitations: [
      {
        id: 'inv-atelier',
        companyId: 'co-atelier',
        companyName: 'Atelier Nord',
        inviterName: 'Samir Cohen',
        role: 'member',
        message: "Rejoignez l'espace facturation d'Atelier Nord pour les abonnements sécurité.",
        receivedAt: '2026-10-01T08:15:00.000Z',
        siret: '44321987600015',
        address: '8 quai Saint-Antoine, 69002 Lyon',
      },
    ],
    consent: {
      consent: {
        marketing: false,
        analytics: true,
        thirdParty: false,
      },
      dataRetentionPeriod: '2_years',
      history: [
        {
          consentType: 'analytics',
          status: true,
          timestamp: '2025-11-02T14:30:00.000Z',
        },
        {
          consentType: 'marketing',
          status: false,
          timestamp: '2025-11-02T14:32:00.000Z',
        },
        {
          consentType: 'thirdParty',
          status: false,
          timestamp: '2026-01-09T09:10:00.000Z',
        },
      ],
    },
    messages: [],
  };
}
