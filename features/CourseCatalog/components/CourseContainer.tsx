import { FC, ReactNode } from "react"
import { CourseCard } from "../../../components/CourseCard"
import { Text } from "../../../components/Text"
import { Course } from "../../../types/Course"

interface Props {
  title: ReactNode
  courses: Course[]
  showImage?: boolean
}

export const CourseContainer: FC<Props> = ({ title, courses, showImage }) => {
  return (
    <>
      {typeof title === "string" ? (
        <Text
          as="h3"
          intent="primary"
          size="xl"
          weight="semibold"
          tracking="wide"
          align="left"
          className="mt-1 mb-4 ml-6"
        >
          {title}
        </Text>
      ) : (
        title
      )}

      <section className="mb-8">
        <div className="flex px-6 pb-6 overflow-x-scroll md:overflow-x-auto gap-x-6">
          {courses.map(course => (
            <CourseCard
              backgroundImage={showImage ? course.background_image : undefined}
              icon={course.icon}
              title={course.title}
              shortDesc={course.short_desc}
              href={{
                pathname: "courses/[slug]",
                query: { slug: course.slug },
              }}
              key={course.id}
            />
          ))}
        </div>
      </section>
    </>
  )
}
