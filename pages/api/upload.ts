import { Database } from "../../types/supabase"
import Mux from "@mux/mux-node"
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs"
import { NextApiHandler } from "next"

const { Video } = new Mux(
  process.env.MUX_TOKEN_ID!,
  process.env.MUX_TOKEN_SECRET!
)

const handler: NextApiHandler = async (req, res) => {
  const supabase = createServerSupabaseClient<Database>({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return res.status(401).json({ error: "Not authenticated" })
  }

  const upload = await Video.Uploads.create({
    cors_origin: process.env.NEXT_PUBLIC_VERCEL_URL
      ? "https://onlydevs.vercel.app"
      : "http://localhost",
    new_asset_settings: {
      playback_policy: "signed",
    },
  })

  res.status(200).json({
    uploadId: upload.id,
    url: upload.url,
  })
}

export default handler
