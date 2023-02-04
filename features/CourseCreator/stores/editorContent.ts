import { Course, Module, Lesson } from "../../../types/Course"
import { create } from "zustand"

export type EditorModule = Pick<Module, "id" | "title" | "sort_order"> & {
  lessons: EditorLesson[]
}

export type EditorLesson = Pick<
  Lesson,
  "id" | "title" | "content_type" | "sort_order"
> & {
  article_data: string | null
  video_url: string | null
}

export type EditorDetails = Pick<
  Course,
  | "title"
  | "description"
  | "short_desc"
  | "includes"
  | "requirements"
  | "price"
  | "tags"
>

export type EditorContent = {
  details: EditorDetails
  curriculum: EditorModule[] | undefined

  setDetails: (details: EditorContent["details"]) => void
  setCurriculum: (curriculum: EditorContent["curriculum"]) => void
  updateLesson: (lessonId: string, fields: Partial<EditorLesson>) => void
}

export const useEditorContent = create<EditorContent>(set => ({
  details: {} as EditorContent["details"],
  curriculum: undefined,

  setDetails: (fields: Partial<EditorContent["details"]>) =>
    set(state => ({ ...state, details: { ...state.details, ...fields } })),

  setCurriculum: (curriculum: EditorContent["curriculum"]) =>
    set(state => ({ ...state, curriculum })),

  updateLesson: (lessonId: string, fields: Partial<EditorLesson>) => {
    set(state => {
      if (!state.curriculum) return state

      const moduleIndex = state.curriculum.findIndex(module =>
        module.lessons.find(lesson => lesson.id === lessonId)
      )
      if (moduleIndex === undefined) return state

      const lessonIndex = state.curriculum[moduleIndex].lessons.findIndex(
        lesson => lesson.id === lessonId
      )
      if (lessonIndex === undefined) return state

      return {
        ...state,
        curriculum: state.curriculum.map((module, index) => {
          if (!state.curriculum) throw new Error("This cant happen")

          if (index === moduleIndex) {
            return {
              ...state.curriculum[moduleIndex],
              lessons: state.curriculum[moduleIndex].lessons.map(
                (lesson, index) => {
                  if (index === lessonIndex) {
                    const merged = { ...lesson, ...fields }

                    return merged
                  } else {
                    return lesson
                  }
                }
              ),
            }
          } else {
            return module
          }
        }),
      }
    })
  },
}))
