import { Database } from "./supabase"

export type Course = Database["public"]["Tables"]["courses"]["Row"]

export type Section = Database["public"]["Tables"]["sections"]["Row"]

export type Lecture = Database["public"]["Tables"]["lectures"]["Row"]
export type LectureData = Database["public"]["Tables"]["lectures_data"]["Row"]

export type CourseWithSections = Course & {
  sections: Section[]
}

export type CourseWithSectionsAndLectures = CourseWithSections & {
  sections: (Section & {
    lessons: Lecture[]
  })[]
}

export type LectureStructure = {
  id: Course["id"]
  title: Course["title"]
  description: Course["description"]
  sections: {
    id: Section["id"]
    title: Section["title"]
    lectures: {
      id: Lecture["id"]
      title: Lecture["title"]
      // description: Lecture["description"]
      sort_order: Lecture["sort_order"]
    }[]
  }[]
}
