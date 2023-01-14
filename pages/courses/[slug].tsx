import { GetServerSideProps, NextPage } from "next"
import { Layout } from "../../components/layouts/Layout"
import { TextLink } from "../../components/TextLink"
import { Text } from "../../components/Text"
import { Button } from "../../components/Button"
import Image from "next/image"
import { getCourseDetailsBySlug } from "../../models/courses"
import { Course } from "../../types/Course"
import { getProfileById } from "../../models/profile"
import { Profile } from "../../types/Profile"
import { CourseSection } from "../../features/CourseDetails/components/CourseSection"
import { formatPrice } from "../../utils/formatPrice"

interface Props {
  course: Course
  creator: Profile
}

const CourseDetailsPage: NextPage<Props> = ({ course, creator }) => {
  console.log(course)
  console.log(creator)

  return (
    <Layout background="accents-1">
      <div className="px-6 pt-8 border-b border-accents-2">
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
              By {creator.name}
            </Text>

            <Text as="p" className="hidden md:block">
              {course.short_desc} Lorem ipsum dolor sit amet, consectetur
              adipisicing elit. Eum alias unde consequuntur eveniet eius
              tempora, voluptatem dolorem nostrum accusantium ex nobis corporis
              quam quasi officia sequi accusamus, saepe molestias blanditiis.
            </Text>
          </div>
        </div>

        <Text as="p" className="block md:hidden">
          {course.short_desc} Lorem ipsum dolor sit amet, consectetur
          adipisicing elit. Eum alias unde consequuntur eveniet eius tempora,
          voluptatem dolorem nostrum accusantium ex nobis corporis quam quasi
          officia sequi accusamus, saepe molestias blanditiis.
        </Text>
        <Button intent="primary" size="large" fullWidth={true}>
          Buy now for {formatPrice(course.price)}
        </Button>
        <Button intent="secondary" size="large" fullWidth={true}>
          Add to cart
        </Button>
        <Button aria-label="Like this course" svgOnly>
          ❤️
        </Button>
      </div>
      <article>
        <CourseSection title="Details">
          <Text as="p">{course.description}</Text>
        </CourseSection>
        <CourseSection title="This course includes">
          <Text as="p">Här ska va en lista hihi</Text>
        </CourseSection>
        <CourseSection title="Requirements">
          <Text as="p">Här ska va en lista hihi</Text>
        </CourseSection>
        <CourseSection title="Instructor">
          <Text as="p"></Text>
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

  const { data: profile, error: profileError } = await getProfileById(
    course.creator
  )
  if (profileError) throw profileError

  return {
    props: {
      course,
      creator: profile,
    },
  }
}
