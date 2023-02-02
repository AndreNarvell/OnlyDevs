import { Text } from "../../../components/Text"
import { useEditorContent } from "../stores/editorContent"
import { RadioGroup } from "@headlessui/react"
import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import clsx from "clsx"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

export const CurriculumEditor = () => {
  const { query } = useRouter()
  const curriculum = useEditorContent(state => state.curriculum)

  const thisLesson = curriculum
    ?.find(module =>
      module.lessons.find(lesson => lesson.id === query.lessonId)
    )
    ?.lessons.find(lesson => lesson.id === query.lessonId)

  let [contentType, setContentType] = useState<"video" | "article">(
    (thisLesson?.content_type as "video" | "article" | null | undefined) ??
      "video"
  )

  const editor = useEditor({
    content: thisLesson?.article_data,
    extensions: [StarterKit],
    editorProps: {
      attributes: {
        class:
          "px-4 py-3 border border-accents-2 bg-background rounded-base focus:outline-none focus-visible:outline-none focus:border-foreground transition",
      },
    },
  })

  useEffect(() => {
    // @ts-ignore
    if (thisLesson && editor && !editor.isDestroyed) {
      editor.commands.setContent(thisLesson?.article_data ?? "")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, thisLesson])

  return (
    <section className="min-w-full col-span-2 p-6 whitespace-pre-line border shrink grow-0 border-accents-2 rounded-marketing max-w-min">
      <RadioGroup
        value={contentType}
        onChange={setContentType}
        className="mb-16"
      >
        <RadioGroup.Label className="block mb-1 text-sm">
          Content type
        </RadioGroup.Label>

        <div className="flex p-1 border divide-x cursor-pointer select-none border-accents-2 rounded-marketing bg-background divide-accents-2 gap-x-1 w-max">
          <RadioGroup.Option
            value="video"
            className="flex items-center h-10 px-4 gap-x-2 group"
          >
            {({ checked }) => (
              <>
                <div
                  className={clsx(
                    "flex items-center justify-center w-4 h-4 border rounded-full border-accents-2",
                    !checked && "group-hover:bg-accents-2"
                  )}
                >
                  {checked && (
                    <div className="w-2.5 h-2.5 rounded-full bg-success" />
                  )}
                </div>
                Video
              </>
            )}
          </RadioGroup.Option>
          <RadioGroup.Option
            value="article"
            className="flex items-center h-10 px-4 gap-x-2 group"
          >
            {({ checked }) => (
              <>
                <div
                  className={clsx(
                    "flex items-center justify-center w-4 h-4 border rounded-full border-accents-2",
                    !checked && "group-hover:bg-accents-2"
                  )}
                >
                  {checked && (
                    <div className="w-2.5 h-2.5 rounded-full bg-success" />
                  )}
                </div>
                Article
              </>
            )}
          </RadioGroup.Option>
        </div>
      </RadioGroup>

      {contentType === "video" && "video"}

      {contentType === "article" && (
        <>
          <Text as="label" size="sm" className="mb-1">
            Content
          </Text>
          <EditorContent editor={editor} />
        </>
      )}

      {/* <pre className="break-words whitespace-pre-line">
        {JSON.stringify(thisLesson, null, 2)}
      </pre> */}
    </section>
  )
}
