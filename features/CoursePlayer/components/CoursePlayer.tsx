import { ButtonLink } from "../../../components/Button"
import { Text } from "../../../components/Text"
import { CourseStructure, LessonData } from "../../../types/Course"
import MuxPlayer from "@mux/mux-player-react"
import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { useRouter } from "next/router"
import { FC, useMemo } from "react"

interface Props {
  course: CourseStructure
  lessonData: LessonData | null
}

export const CoursePlayer: FC<Props> = ({ course, lessonData }) => {
  const { query } = useRouter()

  // Find the lesson based on the URL
  const lesson = course.modules
    .flatMap(module => module.lessons)
    .find(lesson => lesson.id === query.lessonId)

  const nextLessonId = useMemo<string | undefined>(() => {
    const currentModule = course.modules.find(module =>
      module.lessons.some(lesson => lesson.id === query.lessonId)
    )
    if (!currentModule) {
      return undefined
    }

    const indexOfCurrentLesson = currentModule.lessons.findIndex(
      lesson => lesson.id === query.lessonId
    )
    if (indexOfCurrentLesson === undefined) {
      return undefined
    }

    const nextLessonId = currentModule.lessons[indexOfCurrentLesson + 1]?.id

    if (nextLessonId !== undefined) {
      return nextLessonId
    }

    const indexOfCurrentModule = course.modules.findIndex(
      module => module.id === currentModule.id
    )
    if (indexOfCurrentModule === undefined) {
      return undefined
    }

    const nextModule = course.modules[indexOfCurrentModule + 1]
    if (nextModule === undefined) {
      return undefined
    }

    return nextModule.lessons[0]?.id
  }, [query.lessonId, course.modules])

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
      <div className="flex items-end justify-between w-full mb-4">
        <Text
          as="h3"
          size="3xl"
          weight="bold"
          tracking="wide"
          intent={lesson ? undefined : "secondary"}
          className="mt-8"
        >
          {lesson ? lesson?.title : "No lesson selected"}
        </Text>

        {lesson && (
          <div className="flex gap-x-2">
            <ButtonLink href={{}} size="small" intent="secondary">
              Previous
            </ButtonLink>
            <ButtonLink
              href={{
                pathname: "/my-courses",
                query: {
                  ...query,
                  lessonId: nextLessonId,
                },
              }}
              intent="success"
              size="small"
            >
              Next
            </ButtonLink>
          </div>
        )}
      </div>

      <div className="w-full p-12 border border-accents-2 rounded-marketing min-h-[20rem] mb-16">
        {noContent && (
          <Text as="p">
            This course does not have any {lesson?.content_type} content
            attached
          </Text>
        )}

        {isArticle && <EditorContent editor={editor} />}

        {isVideo && (
          <MuxPlayer
            streamType="on-demand"
            className="aspect-video"
            playbackId="GOrp3HaV01ZDrUgOjFlmyyJVEeXJ3FDjGarQVBkdoKOA"
            metadata={{
              video_id: "video-id-54321",
              video_title: "Test video title",
              viewer_user_id: "user-id-007",
            }}
          />
        )}
      </div>
    </section>
  )
}
