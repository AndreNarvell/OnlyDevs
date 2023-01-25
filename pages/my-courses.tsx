import { Text } from "../components/Text"
import { TextLink } from "../components/TextLink"
import { CourseNavigation } from "../features/CoursePlayer/components/CourseNavigation"
import { CoursePlayer } from "../features/CoursePlayer/components/CoursePlayer"
import { serverSideSupabase } from "../lib/supabase"
import {
  getModulesAndLessons,
  getUsersOwnedCourses,
  getUsersProgress,
} from "../models/courses"
import { LessonData, CourseStructure } from "../types/Course"
import { Database } from "../types/supabase"
import { ChevronLeftIcon } from "@heroicons/react/20/solid"
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs"
import { GetServerSideProps, NextPage } from "next"
import { useRouter } from "next/router"
import gradient from "random-gradient"

interface Props {
  course: CourseStructure
  lessonData: LessonData | null
  progress: string[]
}

const MyCoursesPage: NextPage<Props> = ({
  course,
  lessonData,
  progress = [],
}) => {
  const { query } = useRouter()

  // Find the lesson based on the URL
  const lesson = course.modules
    .flatMap(module => module.lessons)
    .find(lesson => lesson.id === query.lessonId)

  return (
    <div className="bg-accents-1">
      <header className="flex items-center justify-between h-20 px-8 backdrop-blur-md bg-accents-1/50">
        <TextLink
          href="/dashboard"
          size="sm"
          weight="bold"
          intent="secondary"
          className="flex items-center gap-x-1 w-44"
        >
          <ChevronLeftIcon className="w-5 h-5" /> Go back to dashboard
        </TextLink>

        <Text as="h1" weight="bold" size="lg">
          {course.title}
        </Text>

        <div className="w-44" />
      </header>

      <main
        style={{ height: "calc(100vh - 5rem)" }}
        className="overflow-y-auto snap-y snap-mandatory"
      >
        <section className="relative snap-start snap-always">
          <div
            className="absolute inset-0 w-full pointer-events-none opacity-20"
            style={{ background: gradient(course.title) }}
          />

          <div className="container relative py-36">
            <div className="max-w-lg">
              <Text
                as="h2"
                size="3xl"
                weight="bold"
                tracking="wide"
                className="mb-4"
              >
                {course.title}
              </Text>

              <Text as="p" tracking="wide" className="opacity-70">
                {course.description}
              </Text>
            </div>
          </div>
        </section>

        <hr className="border-accents-2 snap-align-none" />

        <section
          style={{ height: "calc(100vh - 5rem)" }}
          className="container flex snap-start snap-always xl:max-w-screen-xl 2xl:max-w-screen-2xl"
        >
          <CourseNavigation course={course} progress={progress} />

          <CoursePlayer lesson={lesson} lessonData={lessonData} />
        </section>
      </main>
    </div>
  )
}
export default MyCoursesPage

export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  const supabase = createServerSupabaseClient<Database>(ctx)

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    }
  }

  const courseId = ctx.query?.courseId
  const lessonId = ctx.query?.lessonId

  if (typeof courseId !== "string") {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    }
  }

  // Check if the user owns the course
  const [ownedCourses, courseProgress, course] = await Promise.all([
    getUsersOwnedCourses(session.user.id),
    getUsersProgress(session.user.id, courseId),
    getModulesAndLessons(courseId),
  ])

  // If owned courses can't be fetched, redirect to dashboard
  if (!ownedCourses) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    }
  }

  // If the user doesn't own the course, redirect to store page
  if (!ownedCourses.some(course => course.id === courseId)) {
    const { data, error } = await supabase
      .from("courses")
      .select("slug")
      .eq("id", courseId)
      .single()

    return {
      redirect: {
        destination: data ? `/courses/${data.slug}` : "/dashboard",
        permanent: false,
      },
    }
  }

  if (!course) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    }
  }

  if (lessonId) {
    const { data: lessonData, error: lessonDataError } =
      await serverSideSupabase()
        .from("lessons_data")
        .select("*")
        .eq("id", lessonId)
        .single()

    if (lessonDataError) {
      if (lessonDataError?.code !== "PGRST116") {
        console.log("Error fetching lessons data", lessonDataError)
      }
    }

    return {
      props: {
        course,
        lessonData,
        progress: courseProgress ?? [],
      },
    }
  }

  return {
    props: {
      course,
      lessonData: null,
      progress: courseProgress ?? [],
    },
  }
}
