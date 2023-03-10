export const getImageUrl = (
  bucket: "course-backgrounds" | "course-icons" | "profile-pictures",
  id: string,
  options: {
    noCache?: boolean
    preview?: boolean
  } = {
    noCache: false,
    preview: false,
  }
) => {
  const { noCache, preview } = options

  const baseUrl = `${
    process.env.NEXT_PUBLIC_SUPABASE_URL
  }/storage/v1/object/public/${bucket}/${preview ? "pre-" : ""}${id}`

  const cacheBuster = noCache ? `?${Date.now()}` : ""

  return baseUrl + cacheBuster
}
