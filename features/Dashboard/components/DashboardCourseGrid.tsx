import { Button, ButtonLink } from "../../../components/Button"
import { CourseCard } from "../../../components/CourseCard"
import { Course } from "../../../types/Course"
import { PlusCircleIcon, PlusIcon } from "@heroicons/react/24/solid"
import { useRouter } from "next/router"
import { FC } from "react"

interface DashboardCourseGridProps {
  courses: Course[]
  courseProgress?: Record<string, number>
}

export const DashboardCourseGrid: FC<DashboardCourseGridProps> = ({
  courses,
  courseProgress,
}) => {
  const router = useRouter()

  const createCourse = async () => {
    const response = await fetch("/api/create-course")
    const courseId = (await response.json()) as string

    if (!response.ok) alert("Could not create course")

    router.push(`/create/${courseId}/details`)
  }

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
          progress={courseProgress?.[course.id]}
        />
      ))}

      {router.pathname === "/created-courses" && (
        <Button
          onClick={() => {
            createCourse()
          }}
          className="rounded-full"
          intent="secondary"
          size="large"
          icon={PlusIcon}
        />
      )}
    </section>
  )
}
