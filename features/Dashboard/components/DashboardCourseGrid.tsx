import { ButtonLink } from "../../../components/Button"
import { CourseCard } from "../../../components/CourseCard"
import { Course } from "../../../types/Course"
import { PlusCircleIcon, PlusIcon } from "@heroicons/react/24/solid"
import { useRouter } from "next/router"
import { FC } from "react"

interface DashboardCourseGridProps {
  courses: Course[]
  courseProgress?: Record<string, number>
}

// router.pathname = "/created-courses"

export const DashboardCourseGrid: FC<DashboardCourseGridProps> = ({
  courses,
  courseProgress,
}) => {
  const router = useRouter()
  console.log(router)

  return (
    <section className="grid grid-cols-1 gap-8 pb-16 mx-auto w-max place-items-center sm:grid-cols-2 lg:grid-cols-3">
      {courses.map((course) => (
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
        <ButtonLink
          href="/create"
          className="rounded-full"
          intent="secondary"
          size="large"
          icon={PlusIcon}
        />
      )}
    </section>
  )
}
