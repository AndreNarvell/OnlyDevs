import { Course, Module, Lesson } from "../../../types/Course"
import { create } from "zustand"

type EditorModule = Pick<Module, "id" | "title" | "sort_order"> & {
  lessons: EditorLesson[]
}

type EditorLesson = Pick<Lesson, "id" | "title" | "content_type" | "sort_order">

type EditorContent = {
  details?: Pick<
    Course,
    | "title"
    | "description"
    | "short_desc"
    | "background_image"
    | "icon"
    | "includes"
    | "requirements"
    | "price"
    | "tags"
  >

  curriculum: EditorModule[]

  setDetails: (details: EditorContent["details"]) => void
  setCurriculum: (curriculum: EditorContent["curriculum"]) => void
}

export const useEditorContent = create<EditorContent>(set => ({
  details: undefined,
  curriculum: [],

  setDetails: (details: EditorContent["details"]) =>
    set(state => ({ ...state, details })),

  setCurriculum: (curriculum: EditorContent["curriculum"]) =>
    set(state => ({ ...state, curriculum })),
}))
