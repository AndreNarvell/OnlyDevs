import { serverSideSupabase } from "../../../lib/supabase"

export const publishNewImage = async (
  courseId: string,
  bucket: "course-backgrounds" | "course-icons"
) => {
  const { data: foundImages } = await serverSideSupabase()
    .storage.from(bucket)
    .list("", { search: `pre-${courseId}` })

  const activeFileExists = foundImages?.length ? foundImages.length > 0 : false

  if (!activeFileExists) {
    return "No file to publish"
  }

  const { data: removalData, error: removalError } = await serverSideSupabase()
    .storage.from(bucket)
    .remove([courseId])

  if (removalError || !removalData) {
    return console.log("Error removing file", removalError)
  }

  const { data } = await serverSideSupabase()
    .storage.from(bucket)
    .move(`pre-${courseId}`, courseId)

  return data?.message ?? undefined
}
