import { EditorLesson, useEditorContent } from "../stores/editorContent"
import { useRouter } from "next/router"
import { useMemo } from "react"

/**
 * Used in the curriculum editor to get and update the current lesson
 */
export const useLesson = () => {
  const { query } = useRouter()

  const { curriculum, updateLesson } = useEditorContent(state => ({
    curriculum: state.curriculum,
    updateLesson: state.updateLesson,
  }))

  const lesson = useMemo(() => {
    const theModule = curriculum?.find(module => {
      return module.lessons.find(lesson => lesson.id === query.lessonId)
    })

    if (!theModule) {
      console.log("no module found")
      return undefined
    }
    // console.log("the module:", theModule.id)

    const theLesson = theModule.lessons.find((lesson, index, array) => {
      return lesson.id === query.lessonId
    })

    if (!theLesson) throw new Error("Lesson not found")
    // console.log("the lesson:", theLesson.id)

    return theLesson
  }, [curriculum, query])

  return {
    lesson,
    updateLesson: (fields: Partial<EditorLesson>) =>
      lesson && updateLesson(lesson.id, fields),
  }
}
