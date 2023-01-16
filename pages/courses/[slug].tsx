import { GetServerSideProps, NextPage } from "next"
import { Layout } from "../../components/layouts/Layout"
import { TextLink } from "../../components/TextLink"
import { Text } from "../../components/Text"
import { Button } from "../../components/Button"
import Image from "next/image"
import { getCourseDetailsBySlug } from "../../models/courses"
import { Course } from "../../types/Course"
import { CourseSection } from "../../features/CourseDetails/components/CourseSection"
import { formatPrice } from "../../utils/formatPrice"
import { Teacher } from "../../types/Teacher"
import { getTeacherById } from "../../models/teacher"
import { Instructor } from "../../features/CourseDetails/components/Instructor"

interface Props {
  course: Course
  teacher: Teacher
}

const CourseDetailsPage: NextPage<Props> = ({ course, teacher }) => {
  return (
    <Layout background="accents-1">
      <div className="px-6 pt-8 pb-8 border-b border-accents-2">
        <TextLink href="/courses" intent="secondary" className="mb-8 max-w-max">
          ← Back to Course catalog
        </TextLink>

        <div className="flex items-center mb-4 gap-x-5">
          <Image
            width={70}
            height={70}
            src={course.icon}
            alt={`Icon for ${course.title}`}
            className="flex-grow-0 flex-shrink-0 w-16 h-16 rounded-full aspect-square"
          />

          <div>
            <Text as="h1" size="2xl">
              {course.title}
            </Text>

            <Text as="p" intent="secondary">
              By {teacher.profiles?.name}
            </Text>

            <Text as="p" className="hidden mb-6 md:block">
              {course.short_desc}
            </Text>
          </div>
        </div>

        <Text as="p" className="block mb-6 md:hidden">
          {course.short_desc}
        </Text>

        <div className="flex mb-2 gap-x-2">
          <Button size="large" fullWidth={true}>
            Add to cart
          </Button>

          <Button
            intent="secondary"
            size="large"
            aria-label="Like this course"
            svgOnly
          >
            ❤️
          </Button>
        </div>

        <Button
          intent="secondary"
          size="large"
          fullWidth={true}
          className="text-secondary hover:text-foreground"
        >
          Buy now for {formatPrice(course.price)}
        </Button>
      </div>

      <article className="px-6 pt-8">
        <CourseSection title="Details">
          <Text as="p" className="text-accents-6" tracking="wide">
            {course.description}
          </Text>
        </CourseSection>

        <CourseSection title="This course includes">
          {/* <Text as="p">{course.includes}</Text> */}

          <ul className="list-disc list-inside text-accents-6">
            {course.includes?.map(include => (
              <li key={include}>{include}</li>
            ))}
          </ul>
        </CourseSection>

        <CourseSection title="Requirements">
          {/* <Text as="p">{course.requirements}</Text> */}

          <ul className="list-disc list-inside text-accents-6">
            {course.requirements?.map(requirement => (
              <li key={requirement}>{requirement}</li>
            ))}
          </ul>
        </CourseSection>

        <CourseSection title="Instructor">
          <Instructor teacher={teacher} />
        </CourseSection>
      </article>
    </Layout>
  )
}

export default CourseDetailsPage

export const getServerSideProps: GetServerSideProps<Props> = async ({
  params,
}) => {
  const slug = params?.slug

  if (typeof slug !== "string") {
    return {
      notFound: true,
      redirect: "/courses",
    }
  }

  const { data: course, error } = await getCourseDetailsBySlug(slug)
  if (error) throw error

  const teacher = await getTeacherById(course.creator)
  if (!teacher) throw new Error("Teacher not found")

  if (Array.isArray(teacher.profiles) || teacher.profiles === null) {
    throw new Error("Expected teacher to have one profile")
  }

  return {
    props: {
      course,
      teacher: teacher as Teacher,
    },
  }
}
