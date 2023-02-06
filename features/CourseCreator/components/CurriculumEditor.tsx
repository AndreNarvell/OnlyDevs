import { Button } from "../../../components/Button"
import { FieldError, Input } from "../../../components/Input"
import { Text } from "../../../components/Text"
import { useLesson } from "../hooks/useLesson"
import { useEditorContent } from "../stores/editorContent"
import { RadioGroup } from "@headlessui/react"
import { CodeBracketIcon } from "@heroicons/react/24/outline"
import * as UpChunk from "@mux/upchunk"
import * as Progress from "@radix-ui/react-progress"
import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import clsx from "clsx"
import { useRouter } from "next/router"
import { HTMLAttributes, useEffect, useRef, useState } from "react"

export const CurriculumEditor = () => {
  const router = useRouter()

  const deleteLesson = useEditorContent(state => state.deleteLesson)

  const { lesson, updateLesson } = useLesson()
  const [content, setContent] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [progress, setProgress] = useState(0)
  const [statusMessage, setStatusMessage] = useState<string>("")
  const [errorMessage, setErrorMessage] = useState<string>("")

  const editor = useEditor({
    content: lesson?.article_data,
    extensions: [StarterKit],
    editorProps: {
      attributes: {
        class:
          "px-4 py-3 border border-accents-2 bg-background rounded-base focus:outline-none focus-visible:outline-none focus:border-foreground transition min-h-[20rem]",
      },
    },

    onUpdate: ({ editor }) => {
      console.log("onUpdate")
      setContent(editor.getHTML())
    },
  })

  // Clear content on reroute
  useEffect(() => {
    const clearContent = () => {
      setContent(null)
      if (!editor?.isDestroyed) {
        editor?.commands.clearContent()
      }
    }

    router.events.on("routeChangeStart", clearContent)
    return () => router.events.off("routeChangeStart", clearContent)
  }, [router, editor])

  // Load course content into editor when changing lesson or loading page
  useEffect(() => {
    if (
      lesson &&
      editor &&
      !editor.isDestroyed &&
      lesson.article_data !== content
    ) {
      console.log("loaded new content into editor from state")
      editor.commands.setContent(lesson.article_data)
      setContent(lesson.article_data)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson, editor])

  // Update lesson's article content on editor content change
  useEffect(() => {
    if (
      lesson &&
      content &&
      lesson.article_data !== content &&
      (lesson.article_data !== null || content.length > 0)
    ) {
      console.log("update lesson.article_content")
      updateLesson({ article_data: content })
      // setContent()
    }
  }, [lesson, content, updateLesson])

  if (!lesson) return null

  return (
    <section className="min-w-full col-span-2 p-6 whitespace-pre-line border shrink grow-0 border-accents-2 rounded-marketing max-w-min">
      <div className="flex flex-col gap-2">
        <Input
          fullWidth
          name="lessonName"
          label="Lesson name"
          showLabel
          // size="large"
          className="w-96"
          value={lesson.title}
          onChange={e =>
            updateLesson({
              title: e.target.value,
            })
          }
        />

        <RadioGroup
          value={lesson.content_type}
          onChange={value =>
            updateLesson({
              content_type: value,
            })
          }
          className="h-10 mb-16"
        >
          <RadioGroup.Label className="block mb-1 text-xs font-medium leading-normal">
            Content type
          </RadioGroup.Label>

          <div className="flex items-center h-full border select-none border-accents-2 rounded-base bg-background w-max">
            <RadioGroup.Option
              value="video"
              className="flex items-center h-full px-3 cursor-pointer gap-x-2 group"
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

            <div className="w-px h-8 bg-accents-2" />

            <RadioGroup.Option
              value="article"
              className="flex items-center h-full px-3 cursor-pointer gap-x-2 group"
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
      </div>

      {lesson.content_type === "video" && (
        <form
          onSubmit={async e => {
            e.preventDefault()

            const response = await fetch("/api/upload", {
              method: "POST",
            })

            if (!response.ok) {
              return setErrorMessage("Error getting upload url")
            }

            const { url, uploadId } = (await response.json()) as {
              uploadId: string
              url: string
            }

            const file = fileInputRef.current?.files?.[0]

            if (!file) {
              return setErrorMessage("No file")
            }

            try {
              const upload = UpChunk.createUpload({
                endpoint: url, // Authenticated url
                file: file, // File object with your video file’s properties
                chunkSize: 5120, // Uploads the file in ~5mb chunks
              })

              // Subscribe to events
              upload.on("error", error => {
                setStatusMessage(error.detail)
              })

              upload.on("progress", progress => {
                setProgress(progress.detail)
              })

              upload.on("success", async () => {
                setStatusMessage("Wrap it up, we're done here. 👋")

                const response = await fetch("/api/get-playback-id", {
                  method: "post",
                  body: JSON.stringify({
                    uploadId,
                  }),
                  headers: {
                    "Content-Type": "application/json",
                  },
                })

                if (!response.ok) {
                  return setErrorMessage("Error getting playback id")
                }

                const playbackId = await response.json()

                updateLesson({
                  video_url: playbackId,
                })
              })
            } catch (error) {
              if (error instanceof Error) {
                setErrorMessage(error.message)
              } else {
                setErrorMessage("Upload error")
              }
            }
          }}
        >
          <div className="flex items-start gap-2 mb-3">
            <Input
              id="video-file-picker"
              label="Video file"
              type="file"
              name="video"
              fullWidth
              showLabel
              accept="video/*"
              ref={fileInputRef}
            />

            <Button
              onClick={() => {
                setStatusMessage("")
                setErrorMessage("")
              }}
              className="mt-[22px]"
            >
              Upload
            </Button>
          </div>

          {progress > 0 && (
            <div>
              <Progress.Root className="w-full h-2 rounded-full bg-accents-2 overflow-clip">
                <Progress.Indicator
                  style={{
                    transform: `translateX(-${100 - progress}%)`,
                  }}
                  className="h-full bg-success"
                />
              </Progress.Root>

              <span>{progress.toFixed()} %</span>

              <Text as="p" size="xs" weight="medium" className="h-[18px]">
                {statusMessage}
              </Text>
            </div>
          )}

          <FieldError error={errorMessage} />

          {/* {errorMessage && <span className="text-error">{errorMessage}</span>} */}
        </form>
      )}

      {lesson.content_type === "article" && (
        <div className="relative flex gap-x-2">
          <div className="w-full">
            <Text as="label" size="xs" weight="medium" className="mb-1">
              Content
            </Text>
            <EditorContent
              editor={editor}
              className="prose prose-neutral prose-headings:text-foreground text-foreground prose-strong:text-foreground"
            />
          </div>

          <div className="sticky p-1 border border-accents-2 rounded-base flex flex-col mt-[22px] gap-y-1 top-20 h-max bg-background">
            <ToolbarButton
              title="Paragraph"
              onClick={() => editor?.chain().focus().setParagraph().run()}
              className={
                editor?.isActive("paragraph", { level: 1 })
                  ? "bg-accents-2 hover:bg-accents-2"
                  : ""
              }
            >
              P
            </ToolbarButton>
            <ToolbarButton
              title="Heading 1"
              onClick={() =>
                editor?.chain().focus().toggleHeading({ level: 1 }).run()
              }
              className={
                editor?.isActive("heading", { level: 1 })
                  ? "bg-accents-2 hover:bg-accents-2"
                  : ""
              }
            >
              H1
            </ToolbarButton>

            <ToolbarButton
              title="Unordered list"
              onClick={() => editor?.chain().focus().toggleBulletList().run()}
              className={
                editor?.isActive("bulletList", { level: 1 })
                  ? "bg-accents-2 hover:bg-accents-2"
                  : ""
              }
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="dig-UIIcon dig-UIIcon--standard"
                width={24}
                height={24}
              >
                <path
                  d="M20 16.5H9.5V18H20v-1.5zm0-5.5H9.5v1.5H20V11zm0-5.5H9.5V7H20V5.5zm-14.25-1A1.625 1.625 0 004 6.25 1.625 1.625 0 005.75 8 1.625 1.625 0 007.5 6.25 1.625 1.625 0 005.75 4.5zm0 5.5A1.625 1.625 0 004 11.75a1.625 1.625 0 001.75 1.75 1.626 1.626 0 001.75-1.75A1.625 1.625 0 005.75 10zm0 5.5A1.624 1.624 0 004 17.25 1.625 1.625 0 005.75 19a1.626 1.626 0 001.75-1.75 1.625 1.625 0 00-1.75-1.75z"
                  fill="currentColor"
                />
              </svg>
            </ToolbarButton>
            <ToolbarButton
              title="Ordered list"
              onClick={() => editor?.chain().focus().toggleOrderedList().run()}
              className={
                editor?.isActive("orderedList", { level: 1 })
                  ? "bg-accents-2 hover:bg-accents-2"
                  : ""
              }
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="dig-UIIcon dig-UIIcon--standard"
                width={24}
                height={24}
              >
                <path
                  d="M4.497 7.5v1H7v-1h-.723v-3h-.832a.926.926 0 01-.272.463.912.912 0 01-.508.19v.742h.6V7.5h-.768zm2.461 9.436a.771.771 0 00.404-.307.972.972 0 00.133-.533.958.958 0 00-.386-.795 1.81 1.81 0 00-1.13-.3 1.808 1.808 0 00-1.188.341 1.17 1.17 0 00-.409.95v.208h.99v-.167a.45.45 0 01.143-.346.6.6 0 01.421-.133.644.644 0 01.417.111.364.364 0 01.131.294.326.326 0 01-.117.274.634.634 0 01-.383.091h-.35v.704h.35a.874.874 0 01.404.073.285.285 0 01.135.276.378.378 0 01-.15.313.723.723 0 01-.45.118.662.662 0 01-.447-.122.471.471 0 01-.135-.367V17.5H4.335v.172a1.28 1.28 0 00.365.994c.355.256.79.375 1.227.334a1.95 1.95 0 001.223-.328 1.051 1.051 0 00.417-.866.91.91 0 00-.164-.58.887.887 0 00-.444-.29zM20 16.5H9.5V18H20v-1.5zm0-5.5H9.5v1.5H20V11zm0-5.5H9.5V7H20V5.5zM4.5 11.75A1.16 1.16 0 005.75 13 1.16 1.16 0 007 11.75a1.16 1.16 0 00-1.25-1.25 1.161 1.161 0 00-1.25 1.25z"
                  fill="currentColor"
                />
              </svg>
            </ToolbarButton>

            <ToolbarButton
              title="Code block"
              onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
              className={
                editor?.isActive("codeBlock", { level: 1 })
                  ? "bg-accents-2 hover:bg-accents-2"
                  : ""
              }
            >
              <CodeBracketIcon className="w-6 h-6" />
            </ToolbarButton>

            <ToolbarButton
              title="Bold"
              onClick={() => editor?.chain().focus().toggleBold().run()}
              className={
                editor?.isActive("bold")
                  ? "bg-accents-2 hover:bg-accents-2"
                  : ""
              }
            >
              B
            </ToolbarButton>

            <ToolbarButton
              title="Italic"
              onClick={() => editor?.chain().focus().toggleItalic().run()}
              className={
                editor?.isActive("italic", { level: 1 })
                  ? "italic bg-accents-2 hover:bg-accents-2"
                  : "italic"
              }
            >
              I
            </ToolbarButton>
            <ToolbarButton
              title="Strike through"
              onClick={() => editor?.chain().focus().toggleStrike().run()}
              className={
                editor?.isActive("strike", { level: 1 })
                  ? "bg-accents-2 hover:bg-accents-2"
                  : ""
              }
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="dig-UIIcon dig-UIIcon--standard"
                width={24}
                height={24}
              >
                <path
                  d="M18 11.5h-6c-1.368 0-3-.39-3-2.25C9 7.788 10.546 7 12 7c1.384 0 3 .524 3 2h1.5c0-2.093-1.809-3.5-4.5-3.5-2.566 0-4.5 1.612-4.5 3.75-.02.812.238 1.606.732 2.25H6V13h6c1.368 0 3 .39 3 2.25 0 1.24-1.345 2.25-3 2.25-1.384 0-3-.523-3-2H7.5c0 2.093 1.809 3.5 4.5 3.5 2.524 0 4.5-1.647 4.5-3.75a3.546 3.546 0 00-.732-2.25H18v-1.5z"
                  fill="currentColor"
                />
              </svg>
            </ToolbarButton>
          </div>
        </div>
      )}

      <Button
        onClick={() => {
          deleteLesson(lesson.id)
        }}
        intent="error"
        size="small"
        variant="ghost"
        className="mt-8"
      >
        Delete lesson
      </Button>

      {/* <pre className="text-xs whitespace-pre-wrap">
        Local content: {content ?? "null"}
      </pre>
      <pre className="text-xs whitespace-pre-wrap">
        Lesson content: {lesson.article_data ?? "null"}
      </pre>*/}
      <pre className="text-xs whitespace-pre-wrap">
        Video url: {lesson.video_url ?? "null"}
      </pre>
    </section>
  )
}

const ToolbarButton = ({
  className,
  ...props
}: HTMLAttributes<HTMLButtonElement>) => (
  <button
    {...props}
    className={clsx(
      "flex items-center font-bold justify-center w-10 h-10 hover:bg-accents-1 rounded-base transition",
      className
    )}
  />
)
