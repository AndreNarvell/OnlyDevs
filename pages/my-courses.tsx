import { serverSideSupabase } from "../lib/supabase"
import { getSectionsAndLectures, getUsersOwnedCourses } from "../models/courses"
import { LectureData, LectureStructure } from "../types/Course"
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs"
import { GetServerSideProps, NextPage } from "next"
import Link from "next/link"
import { useRouter } from "next/router"

interface Props {
  course: LectureStructure
  lectureData: LectureData | null
}

const MyCoursesPage: NextPage<Props> = ({ course, lectureData }) => {
  const { query } = useRouter()

  return (
    <div>
      <ol>
        {course.sections.map(section => (
          <li className="ml-16" key={section.id}>
            <h2>{section.title}</h2>
            <ol>
              {section.lectures.map(lecture => (
                <li className="ml-16" key={lecture.id}>
                  <h3>{lecture.title}</h3>

                  <Link
                    href={{
                      pathname: "/my-courses",
                      query: {
                        ...query,
                        lectureId: lecture.id,
                      },
                    }}
                  >
                    x
                  </Link>
                </li>
              ))}
            </ol>
          </li>
        ))}
      </ol>

      <pre>{JSON.stringify(lectureData, null, 2)}</pre>
    </div>
  )
}
export default MyCoursesPage

export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  const supabase = createServerSupabaseClient(ctx)

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
  const lectureId = ctx.query?.lectureId

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

  if (!ownedCourses) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    }
  }

  if (!ownedCourses.some(course => course.id === courseId)) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    }
  }

  const { data: course, error } = await getSectionsAndLectures(courseId)

  if (lectureId) {
    const { data, error } = await serverSideSupabase()
      .from("lectures_data")
      .select("*")
      .eq("id", lectureId)
      .single()

    if (error) {
      console.log(error)
    }

    return {
      props: {
        course: course as unknown as LectureStructure,
        lectureData: data,
      },
    }
  }

  return {
    props: {
      course: course as unknown as LectureStructure,
      lectureData: null,
    },
  }
}
