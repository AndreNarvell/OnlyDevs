import { CourseCard } from "../../../components/CourseCard"
import { Course } from "../../../types/Course"
import { FC } from "react"

interface DashboardCourseGridProps {
  courses: Course[]
}

export const DashboardCourseGrid: FC<DashboardCourseGridProps> = ({
  courses,
}) => {
  return (
    <section className="grid grid-cols-1 gap-8 pb-16 mx-auto w-max place-items-center sm:grid-cols-2 lg:grid-cols-3">
      {courses.map(course => (
        <CourseCard
          id={course.id}
          title={course.title}
          shortDesc={course.short_desc}
          href={{
            pathname: "/my-courses",
            query: { courseId: course.id },
          }}
          key={course.id}
        />
      ))}
    </section>
  )
}
