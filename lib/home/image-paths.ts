export const images = {
  home: {
    hero: {
      main: "/home/hero/hero_main.jpg",
    },
    features: {
      techVisualization: "/home/features/tech-visualization.webp",
      residentialDesign: "/home/features/residential-design.webp",
    },
    projects: {
      westMeadeEstate: "/home/projects/west-meade-estate.webp",
      miamiResidence: "/home/projects/miami-residence.webp",
      leipersForkBarn: "/home/projects/leipers-fork-barn.webp",
      greenwichRetreat: "/home/projects/greenwich-retreat.webp",
    },
    testimonials: {
      first: "/home/testimonials/testimonial-1.webp",
      second: "/home/testimonials/testimonial-2.webp",
      third: "/home/testimonials/testimonial-3.webp",
    },
  },
} as const;

export type ImagePaths = typeof images; 