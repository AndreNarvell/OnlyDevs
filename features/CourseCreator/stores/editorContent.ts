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

  updateModule: (moduleId: string, fields: Partial<EditorModule>) => void
  updateLesson: (lessonId: string, fields: Partial<EditorLesson>) => void

  deleteModule: (moduleId: string) => void
  deleteLesson: (lessonId: string) => void
}

export const useEditorContent = create<EditorContent>(set => ({
  details: {} as EditorContent["details"],
  curriculum: undefined,

  setDetails: (fields: Partial<EditorContent["details"]>) =>
    set(state => ({ ...state, details: { ...state.details, ...fields } })),

  setCurriculum: (curriculum: EditorContent["curriculum"]) =>
    set(state => ({ ...state, curriculum })),

  updateModule: (moduleId: string, fields: Partial<EditorModule>) => {
    set(state => {
      if (!state.curriculum) return state

      const moduleIndex = state.curriculum.findIndex(
        module => module.id === moduleId
      )
      if (moduleIndex === undefined) return state

      return {
        ...state,
        curriculum: state.curriculum.map((module, index) => {
          if (index === moduleIndex) {
            return { ...state.curriculum![moduleIndex], ...fields }
          }
          return module
        }),
      }
    })
  },

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

  deleteModule: (moduleId: string) => {
    set(state => {
      if (!state.curriculum) return state

      const moduleIndex = state.curriculum.findIndex(
        module => module.id === moduleId
      )
      if (moduleIndex === undefined) return state

      return {
        ...state,
        curriculum: state.curriculum.filter(
          (module, index) => index !== moduleIndex
        ),
      }
    })
  },

  deleteLesson: (lessonId: string) => {
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
              lessons: state.curriculum[moduleIndex].lessons.filter(
                (lesson, index) => index !== lessonIndex
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
