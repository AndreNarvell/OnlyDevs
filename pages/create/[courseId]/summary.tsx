import { Button } from "../../../components/Button"
import { FieldError } from "../../../components/Input"
import { Meta } from "../../../components/Meta"
import { Select } from "../../../components/Select"
import { Text } from "../../../components/Text"
import { UnavailableOnMobile } from "../../../components/UnavailableOnMobile"
import { CourseCreatorLayout } from "../../../components/layouts/CourseCreatorLayout"
import { PublishSummary } from "../../../features/CourseCreator/components/PublishSummary"
import { useConfirmLeave } from "../../../features/CourseCreator/hooks/useConfirmLeave"
import { useLoadCourse } from "../../../features/CourseCreator/hooks/useLoadCourse"
import { useEditorContent } from "../../../features/CourseCreator/stores/editorContent"
import { getCourseCreatorData } from "../../../models/courses"
import { CourseStructure } from "../../../types/Course"
import { protectRoute } from "../../../utils/protectRoute"
import { GetServerSideProps, NextPage } from "next"
import { useRouter } from "next/router"
import { useState } from "react"
import toast, { Toaster } from "react-hot-toast"

interface Props {
  course: CourseStructure
}

const SummaryPage: NextPage<Props> = ({ course }) => {
  useLoadCourse(course)
  useConfirmLeave()

  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const { query } = useRouter()

  const [curriculum, details, setDetails] = useEditorContent(state => [
    state.curriculum,
    state.details,
    state.setDetails,
  ])

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
        courseId: query.courseId,
        details,
        curriculum,
      }),
    })

    const data = (await response.json()) as
      | { success: false; error: string }
      | { success: true; data: string }

    if (!data.success) {
      return setErrorMessage(data.error)
    }

    toast("Published!", { position: "bottom-center", icon: "🎈" })
  }

  return (
    <>
      <Meta title="Course creator" />

      <Toaster />

      <UnavailableOnMobile />

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
                setDetails({
                  ...details,
                  price: parseInt(e.target.value),
                })
              }}
              options={[
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

            <Button
              onClick={publishCourse}
              size="large"
              intent="success"
              className="mb-3"
            >
              Publish
            </Button>

            {errorMessage && <FieldError error={errorMessage} />}
          </section>

          <section className="p-8 border border-accents-2 bg-background rounded-marketing">
            <PublishSummary curriculum={curriculum} details={details} />
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
