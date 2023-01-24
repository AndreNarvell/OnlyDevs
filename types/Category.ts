import { Database } from "./supabase"

export type Category = Database["public"]["Tables"]["categories"]["Row"]

export type CategoryWithCourses = Category & {
  courses: Database["public"]["Tables"]["courses"]["Row"][]
}
