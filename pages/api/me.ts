import { serverSideSupabase } from "../../lib/supabase"
import { Profile } from "../../types/Profile"
import { Database } from "../../types/supabase"
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs"
import { NextApiHandler } from "next"

const handler: NextApiHandler<Profile | null> = async (req, res) => {
  const supabase = createServerSupabaseClient<Database>({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return res.status(401).json(null)
  }

  const { data: user } = await serverSideSupabase()
    .from("profiles")
    .select("*")
    .eq("id", session.user.id)
    .single()

  if (!user) {
    return res.status(404).json(null)
  }

  return res.status(200).json(user)
}

export default handler
