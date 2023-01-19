import { NextApiHandler } from "next"
import Stripe from "stripe"
import { z } from "zod"
import { siteUrl } from "../../constants/siteUrl"
import { stripe } from "../../lib/stripe"
import { supabase } from "../../lib/supabase"

const checkoutSchema = z.object({
  cartItems: z.string().array(),
})

const handler: NextApiHandler = async (req, res) => {
  const body = checkoutSchema.parse(req.body)

  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .in("id", body.cartItems)

  if (error) {
    return res.status(500).json({ error: "Could not fetch courses" })
  }
  if (!data) {
    return res.status(500).json({ error: "Not courses returned" })
  }

  const lineItems = data.map<Stripe.Checkout.SessionCreateParams.LineItem>(
    course => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: course.title,
          images: [course.icon],
          metadata: {
            course_id: course.id,
          },
        },
        unit_amount: course.price,
      },
      quantity: 1,
    })
  )

  const session = await stripe.checkout.sessions.create({
    success_url: `${siteUrl}/success?checkoutSessionId={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/dashboard`,
    line_items: lineItems,
    mode: "payment",
    payment_method_types: ["card"],
  })

  if (!session.url) {
    return res.status(500).json({ error: "Something went wrong" })
  }

  res.json(session.url)
}

export default handler
