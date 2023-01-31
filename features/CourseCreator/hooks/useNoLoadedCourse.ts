import { useEditorContent } from "../stores/editorContent"
import { useRouter } from "next/router"
import { useEffect } from "react"

export const useNoLoadedCourse = () => {
  const { details, curriculum } = useEditorContent(state => ({
    details: state.details,
    curriculum: state.curriculum,
  }))
  const router = useRouter()

  // Redirects to details page if course is not loaded
  const courseId = router.query.courseId

  useEffect(() => {
    if (!details || !curriculum) {
      if (typeof courseId === "string") {
        router.push(`/create/${router.query.courseId}/details`)
      }
    }
  }, [courseId, curriculum, details, router])
}
