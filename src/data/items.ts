/** A long-form case study opened in a modal from a work tile. */
export type CaseStudy = {
  /** Client / project name shown as the case headline. */
  client: string
  /** e.g. "Branding" or "Web Design / UI&UX". */
  category: string
  year?: string
  /** Large hero image at the top of the case. */
  cover: string
  /** One-paragraph intro under the title. */
  intro: string
  /** Headline metrics shown as a row of stats. */
  metrics?: { value: string; label: string }[]
  /** Body sections, each a heading + paragraph. */
  sections: { heading: string; body: string }[]
  /** Extra images shown stacked below the write-up. */
  gallery?: string[]
}

/** A single piece of work shown inside an opened folder window. */
export type Work = {
  id: string
  title: string
  /** Optional short tag/role shown under the title. */
  tag?: string
  /** When set, clicking the tile opens this case study in a modal. */
  caseStudy?: CaseStudy
  /** Optional longer caption shown under the tile (e.g. a key-visual brief). */
  caption?: string
  /** Vimeo video id — embedded as a looping, muted, controls-free background player. */
  vimeoId?: string
  /** When set, clicking this tile opens the given Vimeo video in the lightbox (with a play icon overlay). */
  lightboxVimeoId?: string
  /** Multi-item gallery shown side by side in the lightbox when clicked. */
  lightboxGallery?: Array<{ type: 'image'; src: string } | { type: 'video'; vimeoId: string }>
  /** Cover image (used as a fallback when there is no video). */
  image?: string
  /** Highlighted in the larger top row (the main pieces). */
  featured?: boolean
}

/** A labelled group of works (e.g. "Social Media") within a folder window. */
export type WorkSection = {
  title: string
  description?: string
  /** Wide (16:9) tiles when true, square (1:1) otherwise. */
  wide?: boolean
  works: Work[]
}

export type FolderItem = {
  id: string
  title: string
  subtitles: string[]
  /** Preview shown on the top card of the stack. */
  preview: string
  /** Optional looping video used as the top-card cover (takes priority over `preview`). */
  previewVideo?: string
  /** Optional accent palette for the top-card dots (overrides the default colours). */
  accentDots?: string[]
  /** 4 images shown as a 2×2 collage on the card (takes priority over `preview`). */
  previewImages?: string[]
  /** Sample project shown on the top card (title + one-line description). */
  sample: { title: string; description: string }
  /** Position on the canvas, relative to the centre (0,0). */
  position: { x: number; y: number }
  /** When true, clicking the card opens the folder window. */
  enabled: boolean
  /** When true, the card preview media is centered instead of left-anchored. */
  previewCenter?: boolean
  /** Works shown in the opened window (grid of 3–4 per row). */
  works?: Work[]
  /** Labelled sections shown in the opened window (used instead of `works`). */
  sections?: WorkSection[]
  /** Header block shown above the works grid. */
  window?: { headline: string; subline?: string; batches?: string[]; centered?: boolean }
  /** When true, clicking a tile opens the lightbox. Default: false for image-only folders. */
  expandable?: boolean
  /** Logo bar shown at the bottom of the window. */
  logos?: { src: string; alt: string }[]
}

export type AboutCardData = {
  id: string
  title: string
  cta: string
  thumbnail: string
  /** Portrait photo shown next to the bio text. */
  portrait?: string
  /** Bio paragraphs rendered inside the card. */
  bio?: string[]
  position: { x: number; y: number }
}

import type { ExperienceEntry } from '../components/ExperiencePanel/ExperiencePanel'

