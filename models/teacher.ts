import { serverSideSupabase, supabase } from "../lib/supabase"

/**
 * # Server only!
 */
export const getTeacherById = async (id: string) => {
  const [teacher, numberOfCourses, numberOfStudents] = await Promise.all([
    serverSideSupabase()
      .from("teachers")
      .select(`*, profiles (name, picture)`)
      .eq("id", id)
      .single(),
    supabase.from("courses").select("*", { count: "exact" }).eq("creator", id),
    supabase.from("courses").select("number_of_students").eq("creator", id),
  ])

  const totalNumberOfStudents = numberOfStudents.data?.reduce<number>(
    (prev, curr) => {
      const currentOrZero = curr?.number_of_students ?? 0
      return prev + currentOrZero
    },
    0
  )

  return {
    ...teacher.data,
    numberOfCourses: numberOfCourses.count ?? 0,
    totalNumberOfStudents: totalNumberOfStudents ?? 0,
  }
}

export const checkIfUserIsTeacher = async (userId: string) => {
  const { data, error } = await supabase
    .from("teachers")
    .select("id")
    .eq("id", userId)
    .single()

  if (error) {
    console.log(error)
    return false
  }

  return data !== null
}
