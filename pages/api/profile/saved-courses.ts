import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs"
import { NextApiHandler } from "next"
import { z } from "zod"
import { updateSavedCourses } from "../../../models/profile"
import { Database } from "../../../types/supabase"

const courseIdSchema = z.string()

const handler: NextApiHandler = async (req, res) => {
  const savedCourses = courseIdSchema.parse(req.body)

  const supabase = createServerSupabaseClient<Database>({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    console.log("Not authenticated")
    return res.status(401).json({ error: "Not authenticated" })
  }

  const { error, data } = await updateSavedCourses(
    session.user.id,
    savedCourses
  )

  if (error || !data) {
    console.log(error)
    return res.status(500).json({ error: "Could not update saved courses" })
  }

  return res.status(200).json(data)
}

export default handler
