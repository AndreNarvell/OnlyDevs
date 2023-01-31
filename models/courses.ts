import { serverSideSupabase, supabase } from "../lib/supabase"
import { CategoryWithCourses } from "../types/Category"
import { Course, CourseStructure } from "../types/Course"
import { CourseProgress } from "../types/CourseProgress"

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

const entireCourseQuery = `*, modules (*, lessons (*))`

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
 * Fetch all courses in the shopping cart
 */
export const getCoursesInCart = async (
  cartItems: string[]
): Promise<Course[]> => {
  const { data } = await supabase
    .from("courses")
    .select("*")
    .in("id", cartItems)

  if (data) {
    return data
  }

  return []
}

export const getUsersOwnedCourses = async (
  userId: string
): Promise<Course[] | undefined> => {
  const { data: profile } = await serverSideSupabase()
    .from("profiles")
    .select("owned_courses")
    .eq("id", userId)
    .single()

  if (!profile || !profile.owned_courses) {
    return undefined
  }

  const { data: courses } = await supabase
    .from("courses")
    .select("*")
    .in("id", profile.owned_courses)

  if (!courses) {
    return undefined
  }

  return courses
}

export const getUsersSavedCourses = async (
  userId: string
): Promise<Course[] | undefined> => {
  const { data: profile } = await serverSideSupabase()
    .from("profiles")
    .select("saved_courses")
    .eq("id", userId)
    .single()

  if (!profile || !profile.saved_courses) {
    return undefined
  }

  const { data: courses } = await supabase
    .from("courses")
    .select("*")
    .in("id", profile.saved_courses)

  if (!courses) {
    return undefined
  }

  return courses
}

/**
 * Course player
 */

export const getModulesAndLessons = async (
  courseId: string
): Promise<CourseStructure | undefined> => {
  const { data, error } = await supabase
    .from("courses")
    .select(
      `id,
       title,
       description,
       short_desc,
       includes,
       requirements,
       price,
       tags,
       modules (
         id,
         title,
         sort_order,
         lessons (
           id,
           title,
           sort_order,
           content_type
         )
       )`
    )
    .eq("id", courseId)
    .single()

  if (error) {
    console.log(error)
    return undefined
  }

  if (!data || !Array.isArray(data.modules)) {
    return undefined
  }

  const nonNullModules = data.modules.filter(
    (modules): modules is NonNullable<CourseStructure["modules"][0]> =>
      modules.lessons !== null
  )

  // Sort modules and lessons
  const sortedModules = nonNullModules.sort(
    (a, b) => a.sort_order - b.sort_order
  )

  const sortedLessons = sortedModules.map(module => ({
    ...module,
    lessons: Array.isArray(module.lessons)
      ? module.lessons.sort((a, b) => a.sort_order - b.sort_order)
      : [],
  }))

  return {
    ...data,
    modules: sortedLessons,
  }
}

export const getUsersProgress = async (
  userId: string,
  courseId: string
): Promise<CourseProgress["completed_lessons"] | undefined> => {
  const { data: progress } = await supabase
    .from("course_progress")
    .select("completed_lessons")
    .eq("profile", userId)
    .eq("course", courseId)
    .single()

  if (!progress) {
    return undefined
  }

  return progress.completed_lessons ?? []
}
