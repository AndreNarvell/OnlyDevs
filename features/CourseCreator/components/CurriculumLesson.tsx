import { TextLink } from "../../../components/TextLink"
import { EditorLesson } from "../stores/editorContent"
import { ChevronUpDownIcon } from "@heroicons/react/24/outline"
import { Reorder, useDragControls } from "framer-motion"
import { useRouter } from "next/router"
import { FC } from "react"

interface Props {
  lesson: EditorLesson
}

export const CurriculumLesson: FC<Props> = ({ lesson }) => {
  const controls = useDragControls()

  const { query } = useRouter()

  const active = query.lessonId === lesson.id

  return (
    <Reorder.Item
      value={lesson}
      dragListener={false}
      dragControls={controls}
      className="mb-2 ml-8"
    >
      <div className="flex gap-x-1">
        <ChevronUpDownIcon
          onPointerDown={e => controls.start(e)}
          className="w-6 h-6 mt-0.5 shrink-0 text-secondary"
        />

        <TextLink
          shallow
          href={{
            pathname: `/create/${query.courseId}/curriculum`,
            query: {
              lessonId: lesson.id,
            },
          }}
          size="sm"
          weight={active ? "bold" : "normal"}
          className="flex text-left select-none gap-x-1 curriculum-accordion-header"
        >
          {lesson.title}
        </TextLink>
      </div>
    </Reorder.Item>
  )
}
