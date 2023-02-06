import { CourseCard } from "../../../components/CourseCard"
import { Text } from "../../../components/Text"
import { Course } from "../../../types/Course"
import { FC, ReactNode } from "react"

interface Props {
  title: ReactNode
  courses: Course[]
  showImage?: boolean
  limit?: number
}

export const CourseContainer: FC<Props> = ({
  title,
  courses,
  showImage = false,
  limit,
}) => {
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
        <div className="flex gap-6 px-6 pb-6 overflow-x-scroll xl:flex-wrap xl:overflow-x-auto">
          {courses.slice(0, limit).map(course => (
            <CourseCard
              showImage={showImage}
              id={course.id}
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
