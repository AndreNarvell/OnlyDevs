import { EditorModule } from "../stores/editorContent"
import { z } from "zod"

export const curriculumSchema: z.ZodType<EditorModule[]> = z.array(
  z.object({
    id: z.string().uuid(),
    title: z.string().min(5).max(100),
    sort_order: z.number().int(),

    lessons: z.array(
      z.object({
        id: z.string().uuid(),
        title: z.string(),
        content_type: z.string(),
        sort_order: z.number().int(),
      })
    ),
  })
)
