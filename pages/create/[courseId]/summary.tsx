import { Button } from "../../../components/Button"
import { Meta } from "../../../components/Meta"
import { Select } from "../../../components/Select"
import { Text } from "../../../components/Text"
import { CourseCreatorLayout } from "../../../components/layouts/CourseCreatorLayout"
import { PublishSummary } from "../../../features/CourseCreator/components/PublishSummary"
import { useLoadCourse } from "../../../features/CourseCreator/hooks/useLoadCourse"
import { useEditorContent } from "../../../features/CourseCreator/stores/editorContent"
import { getCourseCreatorData } from "../../../models/courses"
import { CourseStructure } from "../../../types/Course"
import { protectRoute } from "../../../utils/protectRoute"
import { GetServerSideProps, NextPage } from "next"
import { useRouter } from "next/router"
import { useEffect } from "react"

interface Props {
  course: CourseStructure
}

const SummaryPage: NextPage<Props> = ({ course }) => {
  const { query } = useRouter()
  useLoadCourse(course)

  const [curriculum, details, setDetails] = useEditorContent(state => [
    state.curriculum,
    state.details,
    state.setDetails,
  ])

  useEffect(() => {
    console.log(details)
  }, [details])

  const publishCourse = async () => {
    if (typeof query.courseId !== "string") {
      return
    }

    const response = await fetch("/api/publish-course", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: query.courseId,
        details,
        curriculum: [],
      }),
    })

    if (!response.ok) {
      throw new Error("Error while publishing course")
    }

    const data = await response.json()

    console.log(data)
  }

  return (
    <>
      <Meta title="Course creator" />

      <CourseCreatorLayout>
        <div className="grid grid-cols-2 gap-x-8">
          <section>
            <Text as="h1" size="xl" weight="bold" className="mb-4">
              Publish your course
            </Text>

            <Select
              label="Price"
              name="price"
              showLabel
              id="price"
              fullWidth
              className="w-48 mb-4"
              value={details.price}
              onChange={e => {
                console.log("Changed to", e.target.value)

                setDetails({
                  ...details,
                  price: parseInt(e.target.value),
                })
              }}
              options={[
                {
                  label: "Free",
                  value: 0,
                },
                {
                  label: "$19.99 (Tier 1)",
                  value: 1999,
                },
                {
                  label: "$39.99 (Tier 2)",
                  value: 3999,
                },
                {
                  label: "$69.99 (Tier 3)",
                  value: 6999,
                },
              ]}
            />

            <Button onClick={publishCourse} size="large" intent="success">
              Publish
            </Button>
          </section>

          <section className="p-8 border border-accents-2 bg-background rounded-marketing">
            <PublishSummary curriculum={curriculum} details={details} />
            {/* <pre className="text-xs break-words whitespace-pre-wrap">
              {JSON.stringify(details, null, 2)}
            </pre> */}
          </section>
        </div>
      </CourseCreatorLayout>
    </>
  )
}
export default SummaryPage

export const getServerSideProps: GetServerSideProps = async ctx => {
  const auth = await protectRoute(ctx, "/dashboard")
  if (!auth.isAuthed) {
    return auth.redirect
  }

  const courseId = ctx.params?.courseId
  if (typeof courseId !== "string") {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    }
  }

  const course = await getCourseCreatorData(courseId)
  if (!course) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      course,
    },
  }
}
