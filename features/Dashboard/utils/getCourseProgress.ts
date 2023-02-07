import { serverSideSupabase } from "../../../lib/supabase"

export const getCourseProgress = async (
  userId: string
): Promise<Record<string, number>> => {
  const { data: profile } = await serverSideSupabase()
    .from("profiles")
    .select("owned_courses")
    .eq("id", userId)
    .single()

  if (!profile?.owned_courses) throw new Error("Could not fetch profile")

  const [{ data: completedLessons }, { data: modules }] = await Promise.all([
    serverSideSupabase()
      .from("course_progress")
      .select("course, completed_lessons")
      .eq("profile", userId)
      .in("course", profile.owned_courses),

    serverSideSupabase()
      .from("modules")
      .select("course_id, lessons(id)")
      .in("course_id", profile.owned_courses),
  ])

  if (!completedLessons || !modules) throw new Error("Could not fetch data")

  // Count the number of lessons in each course
  const numberOfLessonsInCourse = profile.owned_courses.reduce<
    Record<string, number>
  >((acc, curr) => {
    return {
      ...acc,
      [curr]: modules
        .filter(module => module.course_id === curr)
        .reduce<number>((acc, curr) => {
          if (!Array.isArray(curr.lessons)) {
            return acc
          }

          return acc + curr.lessons.length
        }, 0),
    }
  }, {})

  // Count the number of completed lessons in each course
  const numberOfCompletedLessonsByCourse = profile.owned_courses.reduce<
    Record<string, number>
  >((acc, curr) => {
    return {
      ...acc,
      [curr]: completedLessons
        .filter(lesson => lesson.course === curr)
        .reduce((acc, curr) => acc + curr.completed_lessons.length, 0),
    }
  }, {})

  // Provides a value between 0 and 100 for each course
  return profile.owned_courses.reduce<Record<string, number>>((acc, curr) => {
    const lessons = numberOfLessonsInCourse[curr]
    const completedLessons = numberOfCompletedLessonsByCourse[curr]

    const progress = completedLessons / lessons

    return {
      ...acc,
      [curr]: Math.round((Number.isNaN(progress) ? 0 : progress) * 100),
    }
  }, {})
}
