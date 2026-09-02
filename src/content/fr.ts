/**
 * French — the reference dictionary.
 *
 * Every other locale is typed against this object, so a missing or misspelled
 * key is a compile error rather than a blank spot found in production. Add a
 * key here first, then to the other three; the build will tell you which are
 * outstanding.
 *
 * Route segments are not translated. `/fr/vehicles`, `/de/vehicles`,
 * `/it/vehicles` all use the same path, which keeps one routing table instead
 * of four and keeps `hreflang` pairing trivial.
 */
export const fr = {
  nav: {
    vehicles: "Véhicules",
    howItWorks: "Comment ça marche",
    ourServices: "Nos services",
    faq: "FAQ",
    contact: "Contact",
    privacy: "Confidentialité",
    terms: "Conditions",
    main: "Navigation principale",
    footer: "Pied de page",
    social: "Réseaux sociaux",
    company: "Entreprise",
    elsewhere: "Ailleurs",
    skipToContent: "Aller au contenu principal",
    openMenu: "Ouvrir le menu",
    closeMenu: "Fermer le menu",
    language: "Langue",
    rights: "Tous droits réservés.",
  },

  actions: {
    startSourcing: "Lancer la recherche",
    seeWhatWeSource: "Voir ce que nous importons",
    getInTouch: "Nous contacter",
    describeYourCar: "Décrivez votre voiture",
    shareYourRequest: "Envoyer votre demande",
    askUsDirectly: "Posez-nous la question",
  },

  brand: {
    tagline: "Votre véhicule japonais, livré en Suisse.",
    description:
      "Tokyo2CH recherche et importe des véhicules japonais en Suisse sur demande, et vous accompagne de la sélection à l'immatriculation, en passant par le transport et les formalités.",
  },

  home: {
    hero: {
      eyebrow: "Japon → Suisse",
      kana: "日本からスイスへ",
      title: "Votre véhicule japonais, livré en Suisse",
      description:
        "Nous recherchons et importons des véhicules japonais en Suisse, selon vos préférences, votre budget et votre usage.",
    },
    pillars: [
      {
        title: "Large choix",
        description: "Sportives, kei cars, 4x4 et véhicules de collection.",
      },
      {
        title: "Recherche encadrée",
        description: "Une recherche minutieuse via des réseaux japonais éprouvés.",
      },
      {
        title: "Accompagnement à l'import",
        description: "De la vente aux enchères à l'immatriculation suisse.",
      },
    ],
    services: {
      eyebrow: "Nos services",
      title: "Un seul interlocuteur, de la salle des ventes aux plaques suisses",
      points: [
        "Trouvez le véhicule japonais qu'il vous faut, sélectionné selon vos préférences, votre budget et votre usage.",
        "Nous gérons les inspections, le transport, les formalités douanières et les exigences d'immatriculation suisses, du début à la fin.",
        "Vous bénéficiez d'un suivi clair, de conseils fiables et d'une remise sereine à l'arrivée de votre véhicule.",
      ],
    },
    band: {
      eyebrow: "Le trajet",
      title: "Du Japon à la Suisse",
      description:
        "Tokyo2CH recherche des véhicules japonais selon votre cahier des charges, prend en charge l'importation et achemine la voiture choisie jusqu'en Suisse.",
    },
    faqSection: {
      eyebrow: "Questions",
      title: "Ce que l'on nous demande en premier",
    },
    cta: {
      title: "Dites-nous quelle voiture vous avez en tête.",
      description:
        "Envoyez le modèle, le budget et l'usage prévu. Vous recevrez une réponse franche sur ce qui est trouvable et sur ce que cela coûtera réellement, une fois en Suisse.",
    },
  },

  vehicles: {
    hero: {
      eyebrow: "Véhicules",
      title: "Les véhicules que nous importons",
      description:
        "Véhicules de collection japonais, sportives, kei cars et voitures du quotidien, recherchés selon votre cahier des charges.",
    },
    intro: {
      eyebrow: "Nos véhicules",
      title: "Parcourez par type de voiture",
      description:
        "Ce sont des catégories, pas un stock. Chaque voiture est recherchée sur commande d'après votre demande : si ce que vous cherchez ne figure pas ici, cela vaut quand même la peine de demander.",
    },
    categories: [
      {
        title: "Sportives",
        description:
          "Icônes turbocompressées et berlines sportives modernes, sélectionnées sur l'état et l'historique plutôt que sur le kilométrage affiché.",
        examples: "Skyline · Supra · WRX STI · Evo",
      },
      {
        title: "Coupés sport",
        description:
          "Coupés légers à propulsion, de plus en plus difficiles à trouver en Europe dans un état honnête et d'origine.",
        examples: "S2000 · RX-7 · MR2 · Silvia",
      },
      {
        title: "Kei cars",
        description:
          "La catégorie japonaise des 660 cm³ — compactes, attachantes et économiques, dont beaucoup n'ont jamais été vendues en Europe.",
        examples: "Cappuccino · Jimny · Copen",
      },
      {
        title: "Collection",
        description:
          "Voitures japonaises anciennes à l'historique documenté, où la fiche d'enchères et l'inspection comptent davantage que les photos.",
        examples: "Hakosuka · 240Z · Celica",
      },
      {
        title: "4x4 et SUV",
        description:
          "Quatre roues motrices à châssis séparé, conçues pour un usage réel et bien adaptées aux hivers et aux routes de montagne suisses.",
        examples: "Land Cruiser · Pajero · Delica",
      },
      {
        title: "Quotidien et utilitaires",
        description:
          "Voitures fiables au quotidien, monospaces et aménagements de vans, où le faible kilométrage et le carnet d'entretien parlent d'eux-mêmes.",
        examples: "Alphard · Hiace · Fit",
      },
    ],
    cta: {
      title: "Vous ne trouvez pas ce que vous cherchez ?",
      description:
        "Ce sont des catégories, pas un stock. Dites-nous précisément la voiture que vous visez et nous vous dirons honnêtement si elle est trouvable, et à combien elle revient une fois livrée.",
    },
  },

  howItWorks: {
    hero: {
      eyebrow: "Comment ça marche",
      title: "Trois étapes, un seul interlocuteur",
      description:
        "Dites-nous le véhicule japonais idéal, votre budget et vos préférences. Nous prenons en charge la recherche, l'inspection, le transport, la douane et l'accompagnement à l'immatriculation suisse.",
    },
    steps: [
      {
        step: "01",
        title: "Envoyez votre demande",
        description:
          "Indiquez le véhicule idéal, le budget, les spécifications souhaitées et vos attentes de délai.",
        cost: "Gratuit",
      },
      {
        step: "02",
        title: "Nous recherchons",
        description:
          "Nous recherchons les véhicules japonais adaptés, vérifions les détails et vous présentons des options claires.",
        cost: "Devis par véhicule",
      },
      {
        step: "03",
        title: "Arrivée en Suisse",
        description:
          "Nous gérons le transport, les formalités d'importation suisses, la conformité et la livraison finale.",
        cost: "Devis par véhicule",
      },
    ],
    cta: {
      title: "Commencez par la première étape.",
      description:
        "Dites-nous le véhicule, le budget et l'usage prévu. La recherche et la présélection ne vous coûtent rien : vous ne vous engagez qu'une fois de vraies options sous les yeux.",
    },
  },

  services: {
    hero: {
      eyebrow: "Nos services",
      title: "Du Japon à la Suisse",
      description:
        "De la recherche du bon véhicule japonais à son acheminement en Suisse, Tokyo2CH garde chaque étape claire et personnelle.",
    },
    points: [
      "Nous sélectionnons avec soin des véhicules japonais selon vos préférences, votre budget et votre usage.",
      "De l'achat aux enchères à la livraison en Suisse, nous gérons le transport, les documents, la douane et l'accompagnement à l'immatriculation.",
      "Vous recevez des conseils clairs sur les exigences d'importation, l'état du véhicule, les coûts et chaque étape à venir.",
    ],
    itemsHeader: {
      eyebrow: "Services pour votre import",
      title: "Tout ce qu'il y a entre la fiche d'enchères et la plaque",
      description:
        "Prenez l'ensemble du processus ou seulement la partie sur laquelle vous avez besoin d'aide. Le tarif est établi par véhicule, parce qu'une kei car et une voiture de collection ne représentent pas le même travail.",
    },
    items: [
      {
        title: "Recherche de véhicule",
        description:
          "Indiquez le modèle, les spécifications, le budget et le calendrier souhaités. Nous prospectons le marché japonais pour répondre à votre demande.",
        price: "Sur demande",
      },
      {
        title: "Vérification du véhicule",
        description:
          "Nous vérifions les fiches d'enchères, le kilométrage, l'état et les documents avant de vous présenter les véhicules adaptés.",
        price: "Sur demande",
      },
      {
        title: "Organisation du transport",
        description:
          "Une fois votre choix fait, nous coordonnons l'achat, sécurisons les documents d'exportation et organisons l'acheminement depuis le Japon.",
        price: "Devis séparé",
      },
      {
        title: "Accompagnement à l'import suisse",
        description:
          "Nous vous guidons dans les démarches de douane, de taxes, de conformité et d'immatriculation pour une arrivée sans accroc.",
        price: "Devis séparé",
      },
      {
        title: "Véhicules spécifiques",
        description:
          "Des kei cars aux véhicules de collection en passant par les sportives et les 4x4, nous recherchons le véhicule japonais que vous avez en tête.",
        price: "Sur demande",
      },
      {
        title: "Suivi après livraison",
        description:
          "Besoin d'aide après la livraison ? Nous pouvons vous assister pour les expertises, les documents, le transport et les questions pratiques de propriété.",
        price: "Sur demande",
      },
    ],
    cta: {
      title: "Sur quelle partie avez-vous besoin d'aide ?",
      description:
        "Que vous vouliez la prestation complète ou seulement les formalités d'importation suisses, dites-nous où vous en êtes et nous reprenons à partir de là.",
    },
  },

  faq: {
    hero: {
      eyebrow: "FAQ",
      title: "Questions fréquentes",
      description:
        "Les questions qui reviennent avant chaque importation. Si la vôtre n'y figure pas, posez-la : une réponse directe ne coûte rien.",
    },
    items: [
      {
        question: "Quels véhicules pouvez-vous rechercher ?",
        answer:
          "Nous recherchons des véhicules japonais selon vos spécifications : sportives, véhicules de collection, 4x4, utilitaires et modèles du quotidien.",
      },
      {
        question: "Comment se déroule la recherche ?",
        answer:
          "Indiquez le modèle, le budget, l'état et les options souhaités. Nous prospectons au Japon, vérifions les candidats et vous transmettons les détails avant tout achat.",
      },
      {
        question: "Gérez-vous l'importation en Suisse ?",
        answer:
          "Oui. Nous coordonnons le transport, les documents douaniers, les exigences d'importation suisses, l'acheminement et l'accompagnement à l'immatriculation, du Japon jusqu'en Suisse.",
      },
      {
        question: "À quels coûts d'importation faut-il s'attendre ?",
        answer:
          "Les coûts dépendent de la valeur du véhicule, du transport, des droits de douane, de la TVA, des expertises et de l'immatriculation. Nous fournissons une estimation claire au préalable.",
      },
      {
        question: "Combien de temps prend la livraison ?",
        answer:
          "Les délais varient selon le véhicule et les rotations maritimes, mais nous vous tenons informé de la recherche jusqu'à la livraison et l'immatriculation en Suisse.",
      },
    ],
    cta: {
      title: "Toujours un doute ?",
      description:
        "Les questions d'importation sont rarement génériques. Exposez-nous votre situation et vous recevrez une réponse précise, pas une brochure.",
    },
  },

  contact: {
    hero: {
      eyebrow: "Contact",
      title: "Demander un véhicule",
      description:
        "Dites-nous quel véhicule japonais vous recherchez, et nous prenons en charge la recherche et l'importation.",
    },
    location: {
      title: "Où nous sommes",
      description: "Au service de la Suisse, par une recherche encadrée de véhicules japonais.",
    },
    details: {
      email: "E-mail",
      phone: "Téléphone",
      address: "Adresse",
      hours: "Horaires",
    },
  },

  form: {
    name: "Votre nom",
    first: "Prénom",
    last: "Nom",
    email: "Adresse e-mail",
    phone: "Téléphone / WhatsApp",
    vehicle: "Quel véhicule recherchez-vous ?",
    vehiclePlaceholder: "ex. Honda Civic Type R EK9",
    year: "Année / génération souhaitée",
    yearPlaceholder: "ex. 1996-2000",
    budget: "Budget (CHF)",
    budgetPlaceholder: "ex. CHF 35 000",
    transmission: "Boîte de vitesses",
    condition: "État du véhicule",
    requirements: "Exigences supplémentaires",
    requirementsPlaceholder: "Couleur, kilométrage, spécifications, modifications, etc.",
    notes: "Autre chose à nous signaler ?",
    referral: "Comment avez-vous connu Tokyo2CH ?",
    selectPlaceholder: "— Choisissez —",
    submit: "Demander un véhicule",
    submitting: "Envoi…",
    honeypot: "Laissez ce champ vide",
    transmissionOptions: [
      { value: "manual", label: "Manuelle" },
      { value: "automatic", label: "Automatique" },
      { value: "any", label: "Sans préférence" },
    ],
    conditionOptions: [
      { value: "showroom", label: "État de collection" },
      { value: "excellent", label: "Excellent" },
      { value: "good", label: "Bon — usure normale" },
      { value: "project", label: "À restaurer" },
      { value: "any", label: "Sans préférence" },
    ],
    referralOptions: [
      { value: "instagram", label: "Instagram" },
      { value: "facebook", label: "Facebook" },
      { value: "tiktok", label: "TikTok" },
      { value: "search", label: "Google / recherche" },
      { value: "word-of-mouth", label: "Bouche-à-oreille" },
      { value: "other", label: "Autre" },
    ],
    errors: {
      firstName: "Veuillez indiquer votre prénom.",
      firstNameLong: "Ce prénom est trop long.",
      lastName: "Veuillez indiquer votre nom.",
      lastNameLong: "Ce nom est trop long.",
      email: "Veuillez saisir une adresse e-mail valide.",
      phoneLong: "Ce numéro est trop long.",
      vehicle: "Dites-nous quel véhicule vous recherchez.",
      year: "Veuillez indiquer une année ou une génération.",
      budget: "Veuillez indiquer un budget approximatif.",
      transmission: "Veuillez choisir une boîte de vitesses.",
      condition: "Veuillez choisir un état de véhicule.",
      choice: "Veuillez choisir l'une des options proposées.",
      tooLong: "Veuillez raccourcir ce champ.",
      fix: "Veuillez corriger les champs signalés et réessayer.",
      failed: "Un problème est survenu de notre côté. Écrivez-nous directement par e-mail.",
    },
    success: "Merci — nous revenons vers vous très vite.",
  },

  notFound: {
    title: "Cette page est introuvable.",
    description:
      "Le lien est peut-être obsolète, ou la page a été déplacée. Voici les destinations les plus consultées.",
    backHome: "Retour à l'accueil",
  },

  legal: {
    lastUpdated: "Dernière mise à jour :",
    lastUpdatedDate: "1er septembre 2026",
    governingNotice:
      "Ce document existe en français, en allemand, en italien et en anglais. En cas de divergence entre les versions, la version française fait foi.",
    privacy: {
      title: "Politique de confidentialité",
      metaDescription: "Comment Tokyo2CH collecte, utilise et protège les données personnelles.",
      sections: [
        {
          heading: "Ce que nous collectons",
          body: "Lorsque vous envoyez le formulaire de demande de véhicule, nous collectons votre prénom et votre nom, votre adresse e-mail, votre numéro de téléphone ou WhatsApp si vous le renseignez, ainsi que les éléments décrivant le véhicule recherché : modèle, année ou génération, budget, boîte de vitesses, état, exigences supplémentaires, vos remarques libres et la façon dont vous nous avez connus. Nous collectons également des statistiques d'usage agrégées et non identifiantes pour mesurer les performances du site.",
        },
        {
          heading: "Pourquoi nous les collectons",
          body: "Ces informations servent uniquement à répondre à votre demande et, si une collaboration suit, à la mener à bien. Nous ne vendons aucune donnée personnelle et ne l'utilisons pas à des fins publicitaires.",
        },
        {
          heading: "Combien de temps nous les conservons",
          body: "Les demandes qui ne débouchent pas sur une collaboration sont supprimées après 24 mois. Les données liées à une importation en cours ou terminée sont conservées aussi longtemps que la législation fiscale et contractuelle applicable l'exige.",
        },
        {
          heading: "Vos droits",
          body: "Selon votre lieu de résidence, vous pouvez avoir le droit d'accéder aux données personnelles que nous détenons, de les corriger, de les exporter ou de les supprimer, ainsi que de vous opposer à leur traitement. Pour exercer l'un de ces droits, écrivez-nous par e-mail.",
        },
        {
          heading: "Cookies",
          body: "Ce site ne dépose aucun cookie : ni publicitaire, ni de mesure, ni technique. Tant que vous ne choisissez pas le thème clair ou sombre, rien n'est enregistré dans votre navigateur ; ce choix est ensuite conservé localement, ne contient aucun identifiant et n'est transmis à personne. Votre langue figure dans l'adresse de la page et n'est pas mémorisée. Vous pouvez refuser ou effacer ce stockage à tout moment dans les réglages de votre navigateur, sans perte de fonctionnalité. La fréquentation du site est mesurée de façon agrégée par notre hébergeur Vercel, sans cookie et sans profilage. Les polices de caractères sont servies depuis nos propres serveurs : aucune requête vers un tiers n'est émise lors de votre visite.",
        },
        {
          heading: "Contact",
          body: "Toute question sur cette politique peut nous être adressée par e-mail, ou par courrier postal à l'adresse indiquée sur la page de contact.",
        },
      ],
    },
    terms: {
      title: "Conditions générales",
      metaDescription: "Les conditions d'utilisation du site Tokyo2CH et de ses services.",
      sections: [
        {
          heading: "Objet",
          body: "Tokyo2CH recherche des véhicules au Japon pour le compte de ses clients et les accompagne dans les démarches d'importation vers la Suisse. L'envoi d'une demande via ce site ne constitue ni une commande ni un engagement d'achat.",
        },
        {
          heading: "Devis et prix",
          body: "La recherche et la présélection de véhicules sont gratuites. Le prix d'un véhicule, le transport, les droits de douane, la TVA, les expertises et l'immatriculation font l'objet d'un devis établi au cas par cas, avant tout engagement de votre part.",
        },
        {
          heading: "Disponibilité des véhicules",
          body: "Les catégories présentées sur ce site décrivent les types de véhicules que nous recherchons ; elles ne constituent pas un stock disponible. La disponibilité, l'état et le prix d'un véhicule dépendent du marché japonais au moment de la recherche.",
        },
        {
          heading: "Délais",
          body: "Les délais annoncés sont des estimations. Ils dépendent des rotations maritimes, des formalités douanières et des expertises suisses, qui ne relèvent pas de notre contrôle.",
        },
        {
          heading: "Responsabilité",
          body: "Nous mettons tout en œuvre pour vérifier l'état et l'historique des véhicules avant achat, sur la base des fiches d'enchères et des inspections disponibles. Notre responsabilité ne saurait être engagée pour des vices non décelables au moment de ces vérifications.",
        },
        {
          heading: "Droit applicable",
          body: "Les présentes conditions sont soumises au droit suisse. Le for juridique est en Valais, sous réserve des dispositions impératives protégeant les consommateurs.",
        },
      ],
    },
  },
} as const;

/**
 * Widens every string leaf back to `string` while keeping the shape.
 *
 * `as const` above is what makes the French copy immutable, but it also types
 * every value as its own literal — without this, `de` would have to contain
 * the French words to satisfy the type. Widening keeps the useful half of the
 * bargain: the other locales must have exactly these keys, with any strings.
 */
type Widen<T> = T extends string
  ? string
  : T extends readonly (infer U)[]
    ? readonly Widen<U>[]
    : { readonly [K in keyof T]: Widen<T[K]> };

export type Dictionary = Widen<typeof fr>;
