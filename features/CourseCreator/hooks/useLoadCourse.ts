import { CourseStructure } from "../../../types/Course"
import { useEditorContent } from "../stores/editorContent"
import { useEffect } from "react"

export const useLoadCourse = (course: CourseStructure) => {
  const { details, curriculum, setDetails, setCurriculum } = useEditorContent()

  // Loads course into state if it's provided by
  // the server and not already loaded
  useEffect(() => {
    if (!curriculum || !details) {
      setCurriculum(course.modules)
      setDetails({
        title: course.title,
        description: course.description,
        short_desc: course.short_desc,
        includes: course.includes,
        requirements: course.requirements,
        price: course.price,
        tags: course.tags,
      })

      console.log("Loaded course into state")
    }
  }, [curriculum, details, course, setCurriculum, setDetails])
}
