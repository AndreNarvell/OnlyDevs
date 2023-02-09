import { Meta } from "../components/Meta"
import { Text } from "../components/Text"
import { DashboardLayout } from "../components/layouts/DashboardLayout"
import { DashboardCourseGrid } from "../features/Dashboard/components/DashboardCourseGrid"
import { getUsersSavedCourses } from "../models/courses"
import { checkIfUserIsTeacher } from "../models/teacher"
import { Course } from "../types/Course"
import { protectRoute } from "../utils/protectRoute"
import { useSession } from "@supabase/auth-helpers-react"
import { GetServerSideProps, NextPage } from "next"
import { useRouter } from "next/router"
import { useEffect } from "react"
import Balancer from "react-wrap-balancer"

interface Props {
  savedCourses: Course[]
  isTeacher: boolean
}

const SavedCoursesPage: NextPage<Props> = ({ savedCourses, isTeacher }) => {
  const session = useSession()
  const router = useRouter()

  useEffect(() => {
    if (!session) {
      router.push("/auth/signin")
    }
  }, [session, router])

  return (
    <>
      <Meta title="Saved courses" />

      <DashboardLayout isTeacher={isTeacher}>
        <div className="text-center">
          <Balancer>
            <Text as="h1" size="3xl" weight="bold" align="center">
              Saved courses
            </Text>
          </Balancer>
          <Text as="p" intent="secondary" align="center" className="mb-8">
            Courses you&apos;ve saved for later
          </Text>
        </div>

        <DashboardCourseGrid action="go-to-store" courses={savedCourses} />
      </DashboardLayout>
    </>
  )
}

export default SavedCoursesPage

export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  const auth = await protectRoute(ctx)
  if (!auth.isAuthed) {
    return auth.redirect
  }
  const { session } = auth

  const [savedCourses, isTeacher] = await Promise.all([
    getUsersSavedCourses(session.user.id),
    checkIfUserIsTeacher(session.user.id),
  ])

  return {
    props: {
      initialSession: session,
      user: session.user,
      savedCourses: savedCourses ?? [],
      isTeacher,
    },
  }
}
