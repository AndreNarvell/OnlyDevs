import { getUsersProgress } from "../../../models/courses"
import { useSession } from "@supabase/auth-helpers-react"
import { useRouter } from "next/router"
import useSWR from "swr"

export const useCourseProgress = () => {
  const session = useSession()
  const { query } = useRouter()

  const shouldFetch =
    session?.user.id !== undefined && typeof query.courseId === "string"

  const { data, error, isLoading, isValidating, mutate } = useSWR(
    shouldFetch ? ["course-progress", query.courseId] : null,

    async () => {
      if (session?.user.id === undefined) {
        throw new Error("No session for some reason")
      }

      if (typeof query.courseId !== "string") {
        throw new Error("No courseId")
      }

      const progress = await getUsersProgress(session?.user.id, query.courseId)

      if (progress === undefined) {
        throw new Error("No progress found for this user and lesson")
      }

      return progress ?? []
    }
  )

  return {
    progress: data,
    isLoading,
    error,
    isValidating,
    mutate,
  }
}
