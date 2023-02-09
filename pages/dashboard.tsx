import { Meta } from "../components/Meta"
import { Text } from "../components/Text"
import { DashboardLayout } from "../components/layouts/DashboardLayout"
import { DashboardCourseGrid } from "../features/Dashboard/components/DashboardCourseGrid"
import { getCourseProgress } from "../features/Dashboard/utils/getCourseProgress"
import { getUsersOwnedCourses } from "../models/courses"
import { checkIfUserIsTeacher } from "../models/teacher"
import { Course } from "../types/Course"
import { protectRoute } from "../utils/protectRoute"
import { useSession } from "@supabase/auth-helpers-react"
import { GetServerSideProps, NextPage } from "next"
import { useRouter } from "next/router"
import { useEffect } from "react"
import Balancer from "react-wrap-balancer"

interface Props {
  ownedCourses: Course[]
  isTeacher: boolean
  courseProgress: Record<string, number>
}

const DashboardPage: NextPage<Props> = ({
  ownedCourses,
  isTeacher,
  courseProgress,
}) => {
  const session = useSession()
  const router = useRouter()

  useEffect(() => {
    if (!session) {
      router.push("/auth/signin")
    }
  }, [session, router])

  return (
    <>
      <Meta title="My courses" />

      <DashboardLayout isTeacher={isTeacher}>
        <div className="text-center">
          <Balancer>
            <Text as="h1" size="3xl" weight="bold" align="center">
              My courses
            </Text>
          </Balancer>
          <Text as="p" intent="secondary" align="center" className="mb-8">
            Click on a course to start learning
          </Text>
        </div>

        <DashboardCourseGrid
          action="play"
          courses={ownedCourses}
          courseProgress={courseProgress}
        />
      </DashboardLayout>
    </>
  )
}

export default DashboardPage

export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  const auth = await protectRoute(ctx)
  if (!auth.isAuthed) {
    return auth.redirect
  }
  const { session } = auth

  const [ownedCourses, isTeacher, courseProgress] = await Promise.all([
    getUsersOwnedCourses(session.user.id),
    checkIfUserIsTeacher(session.user.id),
    getCourseProgress(session.user.id),
  ])

  return {
    props: {
      initialSession: session,
      user: session.user,
      ownedCourses: ownedCourses ?? [],
      isTeacher,
      courseProgress,
    },
  }
}
