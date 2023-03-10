import { Meta } from "../components/Meta"
import { Text } from "../components/Text"
import { DashboardLayout } from "../components/layouts/DashboardLayout"
import { DashboardCourseGrid } from "../features/Dashboard/components/DashboardCourseGrid"
import { getUsersCreatedCourses } from "../models/courses"
import { checkIfUserIsTeacher } from "../models/teacher"
import { Course } from "../types/Course"
import { protectRoute } from "../utils/protectRoute"
import { PlusCircleIcon } from "@heroicons/react/24/solid"
import { useSession } from "@supabase/auth-helpers-react"
import { GetServerSideProps, NextPage } from "next"
import { useRouter } from "next/router"
import { useEffect } from "react"
import Balancer from "react-wrap-balancer"

interface Props {
  createdCourses: Course[]
  isTeacher: boolean
}

const CreatedCoursesPage: NextPage<Props> = ({ createdCourses, isTeacher }) => {
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
              Created courses
            </Text>
          </Balancer>
          <Text as="p" intent="secondary" align="center" className="mb-8">
            Click on a course to edit it
          </Text>
        </div>

        <DashboardCourseGrid action="edit" courses={createdCourses} />
      </DashboardLayout>
    </>
  )
}

export default CreatedCoursesPage

export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  const auth = await protectRoute(ctx)
  if (!auth.isAuthed) {
    return auth.redirect
  }
  const { session } = auth

  const [createdCourses, isTeacher] = await Promise.all([
    getUsersCreatedCourses(session.user.id),
    checkIfUserIsTeacher(session.user.id),
  ])
  return {
    props: {
      initialSession: session,
      user: session.user,
      createdCourses: createdCourses ?? [],
      isTeacher,
    },
  }
}
