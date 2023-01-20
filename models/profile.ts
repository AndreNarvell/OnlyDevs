import { serverSideSupabase } from "../lib/supabase"

export const getProfileById = async (id: string) => {
  return serverSideSupabase().from("profiles").select("*").eq("id", id).single()
}

export const updateSavedCourses = async (
  id: string,
  savedCourses: string[]
) => {
  return serverSideSupabase()
    .from("profiles")
    .update({ saved_courses: savedCourses })
    .eq("id", id)
}
