import fuzzysort from "fuzzysort"
import { Course } from "../types/Course"

export const searchCourses = (query: string, courses: Course[]) => {
  return fuzzysort
    .go(query, courses, {
      keys: ["title", "creator", "tags"],
    })
    .map(result => result.obj)
}
