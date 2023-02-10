import { Button, ButtonLink } from "../../../components/Button"
import { Text } from "../../../components/Text"
import { CourseStructure, LessonData } from "../../../types/Course"
import { useCourseProgress } from "../hooks/useCourseProgress"
import { getAdjacentLesson } from "../utils/getAdjacentLesson"
import { postCompletedLesson } from "../utils/postCompletedLesson"
import MuxPlayer from "@mux/mux-player-react"
import * as Dialog from "@radix-ui/react-dialog"
import { useSession } from "@supabase/auth-helpers-react"
import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { useRouter } from "next/router"
import { FC, useCallback, useEffect, useRef, useState } from "react"
import ReactCanvasConfetti from "react-canvas-confetti"

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
  const refAnimationInstance = useRef(null)

  const [isFinishDialogOpen, setIsFinishDialogOpen] = useState(false)

  const session = useSession()
  const router = useRouter()
  const { query } = router

  // Find the lesson based on the URL
  const lesson = course.modules
    .flatMap(module => module.lessons)
    .find(lesson => lesson.id === query.lessonId)

  const nextLessonId = getAdjacentLesson(course, query, 1)
  const previousLessonId = getAdjacentLesson(course, query, -1)

  const isFinalLesson = nextLessonId === undefined

  const noContent = lessonData === null && query.lessonId !== undefined
  const isArticle = !noContent && lesson?.content_type === "article"
  const isVideo = !noContent && lesson?.content_type === "video"

  const editor = useEditor({
    editable: false,
    content: lessonData?.article_data,
    extensions: [StarterKit],
  })

  useEffect(() => {
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
      async () => postCompletedLesson(session.user.id, course.id, newData),
      { optimisticData: newData }
    )
  }

  // @ts-ignore
  const getInstance = useCallback(instance => {
    refAnimationInstance.current = instance
  }, [])

  // @ts-ignore
  const makeShot = useCallback((particleRatio, opts) => {
    refAnimationInstance.current &&
      // @ts-ignore
      refAnimationInstance.current({
        ...opts,
        origin: { y: 0.7 },
        particleCount: Math.floor(200 * particleRatio),
      })
  }, [])

  const fire = useCallback(() => {
    makeShot(0.25, {
      spread: 26,
      startVelocity: 55,
    })

    makeShot(0.2, {
      spread: 60,
    })

    makeShot(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    })

    makeShot(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    })

    makeShot(0.1, {
      spread: 120,
      startVelocity: 45,
    })
  }, [makeShot])

  return (
    <>
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
        </div>

        <div className="w-full p-12 border border-accents-2 rounded-marketing min-h-[20rem] md:min-h-[30rem] lg:min-h-[40rem] mb-4">
          {noContent && (
            <Text as="p">
              This course does not have any {lesson?.content_type} content
              attached
            </Text>
          )}

          {isArticle && (
            <EditorContent
              editor={editor}
              className="prose prose-neutral prose-headings:text-foreground text-foreground prose-strong:text-foreground"
            />
          )}

          {isVideo && (
            <>
              {!tokens ? (
                <Text as="p">
                  You do not have permission to view this video
                </Text>
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

        <div className="flex justify-end w-full mb-16">
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
              <Button
                onClick={() => {
                  if (!progress) return

                  addCompleted(progress, lesson.id)

                  if (isFinalLesson) {
                    setIsFinishDialogOpen(true)

                    fire()
                  } else {
                    router.push({
                      pathname: "/my-courses",
                      query: {
                        ...query,
                        lessonId: nextLessonId,
                      },
                    })
                  }
                }}
                intent="success"
                size="small"
              >
                {isFinalLesson ? "Finish course" : "Next"}
              </Button>
            </div>
          )}
        </div>
      </section>

      <ReactCanvasConfetti
        refConfetti={getInstance}
        className="fixed inset-0 z-50 w-full h-full pointer-events-none"
      />

      <Dialog.Root
        open={isFinishDialogOpen}
        onOpenChange={setIsFinishDialogOpen}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40" />

          <Dialog.Content className="fixed flex flex-col items-center p-8 -translate-x-1/2 -translate-y-1/2 border top-1/2 left-1/2 bg-accents-1 border-accents-2 rounded-base gap-y-4">
            <Dialog.Title asChild>
              <Text
                as="h3"
                weight="bold"
                size="2xl"
                className="max-w-md"
                align="center"
              >
                Course finished!
              </Text>
            </Dialog.Title>

            <Dialog.Description className="flex flex-col gap-y-2">
              <Text as="h4" align="center">
                You have finished {course.title}!
              </Text>

              <Text as="p" align="center" intent="secondary">
                Now go buy another one!
              </Text>
            </Dialog.Description>

            <div className="flex gap-x-2">
              <ButtonLink href="/dashboard">Back to dashboard</ButtonLink>

              <Dialog.Close asChild>
                <Button intent="secondary">Close</Button>
              </Dialog.Close>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  )
}
