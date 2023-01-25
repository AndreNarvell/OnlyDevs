import { Database } from "./supabase"

export type CourseProgress =
  Database["public"]["Tables"]["course_progress"]["Row"]
