import { siteUrl } from "../../constants/siteUrl"
import { stripe } from "../../lib/stripe"
import { getProfileById } from "../../models/profile"
import { Database } from "../../types/supabase"
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs"
import { NextApiHandler } from "next"
import Stripe from "stripe"
import { z } from "zod"

const checkoutSchema = z.object({
  cartItems: z.string().array(),
  cancelUrl: z.string(),
})

const handler: NextApiHandler = async (req, res) => {
  const body = checkoutSchema.parse(req.body)

  const supabase = createServerSupabaseClient<Database>({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return res.status(401).json({ error: "Not authenticated" })
  }

  const { data: profile, error: profileError } = await getProfileById(
    session.user.id
  )

  if (profileError) {
    console.log(profileError)
    return res.status(400).json({ error: "Could not fetch profile" })
  }

  if (!profile) {
    return res.status(500).json({ error: "No profile found" })
  }

  if (!profile.stripe_customer) {
    return res
      .status(400)
      .json({ error: "No stripe customer found. Contact support." })
  }

  const { data: courses, error } = await supabase
    .from("courses")
    .select("*")
    .in("id", body.cartItems)

  if (error) {
    return res.status(400).json({ error: "Could not fetch courses" })
  }

  if (!courses) {
    return res.status(500).json({ error: "Not courses returned" })
  }

  const lineItems = courses.map<Stripe.Checkout.SessionCreateParams.LineItem>(
    course => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: course.title,
          images: [
            `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/course-icons/${course.id}`,
          ],
          metadata: {
            course_id: course.id,
          },
          description: course.short_desc,
        },
        unit_amount: course.price,
      },
      quantity: 1,
    })
  )
  try {
    const checkoutSession = await stripe.checkout.sessions.create({
      success_url: `${siteUrl}/success?checkoutSessionId={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/${body.cancelUrl}`,
      line_items: lineItems,
      mode: "payment",
      payment_method_types: ["card"],
      customer: profile.stripe_customer,
    })

    if (!checkoutSession.url) {
      console.log(checkoutSession)
      return res.status(500).json({ error: "Something went wrong" })
    }

    res.json(checkoutSession.url)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: "Internal server error" })
  }
}

export default handler
