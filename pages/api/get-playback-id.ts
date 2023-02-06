import { Database } from "../../types/supabase"
import Mux from "@mux/mux-node"
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs"
import { NextApiHandler } from "next"
import { z } from "zod"

const { Video } = new Mux(
  process.env.MUX_TOKEN_ID!,
  process.env.MUX_TOKEN_SECRET!
)

const bodySchema = z.object({
  uploadId: z.string(),
})

const handler: NextApiHandler = async (req, res) => {
  const supabase = createServerSupabaseClient<Database>({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return res.status(401).json({ error: "Not authenticated" })
  }

  const body = bodySchema.parse(req.body)

  const upload = await Video.Uploads.get(body.uploadId)

  const assetId = upload.asset_id

  console.log(upload)

  if (!assetId) {
    return res.status(400).json({ error: "No asset id found" })
  }

  const asset = await Video.Assets.get(assetId)

  const playbackId = asset.playback_ids?.[0].id
  if (!playbackId) {
    return res.status(400).json({ error: "No playback id found" })
  }

  res.status(200).json(playbackId)
}

export default handler
