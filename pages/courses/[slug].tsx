import { Button, ButtonLink } from "../../components/Button"
import { Meta } from "../../components/Meta"
import { Text } from "../../components/Text"
import { TextLink } from "../../components/TextLink"
import { Layout } from "../../components/layouts/Layout"
import { CourseSection } from "../../features/CourseDetails/components/CourseSection"
import { Instructor } from "../../features/CourseDetails/components/Instructor"
import {
  getCourseDetailsBySlug,
  getUsersOwnedCourses,
  getUsersSavedCourses,
} from "../../models/courses"
import { getTeacherById } from "../../models/teacher"
import { useGlobalState } from "../../stores/globalState"
import { useShoppingCart } from "../../stores/shoppingCart"
import { Course } from "../../types/Course"
import { Teacher } from "../../types/Teacher"
import { formatPrice } from "../../utils/formatPrice"
import { goToCheckout } from "../../utils/goToCheckout"
import { saveCourse } from "../../utils/saveCourse"
import { HeartIcon } from "@heroicons/react/24/outline"
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid"
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs"
import { useSession } from "@supabase/auth-helpers-react"
import clsx from "clsx"
import { AnimatePresence, motion } from "framer-motion"
import { GetServerSideProps, NextPage } from "next"
import Image from "next/image"
import { useRouter } from "next/router"
import { useState } from "react"

interface Props {
  course: Course
  teacher: Teacher
  isSaved: boolean
  isOwned: boolean
}

const CourseDetailsPage: NextPage<Props> = ({
  course,
  teacher,
  isSaved: initialIsSaved,
  isOwned,
}) => {
  const addToCart = useShoppingCart(state => state.addToCart)
  const shoppingCartButtonRef = useGlobalState(
    state => state.shoppingCartButtonRef
  )
  const router = useRouter()
  const session = useSession()

  const [isSaved, setIsSaved] = useState(initialIsSaved)

  const handleAddToCart = () => {
    addToCart(course.id)
    shoppingCartButtonRef?.current?.click()
  }
  const handleSaveCourse = async () => {
    if (!session) {
      return router.push("/auth/signin")
    }

    const savedCourses = await saveCourse(course.id)
    setIsSaved(savedCourses.includes(course.id))
  }

  const handleBuyNow = async () => {
    await goToCheckout([course.id], router.asPath)
  }

  return (
    <>
      <Meta title={course.title} description={course.description} />

      <Layout background="accents-1">
        <div className="px-6 pt-8 pb-8 border-b border-accents-2">
          <TextLink
            href="/courses"
            intent="secondary"
            className="mb-8 max-w-max"
          >
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
                <Text as="h1" size="2xl" weight="bold" className="max-w-md">
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

            {isOwned ? (
              <div className="flex flex-col items-center p-6 border h-max border-accents-2 rounded-marketing">
                <Text as="p" weight="semibold" className="mb-4">
                  You own this course!
                </Text>
                <ButtonLink
                  href={{
                    pathname: "/my-courses",
                    query: { courseId: course.id },
                  }}
                  intent="success"
                >
                  Go to course
                </ButtonLink>
              </div>
            ) : (
              <div className="lg:w-80">
                <div className="flex mb-2 gap-x-2">
                  <Button
                    onClick={handleAddToCart}
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
                    onClick={handleSaveCourse}
                  >
                    <HeartIcon
                      className={clsx(
                        "absolute flex-shrink-0 transition w-7 h-7",
                        isSaved ? "text-error" : "text-foreground"
                      )}
                    />

                    <AnimatePresence>
                      {isSaved && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.5 }}
                          transition={{
                            type: "spring",
                            damping: 5,
                            stiffness: 100,
                            restDelta: 0.001,
                          }}
                          className="w-7 h-7"
                        >
                          <HeartIconSolid className="absolute flex-shrink-0 w-7 h-7 text-error" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Button>
                </div>

                <Button
                  onClick={handleBuyNow}
                  intent="secondary"
                  size="large"
                  fullWidth={true}
                  className="text-secondary hover:text-foreground"
                >
                  Buy now for {formatPrice(course.price)}
                </Button>
              </div>
            )}
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
    </>
  )
}

export default CourseDetailsPage

export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  const { params } = ctx

  const slug = params?.slug

  if (typeof slug !== "string") {
    return {
      notFound: true,
      redirect: "/courses",
    }
  }

  const supabase = createServerSupabaseClient(ctx)

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // If a user is logged in, try to get their saved courses
  if (session) {
    const [savedCourses, ownedCourses, { data: course, error }] =
      await Promise.all([
        getUsersSavedCourses(session.user.id),
        getUsersOwnedCourses(session.user.id),
        getCourseDetailsBySlug(slug),
      ])

    if (error || !course) throw error

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
        isSaved: savedCourses
          ? savedCourses.some(savedCourse => savedCourse.id === course.id)
          : false,
        isOwned: ownedCourses
          ? ownedCourses?.some(ownedCourses => ownedCourses.id === course.id)
          : false,
      },
    }
  }

  // If a user is not logged in, just get the course details
  const { data: course, error } = await getCourseDetailsBySlug(slug)

  if (error || !course) throw error

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
      isSaved: false,
      isOwned: false,
    },
  }
}
