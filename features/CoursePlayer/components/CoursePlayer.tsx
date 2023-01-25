import { Text } from "../../../components/Text"
import { CourseStructure, LessonData } from "../../../types/Course"
import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { useRouter } from "next/router"
import { FC } from "react"

interface Props {
  lesson?: CourseStructure["modules"][0]["lessons"][0]
  lessonData: LessonData | null
}

export const CoursePlayer: FC<Props> = ({ lesson, lessonData }) => {
  const { query } = useRouter()

  const noContent = lessonData === null && query.lessonId !== undefined
  const isArticle = !noContent && lesson?.content_type === "article"
  const isVideo = !noContent && lesson?.content_type === "video"

  const editor = useEditor({
    editable: false,
    content: lessonData?.article_data,
    extensions: [StarterKit],
  })

  return (
    <section className="w-full">
      <Text
        as="h3"
        size="3xl"
        weight="bold"
        tracking="wide"
        className="mt-24 mb-8"
      >
        {lesson?.title}
      </Text>

      <div className="w-full p-12 border border-accents-2 rounded-marketing min-h-[20rem]">
        {noContent && (
          <Text as="p">
            This course does not have any {lesson?.content_type} content
            attached
          </Text>
        )}

        {isArticle && <EditorContent editor={editor} />}

        {isVideo && <Text as="p">Video</Text>}
      </div>
    </section>
  )
}
