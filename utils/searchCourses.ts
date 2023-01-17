import fuzzysort from "fuzzysort"
import { Course } from "../types/Course"

export const searchCourses = (query: string, courses: Course[]) => {
  const formattedCourses = courses.map(course => ({
    ...course,
    tags: course.tags.join(" "),
  }))

  return fuzzysort
    .go(query, formattedCourses, {
      keys: ["title", "creator", "tags"],
    })
    .map(result => result.obj)
}
