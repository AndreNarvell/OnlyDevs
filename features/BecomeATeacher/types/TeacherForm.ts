import { z } from "zod"

export const teacherFormSchema = z.object({
  description: z.string().min(300).max(800),
  short_desc: z.string().min(20).max(100),
  picture: z.object({}).passthrough().nullable(),
})

export type TeacherForm = z.infer<typeof teacherFormSchema>
