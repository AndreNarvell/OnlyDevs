import { supabase } from "../lib/supabase"
import { Database } from "../types/supabase"

export const getAllCategories = async () =>
  supabase.from("categories").select("*")

export type CategoryWithCourses =
  Database["public"]["Tables"]["categories"]["Row"] & {
    courses: Database["public"]["Tables"]["courses"]["Row"][]
  }

export const getAllCoursesInCategory = async (options?: {
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

export const getAllCoursesInCategoryById = async (
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
