import { PostgrestError } from "@supabase/supabase-js"
import { serverSideSupabase } from "../lib/supabase"

export const getProfileById = async (id: string) => {
  return serverSideSupabase().from("profiles").select("*").eq("id", id).single()
}

export const updateSavedCourses = async (userId: string, courseId: string) => {
  const { data, error } = await serverSideSupabase()
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single()

  if (error) {
    return { error }
  }

  if (!data) {
    return { error: "No profile found" }
  }

  const savedCourses = data.saved_courses || []

  const updatedSavedCourses = savedCourses.includes(courseId)
    ? savedCourses.filter(id => id !== courseId)
    : [...savedCourses, courseId]

  const { error: updateError } = await serverSideSupabase()
    .from("profiles")
    .update({ saved_courses: updatedSavedCourses })
    .eq("id", userId)

  if (updateError) {
    return { error: updateError }
  }

  return { data: updatedSavedCourses }
}
