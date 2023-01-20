import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs"
import { useSession } from "@supabase/auth-helpers-react"
import { GetServerSideProps, NextPage } from "next"
import { useRouter } from "next/router"
import { useEffect } from "react"
import { DashboardLayout } from "../components/layouts/DashboardLayout"
import { Text } from "../components/Text"
import { DashboardCourseGrid } from "../features/Dashboard/components/DashboardCourseGrid"
import { getUsersOwnedCourses } from "../models/courses"
import { Course } from "../types/Course"
import Balancer from "react-wrap-balancer"

interface Props {
  ownedCourses: Course[]
}

const DashboardPage: NextPage<Props> = ({ ownedCourses }) => {
  const session = useSession()
  const router = useRouter()

  useEffect(() => {
    if (!session) {
      router.push("/auth/signin")
    }
  }, [session, router])

  return (
    <DashboardLayout>
      <div className="text-center">
        <Balancer>
          <Text as="h1" size="3xl" weight="bold" align="center">
            My courses
          </Text>
        </Balancer>
      </div>

      <DashboardCourseGrid courses={ownedCourses} />
    </DashboardLayout>
  )
}

export default DashboardPage

export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  const supabase = createServerSupabaseClient(ctx)

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session)
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    }

  const ownedCourses = await getUsersOwnedCourses(session.user.id)

  return {
    props: {
      initialSession: session,
      user: session.user,
      ownedCourses: ownedCourses ?? [],
    },
  }
}
