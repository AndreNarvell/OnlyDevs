import { ButtonLink } from "../../../components/Button"
import { Text } from "../../../components/Text"
import { useCourseProgress } from "../../../hooks/useCourseProgress"
import { CourseStructure, LessonData } from "../../../types/Course"
import { Database } from "../../../types/supabase"
import { getAdjacentLesson } from "../utils/getAdjacentLesson"
import MuxPlayer from "@mux/mux-player-react"
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react"
import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { useRouter } from "next/router"
import { FC, useEffect } from "react"

interface Props {
  course: CourseStructure
  lessonData: LessonData | null
  tokens?: {
    video: string
    thumbnail: string
  }
}

export const CoursePlayer: FC<Props> = ({ course, lessonData, tokens }) => {
  const { progress, mutate } = useCourseProgress()

  console.log("render")

  const { query } = useRouter()
  const supabase = useSupabaseClient<Database>()
  const session = useSession()

  // Find the lesson based on the URL
  const lesson = course.modules
    .flatMap(module => module.lessons)
    .find(lesson => lesson.id === query.lessonId)

  const nextLessonId = getAdjacentLesson(course, query, 1)
  const previousLessonId = getAdjacentLesson(course, query, -1)

  const isLastLesson = nextLessonId === undefined

  const noContent = lessonData === null && query.lessonId !== undefined
  const isArticle = !noContent && lesson?.content_type === "article"
  const isVideo = !noContent && lesson?.content_type === "video"

  const editor = useEditor({
    editable: false,
    content: lessonData?.article_data,
    extensions: [StarterKit],
  })

  useEffect(() => {
    // @ts-ignore
    if (lessonData && editor && !editor.isDestroyed) {
      editor.commands.setContent(lessonData?.article_data)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, lessonData])

  const addCompleted = async (prevProgress: string[], newLessonId: string) => {
    if (!session) return
    if (progress?.includes(newLessonId)) return

    const newData = [...prevProgress, newLessonId]

    await mutate(
      async prev => {
        if (!prev) return

        const { error: updateError } = await supabase
          .from("course_progress")
          .update({ completed_lessons: newData })
          .match({
            profile: session.user.id,
            course: course.id,
          })

        if (updateError) {
          console.log(updateError)
          throw updateError
        }

        const { data, error } = await supabase
          .from("course_progress")
          .select("completed_lessons")
          .match({
            profile: session.user.id,
            course: course.id,
          })
          .single()

        if (error) {
          console.log(error)
          throw error
        }

        return data.completed_lessons ?? []
      },
      { optimisticData: newData }
    )
  }

  return (
    <section className="w-full">
      <div className="flex items-end justify-between w-full mt-8 mb-4">
        <div className="flex items-center gap-x-2">
          <Text
            as="h3"
            size="3xl"
            weight="bold"
            tracking="wide"
            intent={lesson ? undefined : "secondary"}
          >
            {lesson ? lesson?.title : "No lesson selected"}
          </Text>
        </div>

        {lesson && (
          <div className="flex gap-x-2">
            <ButtonLink
              href={{
                pathname: "/my-courses",
                query: { ...query, lessonId: previousLessonId },
              }}
              size="small"
              intent="secondary"
            >
              Previous
            </ButtonLink>
            <ButtonLink
              onClick={() => {
                if (progress) {
                  addCompleted(progress, lesson.id)
                }
              }}
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
              {isLastLesson ? "Finish course" : "Next"}
            </ButtonLink>
          </div>
        )}
      </div>

      <div className="w-full p-12 border border-accents-2 rounded-marketing min-h-[20rem] md:min-h-[30rem] lg:min-h-[40rem] mb-16">
        {noContent && (
          <Text as="p">
            This course does not have any {lesson?.content_type} content
            attached
          </Text>
        )}

        {isArticle && (
          <EditorContent
            editor={editor}
            className="prose prose-headings:text-foreground text-foreground prose-strong:text-foreground"
          />
        )}

        {isVideo && (
          <>
            {!tokens ? (
              <Text as="p">You do not have permission to view this video</Text>
            ) : (
              <MuxPlayer
                streamType="on-demand"
                className="aspect-video"
                playbackId={lessonData?.video_url ?? undefined}
                tokens={{
                  playback: tokens.video,
                  thumbnail: tokens.thumbnail,
                }}
                metadata={{
                  video_id: "video-id-54321",
                  video_title: "Test video title",
                  viewer_user_id: "user-id-007",
                }}
              />
            )}
          </>
        )}
      </div>
    </section>
  )
}
