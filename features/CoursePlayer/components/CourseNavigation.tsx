import { Text } from "../../../components/Text"
import { CourseStructure } from "../../../types/Course"
import { useCourseProgress } from "../hooks/useCourseProgress"
import { NavModule } from "./NavModule"
import clsx from "clsx"
import { FC } from "react"

interface Props {
  course: CourseStructure
}

export const CourseNavigation: FC<Props> = ({ course }) => {
  const { progress } = useCourseProgress()

  const allLessonsCompleted = course.modules.every(module =>
    module.lessons.every(lesson => progress?.includes(lesson.id))
  )

  return (
    <div className="flex-grow-0 flex-shrink-0 pb-32 pr-8 mt-28 w-96">
      <Text as="h4" weight="bold" className="mb-4">
        Course content
      </Text>

      <ol className="h-full overflow-y-auto !scrollbar-thin !scrollbar-track-transparent !scrollbar-thumb-accents-3 !scrollbar-thumb-rounded-full pr-8">
        {course.modules.map(module => (
          <NavModule module={module} progress={progress} key={module.id} />
        ))}

        <svg
          width="22"
          height="29"
          className={clsx(
            "-ml-0.5",
            allLessonsCompleted ? "text-success" : "text-accents-3"
          )}
          viewBox="0 0 24 31"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3 3V4.5ZM3 28V15ZM3 15L5.77 14.307C7.8544 13.786 10.0564 14.028 11.978 14.989L12.086 15.043C13.9692 15.9842 16.1227 16.2354 18.172 15.753L21.286 15.021C20.9046 11.5318 20.9029 8.01155 21.281 4.522L18.171 5.254C16.1219 5.73589 13.9688 5.4843 12.086 4.543L11.978 4.489C10.0564 3.52795 7.8544 3.28605 5.77 3.807L3 4.5M3 15V4.5Z"
            fill="currentColor"
          />
          <path
            d="M3 3V4.5M3 4.5L5.77 3.807C7.8544 3.28605 10.0564 3.52795 11.978 4.489L12.086 4.543C13.9688 5.4843 16.1219 5.73589 18.171 5.254L21.281 4.522C20.9029 8.01155 20.9046 11.5318 21.286 15.021L18.172 15.753C16.1227 16.2354 13.9692 15.9842 12.086 15.043L11.978 14.989C10.0564 14.028 7.8544 13.786 5.77 14.307L3 15M3 4.5V15M3 28V15"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </ol>
    </div>
  )
}
