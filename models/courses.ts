import { supabase } from "../lib/supabase"
import { Database } from "../types/supabase"

/**
 * All courses as array
 */
export const getAllCourses = async () => {
  return supabase.from("courses").select("*")
}

/**
 * All courses sorted by creation date
 */
export const getLatestCourses = async (quantity: number = 1) => {
  return supabase
    .from("courses")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(quantity)
}

const entireCourseQuery = `*, sections (*, lectures (*))`

/**
 * Single course by id
 */
export const getCourseDetailsById = async (id: string) => {
  return supabase
    .from("courses")
    .select(entireCourseQuery)
    .eq("id", id)
    .single()
}

/**
 * Single course found by it's slug
 */
export const getCourseDetailsBySlug = async (slug: string) => {
  return supabase
    .from("courses")
    .select(entireCourseQuery)
    .eq("slug", slug)
    .single()
}

/**
 * Get all courses sorted by category
 */
export const getAllCoursesSortedByCategory = async (options?: {
  noEmptyCategories?: boolean
}): Promise<CategoryWithCourses[] | undefined> => {
  const { data, error } = await supabase
    .from("categories")
    .select(`*, courses (*)`)

  if (data) {
    const formatted = data.map<CategoryWithCourses>(category => ({
      ...category,
      courses:
        category.courses === null
          ? []
          : Array.isArray(category.courses)
          ? category.courses
          : [category.courses],
    }))

    if (options?.noEmptyCategories) {
      return formatted.filter(category => category.courses.length > 0)
    }

    return formatted
  }

  return undefined
}

/**
 * Fetch every course in the provided category
 */
export const getAllCoursesInCategory = async (
  categoryId: number
): Promise<CategoryWithCourses | undefined> => {
  const { data, error } = await supabase
    .from("categories")
    .select(`*, courses (*)`)
    .eq("id", categoryId)
    .single()

  if (data) {
    return {
      ...data,
      courses:
        data.courses === null
          ? []
          : Array.isArray(data.courses)
          ? data.courses
          : [data.courses],
    }
  }

  return undefined
}

/**
 * Types
 */
export type CategoryWithCourses =
  Database["public"]["Tables"]["categories"]["Row"] & {
    courses: Database["public"]["Tables"]["courses"]["Row"][]
  }
