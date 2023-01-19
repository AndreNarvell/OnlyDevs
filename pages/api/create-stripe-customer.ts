import { NextApiHandler } from "next"
import { z } from "zod"
import { stripe } from "../../lib/stripe"
import { serverSideSupabase } from "../../lib/supabase"

const profileSchema = z.object({
  id: z.string(),
  email: z.string(),
})

const handler: NextApiHandler = async (req, res) => {
  if (req.query.API_ROUTE_SECRET !== process.env.API_ROUTE_SECRET) {
    return res.status(401).json({ error: "Invalid API_ROUTE_SECRET" })
  }

  const profile = profileSchema.safeParse(req.body.record)
  if (!profile.success) {
    console.log(profile.error)
    return res.status(400).json({ error: "Invalid request body" })
  }

  try {
    const customer = await stripe.customers.create({
      email: profile.data.email,
    })

    await serverSideSupabase()
      .from("profiles")
      .update({ stripe_customer: customer.id })
      .eq("id", profile.data.id)

    return res.status(200).json({ success: true })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: "Something went wrong" })
  }
}

export default handler
