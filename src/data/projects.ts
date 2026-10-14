export interface Project {
  title: string;
  description: string;
  tech: string[];
  image: string;
  imageAlt: string;
  /** Pixel size of `image`, so the browser can reserve space before it loads. */
  width: number;
  height: number;
  link?: string;
  /** Short tag shown on the card, e.g. "Live 3D". */
  badge?: string;
  /** Tailwind classes for the card's grid span. */
  spanClass: string;
  /** Tailwind classes for the image frame (aspect ratio, height). */
  imageClass: string;
  /** CSS object-position for the crop, when the subject isn't centred. */
  objectPosition?: string;
}

// Keep in sync with the JSON-LD and the static fallback in index.html.
export const PROJECTS: Project[] = [
  {
    title: "3D Showroom Walkthrough",
    description:
      "An interactive 3D walkthrough of a four-level commercial showroom and family home, modelled to the inch from the architect's drawings. Walk every floor in first person, cut the building away floor by floor, and step into any room — right in the browser.",
    tech: ["Three.js", "WebGL", "glTF", "Blender", "Python", "Vercel"],
    image: "/projects/3d-showroom.webp",
    imageAlt: "Photoreal 3D render of a three-storey corner showroom with glass shopfronts, balconies and a residence above",
    width: 1600,
    height: 900,
    link: "https://yashrai.in/3d/demo_one/",
    badge: "Live 3D",
    spanClass: "md:col-span-12",
    imageClass: "aspect-[4/3] md:aspect-[21/9]",
    objectPosition: "center 8%",
  },
  {
    title: "Promptu",
    description:
      "A Chrome extension that rewrites any AI prompt into three polished versions in one click. Works on ChatGPT, Claude and Gemini, with a free tier served through a Cloudflare Worker.",
    tech: ["Chrome Extension (MV3)", "JavaScript", "Gemini API", "Cloudflare Workers"],
    image: "/projects/promptu.webp",
    imageAlt: "Promptu Chrome extension generating three refined versions of an AI prompt",
    width: 1280,
    height: 800,
    link: "https://chromewebstore.google.com/detail/promptu/gaafidhicjnpkdpcacfgehiafmliajah",
    spanClass: "md:col-span-7",
    imageClass: "aspect-[4/3] md:aspect-auto md:flex-1 md:min-h-[360px]",
  },
  {
    title: "Tour With Yash",
    description:
      "A full-stack tour booking site with login, bookings, tour maps, reviews and card payments, backed by a REST API.",
    tech: ["Node.js", "Express", "MongoDB", "Mongoose"],
    image: "/projects/tourwithyash.webp",
    imageAlt: "Tour With Yash booking site home page listing tours",
    width: 1024,
    height: 532,
    link: "https://tourwithyash.onrender.com/",
    spanClass: "md:col-span-5",
    imageClass: "aspect-[4/3] md:aspect-auto md:flex-1 md:min-h-[360px]",
  },
  {
    title: "Skillgigs Marketplace",
    description:
      "Marketplace features for a talent platform: OAuth 2.0 sign-in, real-time chat over WebSockets, and Node.js API work that cut latency by 900 ms.",
    tech: ["React", "Node.js", "Socket.io", "OAuth 2.0", "AWS Amplify"],
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop",
    imageAlt: "Analytics dashboard on a laptop, illustrating the Skillgigs marketplace",
    width: 800,
    height: 533,
    spanClass: "md:col-span-5",
    imageClass: "aspect-[4/3] md:aspect-auto md:flex-1 md:min-h-[360px]",
  },
  {
    title: "React UI and Components",
    description:
      "An earlier portfolio showcasing reusable React UI components and interaction patterns.",
    tech: ["React", "JavaScript", "CSS"],
    image: "/projects/yashportfolio.webp",
    imageAlt: "Earlier React portfolio site showing UI components",
    width: 1600,
    height: 900,
    link: "https://yashdevportfolio.netlify.app/",
    spanClass: "md:col-span-7",
    imageClass: "aspect-[4/3] md:aspect-auto md:flex-1 md:min-h-[360px]",
  },
];
