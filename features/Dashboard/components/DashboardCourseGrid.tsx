import { FC } from "react"
import { CourseCard } from "../../../components/CourseCard"
import { Course } from "../../../types/Course"

interface DashboardCourseGridProps {
  courses: Course[]
}

export const DashboardCourseGrid: FC<DashboardCourseGridProps> = ({
  courses,
}) => {
  return (
    <section className="grid grid-cols-1 gap-8 mx-auto w-max place-items-center sm:grid-cols-2 lg:grid-cols-3">
      {courses.map(course => (
        <CourseCard
          backgroundImage={course.background_image}
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
    </section>
  )
}
