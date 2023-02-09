import { Button, ButtonLink } from "../components/Button"
import { Meta } from "../components/Meta"
import { Text } from "../components/Text"
import { TextLink } from "../components/TextLink"
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

      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 lg:hidden gap-y-4 bg-accents-1">
        <Text as="h1" align="center" className="px-8">
          This shit doesn&apos;t work on mobile, but our apps do!
        </Text>

        {/* <Button intent="secondary">Download our app</Button> */}

        <div className="flex flex-col items-center gap-y-0">
          <a href="https://play.google.com/store/apps/details?id=com.king.candycrushsaga&hl=en&gl=US&pcampaignid=pcampaignidMKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="h-16"
              alt="Get it on Google Play"
              src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
            />
          </a>

          <a
            href="https://apps.apple.com/us/app/candy-crush-saga/id553834731?itsct=apps_box_badge&itscg=30200"
            style={{
              display: "inline-block",
              overflow: "hidden",
              borderRadius: 13,
              width: 250,
              height: 83,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="h-12"
              src="https://tools.applemediaservices.com/api/badges/download-on-the-app-store/black/en-us?size=250x83&releaseDate=1352851200"
              alt="Download on the App Store"
              style={{ borderRadius: 13, width: 250 }}
            />
          </a>
        </div>

        <ButtonLink href="/dashboard" intent="secondary" variant="ghost">
          <ChevronLeftIcon className="w-6 h-6" /> Back to dashboard
        </ButtonLink>
      </div>

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
