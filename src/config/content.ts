/**
 * Page copy, kept out of JSX.
 *
 * Two reasons this is a config file and not inline strings: the wording is the
 * thing most often revised by non-engineers, and holding it in one typed shape
 * means adding French or German later is a content task rather than a refactor
 * of every component.
 *
 * Wording is carried over from the live site, tightened but not re-invented —
 * the claims made here must stay ones the business can actually honour.
 */

export interface Pillar {
  readonly title: string;
  readonly description: string;
}

export interface JourneyStep {
  readonly step: string;
  readonly title: string;
  readonly description: string;
  readonly cost: string;
}

export interface ServiceItem {
  readonly title: string;
  readonly description: string;
  readonly price: string;
}

export interface SelectOption {
  readonly value: string;
  readonly label: string;
}

export interface VehicleCategory {
  readonly title: string;
  readonly description: string;
  readonly examples: string;
}

export const home = {
  hero: {
    eyebrow: "Japan → Switzerland",
    /** Rendered in the display face, which carries kana natively. */
    kana: "日本からスイスへ",
    title: "Your Japanese vehicle, brought to Switzerland",
    description:
      "We source and import Japanese vehicles to Switzerland, tailored to your preferences, budget, and driving needs.",
    primaryCta: { label: "Start sourcing", href: "/contact" },
    secondaryCta: { label: "See what we source", href: "/vehicles" },
  },

  pillars: [
    {
      title: "Wide selection",
      description: "Performance cars, kei cars, SUVs, and classics.",
    },
    {
      title: "Trusted sourcing",
      description: "Careful sourcing through trusted Japanese networks.",
    },
    {
      title: "Swiss import support",
      description: "Import guidance from auction to Swiss registration.",
    },
  ] as const satisfies readonly Pillar[],

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

  cta: {
    title: "Tell us the car you have in mind.",
    description:
      "Send the model, budget, and how you plan to use it. You will get a straight answer about what is findable and what it will genuinely cost to land in Switzerland.",
    action: { label: "Start sourcing", href: "/contact" },
  },
} as const;

export const vehicles = {
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
  ] as const satisfies readonly VehicleCategory[],
} as const;

export const howItWorks = {
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
  ] as const satisfies readonly JourneyStep[],
} as const;

export const services = {
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
  ] as const satisfies readonly ServiceItem[],
} as const;

export const faq = {
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
} as const;

/**
 * Enquiry form.
 *
 * The option lists live here rather than in the component because they are the
 * part most likely to be revised by whoever answers the enquiries, and because
 * the Zod schema derives its allowed values from these same arrays — so adding
 * a choice here cannot fall out of sync with what the server will accept.
 */
export const contactForm = {
  transmission: [
    { value: "manual", label: "Manual" },
    { value: "automatic", label: "Automatic" },
    { value: "any", label: "No preference" },
  ] as const satisfies readonly SelectOption[],

  condition: [
    { value: "showroom", label: "Showroom / collector" },
    { value: "excellent", label: "Excellent" },
    { value: "good", label: "Good — normal wear" },
    { value: "project", label: "Project / needs work" },
    { value: "any", label: "No preference" },
  ] as const satisfies readonly SelectOption[],

  referral: [
    { value: "instagram", label: "Instagram" },
    { value: "facebook", label: "Facebook" },
    { value: "tiktok", label: "TikTok" },
    { value: "search", label: "Google / search" },
    { value: "word-of-mouth", label: "Word of mouth" },
    { value: "other", label: "Other" },
  ] as const satisfies readonly SelectOption[],
} as const;

export const contact = {
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
} as const;
