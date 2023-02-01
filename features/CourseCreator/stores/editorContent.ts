import { Course, Module, Lesson } from "../../../types/Course"
import { create } from "zustand"

export type EditorModule = Pick<Module, "id" | "title" | "sort_order"> & {
  lessons: EditorLesson[]
}

type EditorLesson = Pick<Lesson, "id" | "title" | "content_type" | "sort_order">

export type EditorContent = {
  details: Pick<
    Course,
    | "title"
    | "description"
    | "short_desc"
    | "includes"
    | "requirements"
    | "price"
    | "tags"
  >
  curriculum: EditorModule[] | undefined

  setDetails: (details: EditorContent["details"]) => void
  setCurriculum: (curriculum: EditorContent["curriculum"]) => void
}

export const useEditorContent = create<EditorContent>(set => ({
  details: {} as EditorContent["details"],
  curriculum: undefined,

  setDetails: (fields: Partial<EditorContent["details"]>) =>
    set(state => ({ ...state, details: { ...state.details, ...fields } })),

  setCurriculum: (curriculum: EditorContent["curriculum"]) =>
    set(state => ({ ...state, curriculum })),
}))
