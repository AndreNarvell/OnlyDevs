import { supabase } from "../lib/supabase"

export const getAllCourses = async () => supabase.from("courses").select("*")

export const getLatestCourses = async (quantity: number = 1) =>
  supabase
    .from("courses")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(quantity)

const entireCourseQuery = `*, sections (*, lectures (*))`

export const getCourseDetailsById = async (id: string) =>
  supabase.from("courses").select(entireCourseQuery).eq("id", id)

export const getCourseDetailsBySlug = async (slug: string) =>
  supabase.from("courses").select(entireCourseQuery).eq("slug", slug)
