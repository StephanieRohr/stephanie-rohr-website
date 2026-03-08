import { defineCollection, z } from 'astro:content'

const pagesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    pageHeading: z.string(),
    subheading: z.string().optional(),
    reachLabel: z.string().optional(),
    imageAlt: z.string().optional(),
    soundCloudTitle: z.string().optional(),
  }),
})

const componentsCollection = defineCollection({
  type: 'content',
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
  }),
})

const siteCollection = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string().optional(),
    title: z.string().optional(),
    description: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional(),
    nav: z
      .array(
        z.object({
          label: z.string(),
          href: z.string(),
        }),
      )
      .optional(),
    social: z
      .array(
        z.object({
          name: z.string(),
          url: z.string(),
          icon: z.enum(['linkedin', 'soundcloud', 'facebook', 'instagram']),
        }),
      )
      .optional(),
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
    promosSection: z
      .array(
        z.object({
          heading: z.string(),
          subheading: z.string().optional(),
          description: z.string(),
          credits: z.string(),
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
  pages: pagesCollection,
  components: componentsCollection,
  site: siteCollection,
}
