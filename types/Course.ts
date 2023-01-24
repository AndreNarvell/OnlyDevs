import { Database } from "./supabase"

export type Course = Database["public"]["Tables"]["courses"]["Row"]

export type Module = Database["public"]["Tables"]["modules"]["Row"]

export type Lesson = Database["public"]["Tables"]["lessons"]["Row"]
export type LessonData = Database["public"]["Tables"]["lessons_data"]["Row"]

export type CourseWithSections = Course & {
  modules: Module[]
}

export type CourseWithSectionsAndLessons = CourseWithSections & {
  modules: (Module & {
    lessons: Lesson[]
  })[]
}

export type CourseStructure = {
  id: Course["id"]
  title: Course["title"]
  description: Course["description"]
  modules: {
    id: Module["id"]
    title: Module["title"]
    sort_order: Module["sort_order"]
    lessons: {
      id: Lesson["id"]
      title: Lesson["title"]
      description: Lesson["description"]
      sort_order: Lesson["sort_order"]
      content_type: Lesson["content_type"]
    }[]
  }[]
}
