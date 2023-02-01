import { Button } from "../../../components/Button"
import { Meta } from "../../../components/Meta"
import { Select } from "../../../components/Select"
import { Text } from "../../../components/Text"
import { CourseCreatorLayout } from "../../../components/layouts/CourseCreatorLayout"
import { useNoLoadedCourse } from "../../../features/CourseCreator/hooks/useNoLoadedCourse"
import { useEditorContent } from "../../../features/CourseCreator/stores/editorContent"
import { useRouter } from "next/router"
import { useEffect } from "react"

const CreatePage = () => {
  const { query } = useRouter()
  useNoLoadedCourse()

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
            <pre className="text-xs whitespace-pre-wrap">
              {JSON.stringify(details, null, 2)}
            </pre>
          </section>
        </div>
      </CourseCreatorLayout>
    </>
  )
}
export default CreatePage
