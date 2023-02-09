import { serverSideSupabase } from "../../lib/supabase"
import { Database } from "../../types/supabase"
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs"
import { NextApiHandler } from "next"
import { z } from "zod"

const profileSchema = z
  .object({
    name: z.string(),
  })
  .partial()

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

  const { id: userId } = session.user

  const profileResult = profileSchema.safeParse(req.body)

  if (!profileResult.success) {
    return res.status(400).json({
      success: false,
      error: "Invalid request body",
    })
  }

  const { data, error } = await serverSideSupabase()
    .from("profiles")
    .update(profileResult.data)
    .eq("id", userId)
    .select("*")

  if (error && !data) {
    return res.status(500).json({
      success: false,
      error: error.message,
    })
  }

  return res.status(200).json({
    success: true,
  })
}

export default handler
