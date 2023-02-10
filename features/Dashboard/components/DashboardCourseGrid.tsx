import { Button, ButtonLink } from "../../../components/Button"
import { CourseCard } from "../../../components/CourseCard"
import { Course } from "../../../types/Course"
import { PlusIcon } from "@heroicons/react/24/solid"
import { useRouter } from "next/router"
import { FC } from "react"

interface DashboardCourseGridProps {
  courses: Course[]
  courseProgress?: Record<string, number>
  action: "play" | "go-to-store" | "edit"
}

export const DashboardCourseGrid: FC<DashboardCourseGridProps> = ({
  courses,
  courseProgress,
  action,
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
          href={
            action === "play"
              ? `/my-courses?courseId=${course.id}`
              : action === "go-to-store"
              ? `/courses/${course.slug}`
              : action === "edit"
              ? `/create/${course.id}/details`
              : `/courses/${course.id}`
          }
          key={course.id}
          progress={courseProgress?.[course.id]}
        />
      ))}

      {router.pathname === "/created-courses" && (
        <button
          onClick={() => {
            createCourse()
          }}
          title="Create a new course"
          className="group h-[21.375rem] max-w-[18rem] min-w-[18rem] flex items-center justify-center border border-accents-2 rounded-marketing hover:bg-background/50 transition group hover:border-accents-5"
        >
          <div className="flex items-center justify-center w-16 h-16 transition border rounded-full border-accents-2 group-hover:text-background group-hover:bg-foreground group-hover:border-foreground">
            <PlusIcon className="w-6 h-6" />
          </div>
        </button>
      )}
    </section>
  )
}
