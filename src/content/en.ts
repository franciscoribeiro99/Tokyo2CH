import type { Dictionary } from "@/content/fr";

/** English. Kept because the JDM audience is heavily English-speaking. */
export const en = {
  nav: {
    vehicles: "Vehicles",
    howItWorks: "How It Works",
    ourServices: "Our Services",
    faq: "FAQ",
    contact: "Contact",
    privacy: "Privacy",
    terms: "Terms",
    main: "Main",
    footer: "Footer",
    social: "Social",
    company: "Company",
    elsewhere: "Elsewhere",
    skipToContent: "Skip to main content",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    language: "Language",
    rights: "All rights reserved.",
  },

  actions: {
    startSourcing: "Start sourcing",
    seeWhatWeSource: "See what we source",
    getInTouch: "Get in touch",
    describeYourCar: "Describe your car",
    shareYourRequest: "Share your request",
    askUsDirectly: "Ask us directly",
  },

  brand: {
    tagline: "Your Japanese vehicle, brought to Switzerland.",
    description:
      "Tokyo2CH sources and imports Japanese vehicles to Switzerland on demand, guiding clients through selection, shipping, regulations, and registration.",
  },

  home: {
    hero: {
      eyebrow: "Japan → Switzerland",
      kana: "日本からスイスへ",
      title: "Your Japanese vehicle, brought to Switzerland",
      description:
        "We source and import Japanese vehicles to Switzerland, tailored to your preferences, budget, and driving needs.",
    },
    pillars: [
      { title: "Wide selection", description: "Performance cars, kei cars, SUVs, and classics." },
      {
        title: "Trusted sourcing",
        description: "Careful sourcing through trusted Japanese networks.",
      },
      {
        title: "Swiss import support",
        description: "Import guidance from auction to Swiss registration.",
      },
    ],
    services: {
      eyebrow: "Our services",
      title: "One contact, from auction hall to Swiss plates",
      points: [
        "Find your ideal Japanese vehicle, sourced carefully to match your preferences, budget, and driving needs.",
        "We manage inspections, shipping, customs paperwork, and Swiss registration requirements from start to finish.",
        "Enjoy clear communication, dependable guidance, and a smooth handover when your imported vehicle arrives.",
      ],
    },
    band: {
      eyebrow: "The passage",
      title: "Japan to Switzerland",
      description:
        "Tokyo2CH sources Japanese vehicles to your specifications, manages the import process, and brings your chosen car smoothly to Switzerland.",
    },
    faqSection: {
      eyebrow: "Questions",
      title: "The things people ask first",
    },
    cta: {
      title: "Tell us the car you have in mind.",
      description:
        "Send the model, budget, and how you plan to use it. You will get a straight answer about what is findable and what it will genuinely cost to land in Switzerland.",
    },
  },

  vehicles: {
    hero: {
      eyebrow: "Vehicles",
      title: "Vehicles we source",
      description:
        "Japanese classics, performance cars, kei vehicles, and practical daily drivers sourced to your exact brief.",
    },
    intro: {
      eyebrow: "Our vehicles",
      title: "Browse by the kind of car you are after",
      description:
        "These are categories, not stock. Every car is sourced to order against your brief, so if what you want is not shown here, it is still worth asking.",
    },
    categories: [
      {
        title: "Performance",
        description:
          "Turbocharged icons and modern performance saloons, sourced on condition and history rather than headline mileage.",
        examples: "Skyline · Supra · WRX STI · Evo",
      },
      {
        title: "Sports coupés",
        description:
          "Lightweight rear-drive coupés that are getting harder to find in Europe in honest, unmodified condition.",
        examples: "S2000 · RX-7 · MR2 · Silvia",
      },
      {
        title: "Kei cars",
        description:
          "Japan's 660cc class — small, characterful, and cheap to run, with plenty that never reached the European market.",
        examples: "Cappuccino · Jimny · Copen",
      },
      {
        title: "Classics",
        description:
          "Older Japanese cars with documented history, where the auction sheet and inspection matter more than the photographs.",
        examples: "Hakosuka · 240Z · Celica",
      },
      {
        title: "SUVs and 4x4s",
        description:
          "Body-on-frame four-wheel-drives built for real use, well suited to Swiss winters and mountain roads.",
        examples: "Land Cruiser · Pajero · Delica",
      },
      {
        title: "Everyday and vans",
        description:
          "Dependable daily drivers, people carriers, and van conversions where low mileage and service history do the talking.",
        examples: "Alphard · Hiace · Fit",
      },
    ],
    cta: {
      title: "Not seeing what you want?",
      description:
        "These are categories, not stock. Tell us the specific car you are after and we will tell you honestly whether it is findable, and roughly what it lands at.",
    },
  },

  howItWorks: {
    hero: {
      eyebrow: "How it works",
      title: "Three steps, one point of contact",
      description:
        "Tell us your ideal Japanese vehicle, budget, and preferences. We handle sourcing, inspection, shipping, customs, and Swiss registration guidance from start to finish.",
    },
    steps: [
      {
        step: "01",
        title: "Share your request",
        description:
          "Tell us your ideal vehicle, budget, preferred specifications, and delivery expectations.",
        cost: "Free",
      },
      {
        step: "02",
        title: "We source",
        description:
          "We source suitable Japanese vehicles, verify details, and share clear purchase options.",
        cost: "Quoted per vehicle",
      },
      {
        step: "03",
        title: "Arrive in Switzerland",
        description:
          "We manage shipping, Swiss import formalities, compliance, and final vehicle delivery.",
        cost: "Quoted per vehicle",
      },
    ],
    cta: {
      title: "Start with step one.",
      description:
        "Tell us the vehicle, the budget, and how you plan to use it. Sourcing and shortlisting cost you nothing — you only commit once you have seen real options.",
    },
  },

  services: {
    hero: {
      eyebrow: "Our services",
      title: "From Japan to Switzerland",
      description:
        "From finding the right Japanese vehicle to handling its journey into Switzerland, Tokyo2CH keeps every step clear and personal.",
    },
    points: [
      "We source carefully selected Japanese vehicles based on your preferences, budget, and driving needs.",
      "From auction purchase to Swiss delivery, we manage shipping, paperwork, customs, and registration guidance.",
      "Receive clear advice on import requirements, vehicle condition, costs, and every step ahead.",
    ],
    itemsHeader: {
      eyebrow: "Services for your import",
      title: "Everything between the auction sheet and the number plate",
      description:
        "Take the whole process or just the part you need help with. Pricing is quoted per vehicle, because a kei car and a classic are not the same job.",
    },
    items: [
      {
        title: "Vehicle sourcing",
        description:
          "Tell us your preferred model, specifications, budget, and timeline. We search Japan's market to match your requirements.",
        price: "By request",
      },
      {
        title: "Vehicle verification",
        description:
          "We verify auction records, mileage, condition, and documentation before presenting suitable vehicles for your approval.",
        price: "By request",
      },
      {
        title: "Shipping coordination",
        description:
          "Once you choose, we coordinate purchase, secure export paperwork, and arrange careful shipment from Japan to Switzerland.",
        price: "Quoted separately",
      },
      {
        title: "Swiss import guidance",
        description:
          "We guide you through Swiss customs, taxes, conformity requirements, and registration steps for a smoother arrival.",
        price: "Quoted separately",
      },
      {
        title: "Specialist vehicles",
        description:
          "From kei cars and classics to performance models and SUVs, we source the Japanese vehicle you have in mind.",
        price: "By request",
      },
      {
        title: "After-arrival support",
        description:
          "Need help after delivery? We can assist with inspections, documentation, transport coordination, and practical ownership questions.",
        price: "By request",
      },
    ],
    cta: {
      title: "Which part do you need help with?",
      description:
        "Whether you want the full service or only the Swiss import paperwork, tell us where you are and we will pick it up from there.",
    },
  },

  faq: {
    hero: {
      eyebrow: "FAQ",
      title: "Frequently asked questions",
      description:
        "The questions that come up before every import. If yours is not here, ask — a direct answer costs nothing.",
    },
    items: [
      {
        question: "What vehicles can you source?",
        answer:
          "We source Japanese vehicles to your specifications, including performance cars, classics, 4x4s, vans, and everyday models.",
      },
      {
        question: "How does sourcing work?",
        answer:
          "Tell us your preferred model, budget, condition, and options. We search Japan, verify candidates, and share details before purchase.",
      },
      {
        question: "Do you handle Swiss importation?",
        answer:
          "Yes. We coordinate shipping, customs documentation, Swiss import requirements, transport, and registration support from Japan to Switzerland.",
      },
      {
        question: "What import costs should I expect?",
        answer:
          "Import costs depend on vehicle value, transport, duties, VAT, inspections, and registration. We provide a clear estimate beforehand.",
      },
      {
        question: "How long does delivery take?",
        answer:
          "Timelines vary by vehicle and shipping schedule, but we keep you updated from sourcing through delivery and Swiss registration.",
      },
    ],
    cta: {
      title: "Still unsure?",
      description:
        "Import questions are rarely generic. Send us your situation and you will get a specific answer rather than a brochure.",
    },
  },

  contact: {
    hero: {
      eyebrow: "Contact",
      title: "Request a vehicle",
      description:
        "Tell us which Japanese vehicle you are looking for, and we will handle the sourcing and import process.",
    },
    location: {
      title: "Our location",
      description: "Serving Switzerland through trusted Japanese vehicle sourcing.",
    },
    details: {
      email: "Email",
      phone: "Phone",
      address: "Address",
      hours: "Hours",
    },
  },

  form: {
    name: "Your name",
    first: "First",
    last: "Last",
    email: "Email address",
    phone: "Phone / WhatsApp",
    vehicle: "What vehicle are you looking for?",
    vehiclePlaceholder: "e.g. Honda Civic Type R EK9",
    year: "Desired year / generation",
    yearPlaceholder: "e.g. 1996-2000",
    budget: "Budget (CHF)",
    budgetPlaceholder: "e.g. CHF 35,000",
    transmission: "Transmission",
    condition: "Vehicle condition",
    requirements: "Additional requirements",
    requirementsPlaceholder: "Colour, mileage, specifications, modifications, etc.",
    notes: "Anything else we should know?",
    referral: "How did you hear about Tokyo2CH?",
    selectPlaceholder: "— Select Choice —",
    submit: "Request a vehicle",
    submitting: "Sending…",
    honeypot: "Leave this field empty",
    transmissionOptions: [
      { value: "manual", label: "Manual" },
      { value: "automatic", label: "Automatic" },
      { value: "any", label: "No preference" },
    ],
    conditionOptions: [
      { value: "showroom", label: "Showroom / collector" },
      { value: "excellent", label: "Excellent" },
      { value: "good", label: "Good — normal wear" },
      { value: "project", label: "Project / needs work" },
      { value: "any", label: "No preference" },
    ],
    referralOptions: [
      { value: "instagram", label: "Instagram" },
      { value: "facebook", label: "Facebook" },
      { value: "tiktok", label: "TikTok" },
      { value: "search", label: "Google / search" },
      { value: "word-of-mouth", label: "Word of mouth" },
      { value: "other", label: "Other" },
    ],
    errors: {
      firstName: "Please enter your first name.",
      firstNameLong: "That first name is too long.",
      lastNameLong: "That last name is too long.",
      email: "Please enter a valid email address.",
      phoneLong: "That number is too long.",
      vehicle: "Tell us which vehicle you are looking for.",
      year: "Please give a year or generation.",
      budget: "Please give an approximate budget.",
      transmission: "Please choose a transmission.",
      condition: "Please choose a vehicle condition.",
      choice: "Please choose one of the listed options.",
      tooLong: "Please shorten this field.",
      fix: "Please fix the highlighted fields and try again.",
      failed: "Something went wrong on our end. Please email us directly.",
    },
    success: "Thanks — we'll be in touch shortly.",
  },

  notFound: {
    title: "We could not find that page.",
    description:
      "The link may be out of date, or the page may have moved. These are the places most people are looking for.",
    backHome: "Back to home",
  },

  legal: {
    lastUpdated: "Last updated:",
    lastUpdatedDate: "1 September 2026",
    governingNotice:
      "This document exists in French, German, Italian and English. Where the versions differ, the French version governs.",
    privacy: {
      title: "Privacy Policy",
      metaDescription: "How Tokyo2CH collects, uses, and protects personal data.",
      sections: [
        {
          heading: "What we collect",
          body: "When you submit the vehicle request form we collect your first and last name, your email address, your phone or WhatsApp number if you provide one, and the details describing the vehicle you are looking for: model, year or generation, budget, transmission, condition, any additional requirements, your free-text notes, and how you heard about us. We also collect aggregate, non-identifying usage analytics to understand how the site performs.",
        },
        {
          heading: "Why we collect it",
          body: "We use this information solely to respond to your enquiry and, where a working relationship follows, to administer it. We do not sell personal data, and we do not use it for advertising.",
        },
        {
          heading: "How long we keep it",
          body: "Enquiries that do not lead to an engagement are deleted after 24 months. Records relating to an active or completed import are retained for as long as required by applicable tax and contract law.",
        },
        {
          heading: "Your rights",
          body: "Depending on where you live, you may have the right to access, correct, export, or delete the personal data we hold about you, and to object to its processing. To exercise any of these, email us.",
        },
        {
          heading: "Cookies",
          body: "This site sets no cookies at all: none for advertising, none for measurement, none technical. Until you choose the light or dark theme, nothing is stored in your browser; that choice is then kept locally, contains no identifier, and is never transmitted to anyone. Your language is part of the page address and is not stored. You can refuse or clear this storage at any time in your browser settings, with no loss of functionality. Site traffic is measured in aggregate by our host Vercel, without cookies and without profiling. Fonts are served from our own servers: no request is made to any third party during your visit.",
        },
        {
          heading: "Contact",
          body: "Questions about this policy can be sent to us by email, or by post to the address shown on the contact page.",
        },
      ],
    },
    terms: {
      title: "Terms",
      metaDescription: "The terms governing use of the Tokyo2CH site and its services.",
      sections: [
        {
          heading: "Purpose",
          body: "Tokyo2CH sources vehicles in Japan on behalf of its clients and supports them through the process of importing to Switzerland. Submitting a request through this site is neither an order nor a commitment to purchase.",
        },
        {
          heading: "Quotes and pricing",
          body: "Sourcing and shortlisting vehicles is free. The price of a vehicle, shipping, customs duties, VAT, inspections and registration are quoted case by case, before you commit to anything.",
        },
        {
          heading: "Vehicle availability",
          body: "The categories shown on this site describe the kinds of vehicle we source; they are not available stock. The availability, condition and price of any vehicle depend on the Japanese market at the time of sourcing.",
        },
        {
          heading: "Timelines",
          body: "Any timeline given is an estimate. It depends on shipping schedules, customs formalities and Swiss inspections, none of which are within our control.",
        },
        {
          heading: "Liability",
          body: "We make every effort to verify the condition and history of a vehicle before purchase, based on the auction sheets and inspections available. We cannot be held liable for faults that were not detectable at the time of those checks.",
        },
        {
          heading: "Governing law",
          body: "These terms are governed by Swiss law. The place of jurisdiction is Valais, subject to any mandatory consumer protection provisions.",
        },
      ],
    },
  },
} satisfies Dictionary;
