import { Profile } from "./Profile"
import { Database } from "./supabase"

export type Teacher = Database["public"]["Tables"]["teachers"]["Row"] & {
  profiles: Pick<Profile, "name">
  numberOfCourses: number
  totalNumberOfStudents: number
}