export const experience: ExperienceEntry[] = [
  {
    role: 'Graphic Designer',
    company: 'Vilaro',
    period: '2024 – present',
    bullets: [
      'Creating graphic concepts aligned with brand visual identity',
      'Designing static graphics and video/animations for social media and digital campaigns',
      'Developing key visuals and communication layouts',
      'Collaborating with the creative team on concepts and promotional materials',
      'Preparing layouts and adapting them to various formats',
    ],
  },
  {
    role: 'Graphic & Motion Designer',
    company: 'Esperienza',
    period: '2023 – 2024',
    bullets: [
      'Designing graphic materials for advertising campaigns (digital and social media) for brands including LOT, Żabka and DrOetker',
      'Adapting and modifying existing graphic layouts in line with brand visual identity',
      'Collaborating with copywriters and the creative team on key visuals and communication concepts',
      'Participating in team brainstorms and developing creative concepts',
      'Producing video edits and preparing assets for post-production',
      'Quick response to ongoing communication needs (RTMs)',
      'Preparing layouts and adapting them to various formats',
    ],
  },
  {
    role: 'Graphic Designer',
    company: 'Freelance',
    period: '2020 – present',
    bullets: [
      'Collaborating with advertising agencies on graphic materials for social media in line with publication schedules',
      'Animating ready-made advertising layouts and adapting them to various digital formats',
      'End-to-end project execution from brief gathering through client communication to final delivery',
      'Preparing materials for advertising campaigns in international markets',
      'Video editing for WSPA University in Lublin',
    ],
  },
]

