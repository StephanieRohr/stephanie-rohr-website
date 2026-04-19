import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'

const contactForm = defineCollection({
  loader: glob({ base: './src/content/contactForm', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    formIntro: z.string().optional(),
    labels: z
      .object({
        firstName: z.string(),
        lastName: z.string(),
        company: z.string(),
        email: z.string(),
        message: z.string(),
      })
      .optional(),
    requiredIndicator: z.string().optional(),
    submitButton: z
      .object({
        default: z.string(),
        sending: z.string(),
      })
      .optional(),
    successMessage: z.string().optional(),
    errorMessage: z.string().optional(),
  }),
})

const main = defineCollection({
  loader: glob({ base: './src/content/main', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    name: z.string(),
    title: z.string(),
    description: z.string(),
    email: z.string(),
    phone: z.string(),
    nav: z.array(
      z.object({
        label: z.string(),
        href: z.string(),
      }),
    ),
    social: z.array(
      z.object({
        name: z.string(),
        url: z.string(),
        icon: z.enum(['linkedin', 'soundcloud', 'facebook', 'instagram']),
      }),
    ),
  }),
})

const pages = defineCollection({
  loader: glob({ base: './src/content/pages', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    pageHeading: z.string(),
    subheading: z.string().optional(),
    reachLabel: z.string().optional(),
    imageAlt: z.string().optional(),
    soundCloudTitle: z.string().optional(),
  }),
})

const videos = defineCollection({
  loader: glob({
    base: './src/content/videos',
    pattern: '**/*.{md,mdx}',
  }),
  schema: z.object({
    videoSections: z
      .array(
        z.object({
          heading: z.string(),
          subheading: z.string().optional(),
          description: z.string(),
          credits: z.string(),
          videos: z.array(
            z.object({
              title: z.string(),
              videoId: z.string(),
              orientation: z.enum(['landscape', 'portrait']),
            }),
          ),
        }),
      )
      .optional(),
    youTubeVideoSections: z
      .array(
        z.object({
          heading: z.string(),
          subheading: z.string().optional(),
          description: z.string(),
          credits: z.string(),
          videos: z.array(
            z.object({
              title: z.string(),
              videoUrl: z.string(),
              orientation: z.enum(['landscape', 'portrait']),
            }),
          ),
        }),
      )
      .optional(),
  }),
})

export const collections = {
  contactForm,
  main,
  pages,
  videos,
}
