import { Input } from "../../../components/Input"
import { Meta } from "../../../components/Meta"
import { Text } from "../../../components/Text"
import { CourseCreatorLayout } from "../../../components/layouts/CourseCreatorLayout"
import { useEditorContent } from "../../../features/CourseCreator/stores/editorContent"
import {
  getCourseDetailsById,
  getModulesAndLessons,
} from "../../../models/courses"
import { GetServerSideProps, NextPage } from "next"
import { useEffect } from "react"

interface Props {
  course: NonNullable<Awaited<ReturnType<typeof getModulesAndLessons>>>
}

const CreatePage: NextPage<Props> = ({ course }) => {
  const { details, curriculum, setDetails, setCurriculum } = useEditorContent()

  useEffect(() => {
    if (!curriculum || !details) {
      setCurriculum(course.modules)
      setDetails({
        title: course.title,
        description: course.description,
        short_desc: course.short_desc,
        includes: course.includes,
        requirements: course.requirements,
        background_image: course.background_image,
        icon: course.icon,
        price: course.price,
        tags: course.tags,
      })
    }
  }, [])

  return (
    <>
      <Meta title="Course creator" />

      <CourseCreatorLayout>
        <section className="p-16 border rounded-marketing border-accents-2">
          <Input
            name="title"
            id="title"
            className="mb-2"
            showLabel
            label="Title"
          />
          <Text as="p" size="sm" className="mb-12 italic">
            Your title should be as we say in swedish “kort and koncis”!
          </Text>

          <Input
            name="description"
            id="description"
            className="mb-2"
            showLabel
            label="Description"
          />
          <Text as="p" size="sm" className="mb-12 italic">
            The description is your main selling point! This is where you lockar
            till dig students. Really think this through when writing your
            description.
          </Text>

          <Input
            name="short_desc"
            id="short_desc"
            className="mb-2"
            showLabel
            label="Short description"
          />
          <Text as="p" size="sm" className="mb-12 italic">
            Here you write a summarize of your main description. This goes on
            all the cards.
          </Text>

          <Input
            name="includes"
            id="includes"
            className="mb-2"
            showLabel
            label="This course includes"
          />
          <Text as="p" size="sm" className="mb-12 italic">
            You need to specify what this course includes. For example, 30 hours
            of video material and/or text documents.
          </Text>

          <Input
            name="requirements"
            id="requirements"
            className="mb-2"
            showLabel
            label="Requirements"
          />
          <Text as="p" size="sm" className="mb-12 italic">
            You also need to write down the requirements for taking this course.
            If the student needs a modern computer, or previous knowledge of
            JavaScript etc.
          </Text>
        </section>
      </CourseCreatorLayout>
    </>
  )
}
export default CreatePage

export const getServerSideProps: GetServerSideProps<Props> = async context => {
  const courseId = context.params?.courseId

  if (typeof courseId !== "string") {
    return {
      notFound: true,
    }
  }

  const course = await getModulesAndLessons(courseId)

  if (course) {
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
