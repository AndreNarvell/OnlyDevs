import { serverSideSupabase } from "../../lib/supabase"
import { getProfileById } from "../../models/profile"
import { getTeacherById } from "../../models/teacher"
import { Database } from "../../types/supabase"
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs"
import { NextApiHandler } from "next"

const handler: NextApiHandler = async (req, res) => {
  const supabase = createServerSupabaseClient<Database>({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return res.status(401).json({
      success: false,
      error: "Not authenticated",
    })
  }

  const { data: teacher } = await serverSideSupabase()
    .from("teachers")
    .select("id")
    .eq("id", session.user.id)
    .single()

  if (!teacher) {
    return res.status(401).json({
      success: false,
      error: "Not authorized",
    })
  }

  // Create course
  const { data: course, error: courseError } = await supabase
    .from("courses")
    .insert({
      creator: teacher.id,
    })
    .select("id")
    .single()

  if (courseError) {
    console.log(courseError)
    return res.status(400).json({
      success: false,
      error: "Could not create course",
    })
  }

  res.json(course.id)
}

export default handler
