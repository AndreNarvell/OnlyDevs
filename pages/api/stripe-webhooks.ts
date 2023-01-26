import { stripe } from "../../lib/stripe"
import { serverSideSupabase } from "../../lib/supabase"
import { buffer } from "micro"
import { NextApiHandler } from "next"
import Stripe from "stripe"

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
      // Do 3 things on purchase completion:
      // 1. Add the purchased course to the user's owned_courses
      // 2. Remove the purchased course from the user's saved_courses
      // 3. Add the purchased course to the user's progress

      const sessionId = (event.data.object as Stripe.Checkout.Session).id

      const checkoutSession = await stripe.checkout.sessions.retrieve(
        sessionId,
        {
          expand: [
            "line_items",
            "line_items.data.price",
            "line_items.data.price.product",
          ],
        }
      )

      const { data: profile } = await serverSideSupabase()
        .from("profiles")
        .select("id, owned_courses, saved_courses")
        .eq("stripe_customer", checkoutSession.customer)
        .single()

      if (!profile) {
        throw new Error("Invalid session")
      }

      const ownedCourses = profile.owned_courses ?? []
      const savedCourses = profile.saved_courses ?? []

      if (checkoutSession.line_items === undefined) {
        throw new Error("Invalid session")
      }

      const newCourses = checkoutSession.line_items.data
        .map(item => {
          if (
            item.price === null ||
            item.price.product === undefined ||
            typeof item.price.product === "string" ||
            item.price.product.deleted === true ||
            item.price.product.metadata.course_id === undefined
          ) {
            return undefined
            // throw new Error("Invalid price object")
          }

          return item.price.product.metadata.course_id
        })
        .filter((item): item is string => item !== undefined)

      const removeDuplicates = Array.from(
        new Set([...ownedCourses, ...newCourses])
      )

      // Adds newly purchase courses to owned courses
      await serverSideSupabase()
        .from("profiles")
        .update({
          owned_courses: removeDuplicates,
        })
        .eq("id", profile.id)

      // Removes owned courses from saved courses
      await serverSideSupabase()
        .from("profiles")
        .update({
          saved_courses: savedCourses.filter(
            course => !removeDuplicates.includes(course)
          ),
        })
        .eq("id", profile.id)

      // Run the increment rpc function for each course
      newCourses.forEach(async course => {
        const { error } = await serverSideSupabase().rpc("increment", {
          course_id: course,
        })

        if (error) {
          console.log(error)
        }
      })

      // Add the purchased course to the user's progress
      newCourses.forEach(async course => {
        const { error } = await serverSideSupabase()
          .from("course_progress")
          .insert({ course, profile: profile.id, completed_lessons: [] })

        if (error) {
          console.log(error)
        }
      })

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
