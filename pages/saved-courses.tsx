import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs"
import { useSession } from "@supabase/auth-helpers-react"
import { GetServerSideProps, NextPage } from "next"
import { useRouter } from "next/router"
import { useEffect } from "react"
import { DashboardLayout } from "../components/layouts/DashboardLayout"
import { DashboardCourseGrid } from "../features/Dashboard/components/DashboardCourseGrid"
import { getUsersSavedCourses } from "../models/courses"
import { Course } from "../types/Course"

interface Props {
  savedCourses: Course[]
}

const SavedCoursesPage: NextPage<Props> = ({ savedCourses }) => {
  const session = useSession()
  const router = useRouter()

  useEffect(() => {
    if (!session) {
      router.push("/auth/signin")
    }
  }, [session, router])

  return (
    <DashboardLayout>
      <DashboardCourseGrid courses={savedCourses} />
    </DashboardLayout>
  )
}

export default SavedCoursesPage

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

  const savedCourses = await getUsersSavedCourses(session.user.id)

  return {
    props: {
      initialSession: session,
      user: session.user,
      savedCourses: savedCourses ?? [],
    },
  }
}