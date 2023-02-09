import { teacherFormSchema } from "../../features/BecomeATeacher/types/TeacherForm"
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

  const bodyResult = teacherFormSchema.safeParse(req.body)

  if (!bodyResult.success) {
    return res.status(400).json({
      success: false,
      error: bodyResult.error.issues,
    })
  }

  const { description, short_desc } = bodyResult.data

  const { data: teacher, error: teacherError } = await supabase
    .from("teachers")
    .insert({
      id: session.user.id,
      description,
      short_desc,
    })
    .select("id")
    .single()

  if (teacherError) {
    console.log(teacherError)
    return res.status(400).json({
      success: false,
      error: "Could not create teacher",
    })
  }
}

export default handler
