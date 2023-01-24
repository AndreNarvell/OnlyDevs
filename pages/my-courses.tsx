import { Text } from "../components/Text"
import { TextLink } from "../components/TextLink"
import { CourseNavigation } from "../features/CoursePlayer/components/CourseNavigation"
import { CoursePlayer } from "../features/CoursePlayer/components/CoursePlayer"
import { serverSideSupabase } from "../lib/supabase"
import { getModulesAndLessons, getUsersOwnedCourses } from "../models/courses"
import { LessonData, CourseStructure } from "../types/Course"
import { Database } from "../types/supabase"
import { ChevronLeftIcon } from "@heroicons/react/20/solid"
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs"
import { GetServerSideProps, NextPage } from "next"
import { useRouter } from "next/router"

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
        <section className="container py-36 snap-start snap-always">
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

            <Text as="p" tracking="wide" intent="secondary">
              {course.description}
            </Text>
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
  const ownedCourses = await getUsersOwnedCourses(session.user.id)

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

  const course = await getModulesAndLessons(courseId)

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
        progress: [
          "cab7153c-a9be-43a6-be62-58cf3f9aee1b",
          "00b5d372-3a54-4af7-820b-cc2d40cdf8a0",
        ],
      },
    }
  }

  return {
    props: {
      course,
      lessonData: null,
      progress: [],
    },
  }
}
