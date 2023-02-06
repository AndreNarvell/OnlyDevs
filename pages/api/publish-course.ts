import { courseDetailsSchema } from "../../features/CourseCreator/types/CourseDetails"
import { curriculumSchema } from "../../features/CourseCreator/types/Curriculum"
import { getProfileById } from "../../models/profile"
import { Database } from "../../types/supabase"
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs"
import { NextApiHandler } from "next"
import { z } from "zod"

const publishCourseSchema = z.object({
  id: z.string().uuid(),
  details: courseDetailsSchema.extend({ price: z.number().int() }),
  curriculum: curriculumSchema,
})

const handler: NextApiHandler = async (req, res) => {
  // const {session, supabase} = protectEndpoint(req,res)

  const bodyResult = publishCourseSchema.safeParse(req.body)

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

  if (!bodyResult.success) {
    return res.status(400).json({ error: bodyResult.error.issues })
  }

  const { id, details, curriculum } = bodyResult.data

  const { data, error } = await supabase
    .from("courses")
    .select("id")
    .eq("id", id)
    .single()

  if (error) {
    console.log(error)
    return res.status(400).json({ error: "Could not fetch courses" })
  }

  if (!data) {
    return res
      .status(400)
      .json({ error: "You are not the creator of this course" })
  }

  const { data: updateData, error: updateError } = await supabase
    .from("courses")
    .update({
      title: details.title,
      description: details.description,
      short_desc: details.short_desc,
      tags: details.tags,
      includes: details.includes,
      requirements: details.requirements,
      price: details.price,
    })
    .eq("id", id)

  console.log(updateData, updateError)

  res.status(200).json({ data: "you did it" })
}

export default handler
