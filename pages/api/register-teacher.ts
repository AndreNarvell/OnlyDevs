import { teacherFormSchema } from "../../features/BecomeATeacher/types/TeacherForm"
import { serverSideSupabase } from "../../lib/supabase"
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

  const { data: teacher, error: teacherError } = await serverSideSupabase()
    .from("teachers")
    .insert({
      id: session.user.id,
      description,
      short_desc,
    })
    .select("id")
    .single()

  if (teacherError) {
    switch (teacherError.code) {
      case "23505":
        return res.status(400).json({
          success: false,
          error: "This account is already a teacher",
        })

      default:
        return res.status(400).json({
          success: false,
          error: "Could not register teacher",
        })
    }
  }

  res.json({
    success: true,
  })
}

export default handler
