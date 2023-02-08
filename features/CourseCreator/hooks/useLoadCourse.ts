import { CourseStructure } from "../../../types/Course"
import { useEditorContent } from "../stores/editorContent"
import { useEffect } from "react"

/**
 * Used to set initial state of the editor
 */
export const useLoadCourse = (course: CourseStructure) => {
  const [details, initDetails, curriculum, initCurriculum] = useEditorContent(
    (state) => [
      state.details,
      state.initDetails,
      state.curriculum,
      state.initCurriculum,
    ]
  )

  // Loads course into state if it's provided by
  // the server and not already loaded
  useEffect(() => {
    if (!curriculum) {
      initCurriculum(course.modules)
      console.log("Loaded curriculum into state")
    }

    // `details` can actually be an empty object even though TypeScript says otherwise
    // That's why we need to check if it's empty
    if (Object.keys(details).length === 0) {
      initDetails({
        title: course.title,
        description: course.description,
        short_desc: course.short_desc,
        includes: course.includes,
        requirements: course.requirements,
        price: course.price,
        tags: course.tags,
        category_id: course.category_id,
      })

      console.log("Loaded course details into state")
    }
  }, [curriculum, details, course, initCurriculum, initDetails])
}
