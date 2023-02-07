import { z } from "zod"

export const courseDetailsSchema = z.object({
  title: z.string().min(10).max(100),
  description: z.string().min(100).max(2000),
  short_desc: z.string().min(10).max(200),
  includes: z.array(z.string().min(2).max(100)).min(1),
  requirements: z.array(z.string().min(2).max(100)).min(1),
  tags: z.array(z.string().min(2).max(100)).min(1),
  background_image: z.unknown().optional(),
  icon: z.unknown().optional(),
})

export type CourseDetails = z.infer<typeof courseDetailsSchema>
