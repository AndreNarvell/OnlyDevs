import { Button, ButtonLink } from "../components/Button"
import { Meta } from "../components/Meta"
import { Text } from "../components/Text"
import { TextLink } from "../components/TextLink"
import { UnavailableOnMobile } from "../components/UnavailableOnMobile"
import { CourseNavigation } from "../features/CoursePlayer/components/CourseNavigation"
import { CoursePlayer } from "../features/CoursePlayer/components/CoursePlayer"
import { serverSideSupabase } from "../lib/supabase"
import { getModulesAndLessons, getUsersOwnedCourses } from "../models/courses"
import { LessonData, CourseStructure } from "../types/Course"
import { protectRoute } from "../utils/protectRoute"
import { ChevronLeftIcon } from "@heroicons/react/20/solid"
import { ChevronDoubleLeftIcon } from "@heroicons/react/24/outline"
import Mux from "@mux/mux-node"
import { GetServerSideProps, NextPage } from "next"

interface Props {
  course: CourseStructure
  lessonData: LessonData | null
  tokens?: {
    video: string
    thumbnail: string
  }
}

const MyCoursesPage: NextPage<Props> = ({ course, lessonData, tokens }) => {
  return (
    <>
      <Meta title={course.title} />

      <UnavailableOnMobile />

      <div className="hidden bg-accents-1 lg:block">
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
          style={{
            height: "calc(100vh - 5rem)",
          }}
          className="overflow-y-auto !scrollbar-thin !scrollbar-track-transparent !scrollbar-thumb-accents-3 !scrollbar-thumb-rounded-full"
        >
          <section
            style={{ height: "calc(100vh - 5rem)" }}
            className="container flex xl:max-w-screen-xl 2xl:max-w-screen-2xl"
          >
            <CourseNavigation course={course} />

            <CoursePlayer
              course={course}
              lessonData={lessonData}
              tokens={tokens}
            />
          </section>
        </main>
      </div>
    </>
  )
}
export default MyCoursesPage

export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  const auth = await protectRoute(ctx)
  if (!auth.isAuthed) {
    return auth.redirect
  }
  const { session, supabase } = auth

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
  const [ownedCourses, course] = await Promise.all([
    getUsersOwnedCourses(session.user.id),
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

    const baseOptions = {
      keyId: process.env.MUX_SIGNING_KEY, // Enter your signing key id here
      keySecret: process.env.MUX_PRIVATE_KEY, // Enter your base64 encoded private key here
      expiration: "20m", // E.g 60, "2 days", "10h", "7d", numeric value interpreted as seconds
    }

    if (lessonData?.video_url) {
      const playbackId = lessonData?.video_url

      const videoToken = Mux.JWT.signPlaybackId(playbackId, {
        ...baseOptions,
        type: "video",
      })

      const thumbnailToken = Mux.JWT.signPlaybackId(playbackId, {
        ...baseOptions,
        type: "thumbnail",
      })

      return {
        props: {
          course,
          lessonData,
          tokens: {
            video: videoToken,
            thumbnail: thumbnailToken,
          },
        },
      }
    }

    return {
      props: {
        course,
        lessonData,
      },
    }
  }

  return {
    props: {
      course,
      lessonData: null,
    },
  }
}
