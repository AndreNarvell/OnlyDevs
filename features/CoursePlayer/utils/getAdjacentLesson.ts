import { CourseStructure } from "../../../types/Course"
import { ParsedUrlQuery } from "querystring"

export const getAdjacentLesson = (
  course: CourseStructure,
  query: ParsedUrlQuery,
  increment: number
): string | undefined => {
  const currentModule = course.modules.find(module =>
    module.lessons.some(lesson => lesson.id === query.lessonId)
  )
  if (!currentModule) return undefined

  const indexOfCurrentLesson = currentModule.lessons.findIndex(
    lesson => lesson.id === query.lessonId
  )
  if (indexOfCurrentLesson === undefined) return undefined

  const adjacentLessonId =
    currentModule.lessons[indexOfCurrentLesson + increment]?.id
  if (adjacentLessonId !== undefined) return adjacentLessonId

  const indexOfCurrentModule = course.modules.findIndex(
    module => module.id === currentModule.id
  )
  if (indexOfCurrentModule === undefined) return undefined

  const adjacentModule = course.modules[indexOfCurrentModule + increment]
  if (adjacentModule === undefined) return undefined

  if (increment > 0) {
    return adjacentModule.lessons[0]?.id
  } else {
    return adjacentModule.lessons[adjacentModule.lessons.length - 1]?.id
  }
}
