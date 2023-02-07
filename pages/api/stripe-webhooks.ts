import { stripe } from "../../lib/stripe"
import { serverSideSupabase } from "../../lib/supabase"
import { convertLineItemsToCartItems } from "../../utils/convertLineItemsToCartItems"
import { buffer } from "micro"
import { NextApiHandler } from "next"
import Stripe from "stripe"
import { util } from "zod"

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

      console.log("Handling checkout.session.completed event for", sessionId)

      try {
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

        const {
          data: profile,
          status: getProfileStatus,
          statusText: getProfileStatusText,
        } = await serverSideSupabase()
          .from("profiles")
          .select("id, owned_courses, saved_courses")
          .eq("stripe_customer", checkoutSession.customer)
          .single()

        console.log(
          getProfileStatus,
          getProfileStatusText,
          "Got profile",
          profile
        )

        if (!profile) {
          console.log("A profile was not found for this stripe customer")
          throw new Error("Invalid session")
        }

        const ownedCourses = profile.owned_courses ?? []
        const savedCourses = profile.saved_courses ?? []

        if (checkoutSession.line_items === undefined) {
          console.log("The checkout session has no line items")
          throw new Error("Invalid session")
        }

        console.log(
          "The checkout session has",
          checkoutSession.line_items.data.length,
          "line items"
        )

        // Get the course id from metadata in every line item
        const newCourses = convertLineItemsToCartItems(
          checkoutSession.line_items.data
        )

        console.log("The new courses are", newCourses)

        const removeDuplicates = Array.from(
          new Set([...ownedCourses, ...newCourses])
        )

        // Adds newly purchase courses to owned courses
        const { status: addCoursesStatus, statusText: addCoursesStatusText } =
          await serverSideSupabase()
            .from("profiles")
            .update({
              owned_courses: removeDuplicates,
            })
            .eq("id", profile.id)

        console.log(
          addCoursesStatus,
          addCoursesStatusText,
          "Added",
          "courses to",
          profile.id
        )

        // Removes owned courses from saved courses
        const {
          status: updateSavedCoursesStatus,
          statusText: updateSavedCoursesStatusText,
        } = await serverSideSupabase()
          .from("profiles")
          .update({
            saved_courses: savedCourses.filter(
              course => !removeDuplicates.includes(course)
            ),
          })
          .eq("id", profile.id)

        console.log(
          updateSavedCoursesStatus,
          updateSavedCoursesStatusText,
          "Updated one or more rows of saved courses from profile",
          profile.id
        )

        // Run the increment rpc function for each course
        for (const course of newCourses) {
          console.log("Incrementing course students for", course, "...")

          const { error, status, statusText } = await serverSideSupabase().rpc(
            "increment",
            {
              course_id: course,
            }
          )

          if (error) {
            return console.log("Error incrementing course students", error)
          }

          console.log(
            status,
            statusText,
            "Incremented course students for",
            course
          )
        }

        // Add the purchased course to the user's progress
        for (const course of newCourses) {
          console.log("Creating course progress row for", course, "...")

          const { error, status, statusText } = await serverSideSupabase()
            .from("course_progress")
            .insert({
              course,

              profile: profile.id,
              completed_lessons: [],
            })

          if (error) {
            return console.log("Error creating course progress row", error)
          }

          console.log(
            status,
            statusText,
            "Created course progress row for",
            course
          )
        }

        console.log("Finished handling checkout.session.completed event")
      } catch (error) {
        console.log("Something went wrong inside Stripe webhook handler", error)
      }

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
