import { GetServerSideProps, NextPage } from "next"
import { Layout } from "../../components/layouts/Layout"
import { TextLink } from "../../components/TextLink"
import { Text } from "../../components/Text"
import { Button, ButtonLink } from "../../components/Button"
import Image from "next/image"
import { getCourseDetailsBySlug } from "../../models/courses"
import { Course } from "../../types/Course"
import { CourseSection } from "../../features/CourseDetails/components/CourseSection"
import { formatPrice } from "../../utils/formatPrice"
import { Teacher } from "../../types/Teacher"
import { getTeacherById } from "../../models/teacher"
import { Instructor } from "../../features/CourseDetails/components/Instructor"
import { useShoppingCart } from "../../stores/shoppingCart"
import { useGlobalState } from "../../stores/globalState"

interface Props {
  course: Course
  teacher: Teacher
}

const CourseDetailsPage: NextPage<Props> = ({ course, teacher }) => {
  const addToCart = useShoppingCart(state => state.addToCart)
  const shoppingCartButtonRef = useGlobalState(
    state => state.shoppingCartButtonRef
  )

  return (
    <Layout background="accents-1">
      <div className="px-6 pt-8 pb-8 border-b border-accents-2">
        <TextLink href="/courses" intent="secondary" className="mb-8 max-w-max">
          ← Back to Course catalog
        </TextLink>

        <div className="justify-between w-full lg:flex">
          <div className="flex items-center mb-6 gap-x-5">
            <Image
              width={128}
              height={128}
              src={course.icon}
              alt={`Icon for ${course.title}`}
              className="flex-grow-0 flex-shrink-0 w-16 h-16 rounded-full md:w-32 md:h-32 aspect-square"
            />

            <div>
              <Text as="h1" size="2xl" weight="extrabold" className="max-w-md">
                {course.title}
              </Text>

              <Text as="p" intent="secondary">
                By {teacher.profiles?.name}
              </Text>

              <Text as="p" className="hidden max-w-md md:block">
                {course.short_desc}
              </Text>
            </div>
          </div>

          <Text as="p" className="block max-w-md mb-6 md:hidden">
            {course.short_desc}
          </Text>

          <div className="lg:w-80">
            <div className="flex mb-2 gap-x-2">
              <Button
                onClick={() => {
                  addToCart(course.id)
                  shoppingCartButtonRef?.current?.click()
                }}
                size="large"
                fullWidth={true}
              >
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

            <ButtonLink
              href="/checkout"
              intent="secondary"
              size="large"
              fullWidth={true}
              className="text-secondary hover:text-foreground"
            >
              Buy now for {formatPrice(course.price)}
            </ButtonLink>
          </div>
        </div>
      </div>

      <article className="grid-cols-5 px-6 pt-8 lg:grid gap-x-16">
        <div className="col-span-3">
          <CourseSection title="Details">
            <Text
              as="p"
              className="text-accents-6"
              leading="relaxed"
              tracking="wide"
            >
              {course.description}
            </Text>
          </CourseSection>

          <CourseSection title="This course includes">
            <ul className="list-disc list-inside text-accents-6">
              {course.includes?.map(include => (
                <li key={include}>{include}</li>
              ))}
            </ul>
          </CourseSection>

          <CourseSection title="Requirements">
            <ul className="list-disc list-inside text-accents-6">
              {course.requirements?.map(requirement => (
                <li key={requirement}>{requirement}</li>
              ))}
            </ul>
          </CourseSection>
        </div>

        <div className="col-span-2">
          <CourseSection title="Instructor">
            <Instructor teacher={teacher} />
          </CourseSection>
        </div>
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

  if (
    Array.isArray(teacher.profiles) ||
    teacher.profiles === null ||
    teacher.profiles === undefined
  ) {
    throw new Error("Expected teacher to have one profile")
  }

  return {
    props: {
      course,
      teacher: teacher as Teacher,
    },
  }
}
