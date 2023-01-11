import React, { FC } from "react"
import { Button } from "../components/Button"
import { Input } from "../components/Input"
import { Layout } from "../components/Layout"
import { Text } from "../components/Text"
import { Database } from "../types/supabase"
import { CourseCard } from "../components/CourseCard"
import { GetServerSideProps } from "next"
import { getAllCourses } from "../models/courses"
import { AdjustmentsHorizontalIcon } from "@heroicons/react/20/solid"
import { useRouter } from "next/router"
import {
  CategoryWithCourses,
  getAllCoursesInCategory,
} from "../models/categories"

interface Props {
  allCourses: Database["public"]["Tables"]["courses"]["Row"][]
  categories: CategoryWithCourses[]
}

const CoursesPage: FC<Props> = ({ allCourses, categories }) => {
  const router = useRouter()

  return (
    <Layout background="accents-1">
      <div className="px-6">
        <Text
          as="h1"
          size="3xl"
          weight="bold"
          align="center"
          className="pt-16 mb-2"
        >
          Find the course for you
        </Text>
        <Text as="p" align="center" intent="secondary" className="mb-12">
          Unlock Your Potential with the Right Course
        </Text>

        <Input
          name="search"
          label="Search"
          fullWidth
          placeholder="Search courses..."
          className="mb-8"
        />
      </div>

      <Button className="fixed right-4 bottom-16">
        <AdjustmentsHorizontalIcon className="w-5 h-5" />
        Filters
      </Button>

      <section className="mb-16">
        <Text
          as="h2"
          intent="primary"
          size="2xl"
          weight="semibold"
          tracking="wide"
          align="left"
          className="mb-4 ml-6"
        >
          Featured
        </Text>

        <div className="flex px-6 pb-6 overflow-x-scroll gap-x-8">
          {allCourses.map(course => (
            <div className="min-w-[18rem]" key={course.id}>
              <CourseCard
                backgroundImage={course.background_image}
                icon={course.icon}
                title={course.title}
                shortDesc={course.short_desc}
                href={{
                  pathname: "courses/[slug]",
                  query: { slug: course.slug },
                }}
              />
            </div>
          ))}
        </div>
      </section>

      {categories.map(category => (
        <section className="mb-16" key={category.id}>
          <Text
            as="h3"
            intent="primary"
            size="xl"
            weight="semibold"
            tracking="wide"
            align="left"
            className="mb-4 ml-6"
          >
            {category.title}
          </Text>

          <div className="flex px-6 pb-6 overflow-x-scroll gap-x-8">
            {category.courses.map(course => (
              <div className="w-[18rem]" key={course.id}>
                <CourseCard
                  icon={course.icon}
                  title={course.title}
                  shortDesc={course.short_desc}
                  href={{
                    pathname: "courses/[slug]",
                    query: { slug: course.slug },
                  }}
                />
              </div>
            ))}
          </div>
        </section>
      ))}

      <div className="h-32" />
    </Layout>
  )
}

export default CoursesPage

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const { data: allCourses, error } = await getAllCourses()
  if (error || !allCourses) {
    throw new Error("Could not fetch courses")
  }

  const categories = await getAllCoursesInCategory({ noEmptyCategories: true })
  if (!categories) {
    throw new Error("Could not fetch categories")
  }

  return {
    props: {
      allCourses,
      categories,
    },
  }
}
