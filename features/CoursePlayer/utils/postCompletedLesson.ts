import { supabase } from "../../../lib/supabase"

export const postCompletedLesson = async (
  userId: string,
  courseId: string,
  newData: string[]
): Promise<string[]> => {
  const { error: updateError } = await supabase
    .from("course_progress")
    .update({
      completed_lessons: newData,
    })
    .match({
      profile: userId,
      course: courseId,
    })

  if (updateError) {
    console.log(updateError)
    throw updateError
  }

  const { data, error } = await supabase
    .from("course_progress")
    .select("completed_lessons")
    .match({
      profile: userId,
      course: courseId,
    })
    .single()

  if (error) {
    console.log(error)
    throw error
  }

  return data.completed_lessons ?? []
}
