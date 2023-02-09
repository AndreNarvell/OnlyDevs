import { courseDetailsSchema } from "../../features/CourseCreator/types/CourseDetails"
import { curriculumSchema } from "../../features/CourseCreator/types/Curriculum"
import { publishNewImage } from "../../features/CourseCreator/utils/publishNewImage"
import { serverSideSupabase } from "../../lib/supabase"
import { getProfileById } from "../../models/profile"
import { Database } from "../../types/supabase"
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs"
import { NextApiHandler } from "next"
import slugify from "slugify"
import { z } from "zod"

const publishCourseSchema = z.object({
  courseId: z.string().uuid(),
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
    return res.status(401).json({
      success: false,
      error: "Not authenticated",
    })
  }

  const { data: profile, error: profileError } = await getProfileById(
    session.user.id
  )

  if (profileError) {
    console.log(profileError)
    return res.status(400).json({
      success: false,
      error: "Could not fetch profile",
    })
  }

  if (!profile) {
    return res.status(500).json({
      success: false,
      error: "No profile found",
    })
  }

  if (!bodyResult.success) {
    return res.status(400).json({
      success: false,
      error: bodyResult.error.issues,
    })
  }

  const { courseId, details, curriculum } = bodyResult.data

  const { data: course, error: courseError } = await supabase
    .from("courses")
    .select("id")
    .eq("id", courseId)
    .single()

  if (courseError) {
    console.log(courseError)
    return res.status(400).json({
      success: true,
      error: "Could not fetch courses",
    })
  }

  if (!course) {
    return res.status(400).json({
      success: false,
      error: "You are not the creator of this course",
    })
  }

  // Validate user inputs
  const hasMissingData = curriculum.some(module =>
    module.lessons.some(lesson => {
      if (lesson.content_type === "article") {
        if (!lesson.article_data || lesson.article_data === "<p></p>") {
          return true
        }
      } else if (lesson.content_type === "video") {
        if (!lesson.video_url) {
          return true
        }
      }

      return false
    })
  )
  if (hasMissingData) {
    return res.status(400).json({
      success: false,
      error: "Missing content in one or more lesson",
    })
  }

  //

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
      slug: slugify(details.title, { lower: true }),
    })
    .eq("id", courseId)

  if (updateError) {
    console.log(updateData, updateError)
  }

  const [iconResult, backgroundResult] = await Promise.all([
    publishNewImage(courseId, "course-icons"),
    publishNewImage(courseId, "course-backgrounds"),
  ])

  if (!iconResult || !backgroundResult) {
    console.log("Error publishing images", iconResult, backgroundResult)
  }

  const sortedCurriculum = curriculum.map((module, index) => ({
    ...module,
    sort_order: index,
    lessons: module.lessons.map((lesson, lessonIndex) => ({
      ...lesson,
      sort_order: lessonIndex,
    })),
  }))

  console.log("Starting delete!")

  const { data: deleteData, error: deleteError } = await serverSideSupabase()
    .from("modules")
    .delete()
    .eq("course_id", course.id)

  if (deleteError) {
    console.log("deleteError", deleteError)
    return res.end()
  }

  if (deleteData) {
    console.log("deleteData", deleteData)
  }

  const { data: modulesData, error: modulesError } = await serverSideSupabase()
    .from("modules")
    .insert(
      sortedCurriculum.map(module => ({
        id: module.id,
        course_id: courseId,
        title: module.title,
        sort_order: module.sort_order,
      }))
    )

  if (modulesError) {
    console.log("modulesError", modulesError)
    return res.end()
  }

  if (modulesData) {
    console.log("modulesData", modulesData)
  }

  const lessons = sortedCurriculum
    .map(module => {
      return module.lessons.map(lesson => ({
        id: lesson.id,
        module: module.id,
        title: lesson.title,
        content_type: lesson.content_type,
        sort_order: lesson.sort_order,
      }))
    })
    .flat()

  const lessonsData = sortedCurriculum
    .map(module => {
      return module.lessons.map(lesson => ({
        id: lesson.id,
        article_data: lesson.article_data,
        video_url: lesson.video_url,
      }))
    })
    .flat()

  const { data: lessonsInsertData, error: lessonsError } =
    await serverSideSupabase().from("lessons").insert(lessons)

  if (lessonsError) {
    console.log("lessonsError", lessonsError)
    return res.end()
  }

  if (lessonsInsertData) {
    console.log("lessonsInsertData", lessonsInsertData)
  }

  const { data: lessonsDataData, error: lessonDataError } =
    await serverSideSupabase().from("lessons_data").insert(lessonsData)

  if (lessonDataError) {
    console.log("lessonDataError", lessonDataError)
    return res.end()
  }

  if (lessonsDataData) {
    console.log("lessonsDataData", lessonsDataData)
  }

  const { status, statusText } = await serverSideSupabase()
    .from("courses")
    .update({
      published: true,
    })
    .eq("id", courseId)

  console.log("Publishing status", status, statusText)

  res.status(200).json({
    success: true,
    data: "you did it",
  })
}

export default handler
