import { NextApiHandler } from "next"
import Stripe from "stripe"
import { stripe } from "../../lib/stripe"
import { buffer } from "micro"
import { serverSideSupabase } from "../../lib/supabase"

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!

const handler: NextApiHandler = async (req, res) => {
  const sig = req.headers["stripe-signature"]
  const reqBuffer = await buffer(req)

  if (typeof sig !== "string") {
    console.log("Webhook Error: Missing Stripe-Signature header")
    return res
      .status(400)
      .send("Webhook Error: Missing Stripe-Signature header")
  }

  let event: Stripe.Event | undefined

  try {
    event = stripe.webhooks.constructEvent(reqBuffer, sig, endpointSecret)
  } catch (err) {
    console.log(`Webhook Error: ${(err as Error).message}`)
    return res.status(400).send(`Webhook Error: ${(err as Error).message}`)
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      const sessionId = (event.data.object as Stripe.Checkout.Session).id

      const session = await stripe.checkout.sessions.retrieve(sessionId, {
        expand: [
          "line_items",
          "line_items.data.price",
          "line_items.data.price.product",
        ],
      })

      const { data } = await serverSideSupabase()
        .from("profiles")
        .select("owned_courses")
        .eq("stripe_customer", session.customer)
        .single()

      const ownedCourses = data?.owned_courses ?? []

      if (session.line_items === undefined) {
        throw new Error("Invalid session")
      }

      const newCourses = session.line_items.data.map(item => {
        if (
          item.price === null ||
          item.price.product === undefined ||
          typeof item.price.product === "string" ||
          item.price.product.deleted === true ||
          item.price.product.metadata.course_id === undefined
        ) {
          console.log(
            "item.price?.product.metadata.course_id:",
            item.price?.product.metadata?.course_id
          )
          throw new Error("Invalid price object")
        }

        return item.price.product.metadata.course_id
      })

      serverSideSupabase()
        .from("profiles")
        .update({
          owned_courses: [...ownedCourses, ...newCourses],
        })
        .eq("stripe_customer", session.customer)

      break
    default:
      console.log(`Unhandled event type ${event.type}`)
  }

  // Return a 200 response to acknowledge receipt of the event
  res.status(200).end()
}

export default handler

export const config = {
  api: {
    bodyParser: false,
  },
}