/** Deterministic placeholder image from picsum (seeded), so no local assets are needed for the MVP. */
const mock = (seed: string, w = 480, h = 360) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`

export const folders: FolderItem[] = [
  {
    id: 'graphic-design',
    title: 'Graphic Design',
    subtitles: ['Performance Ads', 'Social Media', 'Key Visuals'],
    preview: '/graphic/kv-vilaro.jpg',
    accentDots: ['#eb4c27', '#13182b', '#eb4c27'],
    sample: { title: 'KeyVisual Vilaro Event', description: 'Banners at a film event' },
    position: { x: -640, y: -340 }, // top-left
    enabled: true,
    expandable: false,
    window: { headline: 'Graphic Design' },
    logos: [
      { src: '/graphic/logo-droetker.png', alt: 'Dr. Oetker' },
      { src: '/graphic/logo-slodkachwila.png', alt: 'Słodka Chwila' },
      { src: '/graphic/logo-guseppe.png', alt: 'Guseppe' },
      { src: '/graphic/logo-feliciana.png', alt: 'Feliciana' },
      { src: '/graphic/logo-wszystkiegoslodkiego.png', alt: 'Wszystkiego Słodkiego' },
      { src: '/graphic/logo-hama.png', alt: 'Hama' },
      { src: '/graphic/logo-khebda.png', alt: 'K. Hebda' },
      { src: '/graphic/logo-vileda.png', alt: 'Vileda' },
      { src: '/graphic/logo-lot.png', alt: 'LOT Polish Airlines' },
    ],
    sections: [
      {
        title: 'Social Media',
        description:
          'Visual communication for social media developed for consumer brands. Projects covered static posts, motion pieces and video edits produced within structured content frameworks and collaborative concept development.',
        works: [
          { id: 'sm-guseppe', title: 'Guseppe', tag: 'Dr. Oetker', image: '/graphic/social-guseppe.jpg' },
          { id: 'sm-yokaba', title: 'Euphoria Spa', tag: 'Yokaba', image: '/graphic/social-yokaba.jpg' },
          { id: 'sm-slodkachwila', title: 'Słodka Chwila', tag: 'Dr. Oetker', image: '/graphic/social-slodkachwila.jpg' },
          { id: 'sm-tortoreo', title: 'Tort Oreo', tag: 'Wszystkiego Słodkiego', image: '/graphic/social-tortoreo.png' },
        ],
      },
      {
        title: 'Performance Ads',
        description:
          'Performance creatives developed for Meta Ads and Google Ads campaigns. I collaborated closely with SEM specialists to design static and video, including format adaptations tailored to campaign requirements and placements.',
        works: [
          { id: 'pa-hama', title: 'Smartwatch 8900', tag: 'Hama', image: '/graphic/ads-hama.png' },
          { id: 'pa-hebda', title: 'Nutta', tag: 'K. Hebda', image: '/graphic/ads-hebda.png' },
          { id: 'pa-elektrospark', title: 'Wiertarko-wkrętarka', tag: 'Elektrospark', image: '/graphic/ads-elektrospark.jpg' },
          { id: 'pa-zenetik', title: 'iPhone 14 Pro', tag: 'Zenetik', image: '/graphic/ads-zenetik.png' },
        ],
      },
      {
        title: 'Key Visuals',
        wide: true,
        works: [
          {
            id: 'kv-vilaro',
            title: 'Vilaro we Film',
            tag: 'Key Visual',
            caption:
              'Key visual for the we Film event in Lublin. AI-generated animations and static graphics designed for on-site screens.',
            image: '/graphic/kv-vilaro.jpg',
            lightboxGallery: [
              { type: 'image', src: '/graphic/kv-vilaro.jpg' },
              { type: 'image', src: '/graphic/kv-vilaro2.png' },
              { type: 'video', vimeoId: '1167118036' },
            ],
          },
          {
            id: 'kv-wielkopolski',
            title: 'Wielkopolski',
            tag: 'Key Visual',
            caption:
              'Key visual developed for a promotional campaign for Wielkopolski. The concept was created for a contest based activation featuring kitchen appliances as prizes.',
            image: '/graphic/kv-wielkopolski.jpg',
          },
          {
            id: 'kv-kaem',
            title: 'Kaem',
            tag: 'Key Visual',
            caption:
              'Key visual proposal for Kaem, designed to frame construction focused YouTube content and supporting social media communication.',
            image: '/graphic/kv-kaem.jpg',
          },
        ],
      },
    ],
  },
  {
    id: 'motion',
    title: 'Motion',
    subtitles: ['Showreels', 'Events'],
    preview: mock('motion-cover'),
    previewVideo: '/motion-cover.mp4',
    // Match the animation's palette: orange (#eb4c27) + black.
    accentDots: ['#eb4c27', '#13182b'],
    sample: { title: 'Welcome Screen', description: 'Loop Animation' },
    position: { x: 700, y: -90 }, // right
    enabled: true,
    previewCenter: true,
    expandable: true,
    works: [
      { id: 'showreel-2024', title: 'Showreel 2024', tag: 'Showreel', vimeoId: '1167122500', featured: true },
      { id: 'showreel-2023', title: 'Showreel 2023', tag: 'Showreel', vimeoId: '1167121587', featured: true },
      { id: 'motion-design', title: 'Motion Design', tag: 'Motion', vimeoId: '1167121548' },
      { id: 'quiz-1', title: 'Open-air Cinema Quiz', tag: 'FOOH', vimeoId: '1170018755' },
      { id: 'quiz-2', title: 'Open-air Cinema Quiz', tag: 'FOOH', vimeoId: '1170018132' },
    ],
    window: {
      batches: ['2D', '3D', 'FOOH'],
      headline: 'Animations',
      subline:
        'Personal motion showreels showcasing 2D, 3D and FOOH work. All projects were crafted manually as skill driven explorations prior to the AI driven production wave.',
      centered: true,
    },
  },
  {
    id: 'case-study',
    title: 'Case Studies',
    subtitles: ['Website', 'Branding'],
    preview: '/case/landscaping-cover.jpg',
    accentDots: ['#2f6f4f', '#13182b', '#eb4c27'],
    sample: {
      title: 'Landscaping Company Website',
      description: 'Around 34% more quality phone enquiries after launch.',
    },
    position: { x: -640, y: 340 }, // bottom-left
    enabled: true,
    expandable: true,
    window: {
      headline: 'Case Studies',
      subline:
        'Two end to end projects, from the first problem to the launched result. Open a case to see the full story.',
    },
    works: [
      {
        id: 'case-website',
        title: 'Landscaping Company Website',
        tag: 'Web Design / UI&UX',
        featured: true,
        image: '/case/landscaping-cover.jpg',
        caseStudy: {
          client: 'Landscaping Company Website',
          category: 'Web Design / UI&UX',
          year: '2026',
          cover: '/case/landscaping-cover.jpg',
          intro:
            'A website for a landscaping company near Lublin that designs gardens and maintains green areas for homes, housing estates and larger outdoor spaces. The site had to explain a broad range of services, build trust and turn visitors into well qualified enquiries.',
          metrics: [
            { value: '~34%', label: 'more quality phone enquiries' },
            { value: 'Framer', label: 'designed and built in' },
            { value: 'Mobile first', label: 'layout and navigation' },
          ],
          sections: [
            {
              heading: 'The problem',
              body: 'The old site built little trust at first glance. There were no visible testimonials, numbers or proof of experience where decisions are made, the services were reduced to shallow descriptions, and nothing addressed a client doubts before the moment of contact.',
            },
            {
              heading: 'The approach',
              body: 'I structured the offer around clear service paths, garden design, lawn installation and ongoing maintenance, each with its own subpage. A calm green visual language and recognisable client logos build credibility, while the layout was designed mobile first since most visitors arrive from a phone.',
            },
            {
              heading: 'The solution',
              body: 'Every service has a dedicated subpage that explains the scope in plain language and leads to a single, clear next step. A short "let us talk" prompt sits next to a structured contact form, so visitors reach out with the details that matter and the team can respond faster.',
            },
            {
              heading: 'The result',
              body: 'The site was designed and built in Framer. After launch the share of quality phone enquiries rose by roughly 34 percent. Visitors arrive better informed, the form pre qualifies their needs and the company spends less time on conversations that lead nowhere.',
            },
          ],
          gallery: [
            '/case/landscaping-problem.jpg',
            '/case/landscaping-home.jpg',
            '/case/landscaping-subpage.jpg',
          ],
        },
      },
      {
        id: 'case-branding',
        title: 'citytools Branding',
        tag: 'Branding',
        featured: true,
        image: '/case/branding-cover.jpg',
        caseStudy: {
          client: 'citytools',
          category: 'Branding',
          year: '2026',
          cover: '/case/branding-cover.jpg',
          intro:
            'A brand identity for citytools, an online store with professional power tools. The goal was a bold, recognisable system that stays consistent across the product feed, social media and print, in a category that usually looks generic.',
          metrics: [
            { value: 'Full system', label: 'logo, colour, type' },
            { value: 'Online + print', label: 'one consistent look' },
          ],
          sections: [
            {
              heading: 'The problem',
              body: 'citytools had no independent brand system. The communication leaned on the manufacturers it resells, so the producer identity always overshadowed the store, and the brand ended up speaking without a voice of its own.',
            },
            {
              heading: 'The approach',
              body: 'I built a confident red and black palette around an industrial wordmark, paired with a blueprint motif that nods to construction and precision. The system was designed to scale, from a business card to a full product campaign, without losing its character.',
            },
            {
              heading: 'The deliverables',
              body: 'The identity covers the logo and wordmark, brand colours and typography, business cards and a set of social media and promotion templates, including bestseller and offer layouts ready for the store to reuse.',
            },
            {
              heading: 'The result',
              body: 'citytools gained a premium, trustworthy presence and a flexible toolkit for ongoing marketing, so new campaigns stay on brand and recognisable at a glance.',
            },
          ],
          gallery: [
            '/case/branding-problem.jpg',
            '/case/branding-logo.jpg',
            '/case/branding-colors.jpg',
            '/case/branding-type.jpg',
            '/case/branding-social.jpg',
          ],
        },
      },
    ],
  },
]

export const aboutCard: AboutCardData = {
  id: 'about',
  title: "Hello,\nI'm Damian",
  cta: 'Get to know me',
  thumbnail: '/about-me.jpg',
  portrait: '/fuji6273.jpg',
  bio: [
    "I've spent some time working at agencies in Warsaw and Lublin, and these days I'm also doing my own thing as a freelancer. I'm naturally curious, so I'm always trying out new stuff. Whether that's messing around with 3D or diving deeper into UI/UX. To make sure I don't fall behind, I've also become pretty good friends with AI. I spend a lot of time in Magnific playing with GenAI models and tweaking them. Fun fact: I actually put this website together myself while playing around with Claude Code!",
    "And when I finally close my laptop? I hit the gym to clear my head and stretch out my back after sitting all day. Lately, I've also been spending my free time flying my drone, and I've gotten completely hooked on photography 📸",
  ],
  position: { x: 820, y: 430 },
}
