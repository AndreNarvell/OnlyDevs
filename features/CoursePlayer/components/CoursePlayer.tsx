import { Text } from "../../../components/Text"
import { CourseStructure, LessonData } from "../../../types/Course"
import { FC } from "react"

interface Props {
  lesson?: CourseStructure["modules"][0]["lessons"][0]
  lessonData: LessonData | null
}

export const CoursePlayer: FC<Props> = ({ lesson, lessonData }) => {
  return (
    <section>
      <Text
        as="h3"
        size="3xl"
        weight="bold"
        tracking="wide"
        className="mt-24 mb-8"
      >
        {lesson?.title}
      </Text>

      <div className="w-full p-12 m-4 border border-accents-2 rounded-marketing">
        <pre className="text-xs">{JSON.stringify(lessonData, null, 2)}</pre>
      </div>
    </section>
  )
}
