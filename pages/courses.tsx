import React, { ChangeEvent, FC, useEffect, useState } from "react"
import { Input } from "../components/Input"
import { Layout } from "../components/Layout"
import { Text } from "../components/Text"
import { CourseCard } from "../components/CourseCard"
import { GetServerSideProps } from "next"
import {
  CategoryWithCourses,
  getAllCourses,
  getAllCoursesSortedByCategory,
} from "../models/courses"
import { useRouter } from "next/router"
import { getAllCategories } from "../models/categories"
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline"
import { Course } from "../types/Course"
import { searchCourses } from "../utils/searchCourses"
import { MobileFilterMenu } from "../features/CoursesPage/components/MobileFilterMenu"
import { Category } from "../types/Category"
import Balancer from "react-wrap-balancer"
import { parseCategories } from "../features/CoursesPage/utils/filter"

interface Props {
  allCourses: Course[]
  categories: Category[]
  categorisedCourses: CategoryWithCourses[]
}

const CoursesPage: FC<Props> = ({
  allCourses,
  categories: categoriesData,
  categorisedCourses,
}) => {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [categories, setCategories] = useState<number[]>([])

  const showCategories = router.query.categories !== undefined
  const showSearch = search.trim().length > 0

  useEffect(() => {
    if (typeof router.query.search === "string") {
      setSearch(router.query.search)
    }
    if (typeof router.query.categories === "string") {
      setCategories(parseCategories(router.query.categories))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  console.log(showCategories, router.query.categories)

  const coursesInChosenCategory = allCourses.filter(course => {
    if (typeof router.query.categories !== "string") return false

    const parsedCategories = parseCategories(router.query.categories)

    console.log(
      "Course",
      course.category_id,
      parsedCategories.includes(course.category_id)
    )
    return parsedCategories.includes(course.category_id)
  })

  const searchResults = searchCourses(
    search.trimStart(),
    showCategories ? coursesInChosenCategory : allCourses // Decide what array of courses to use
  )

  const onSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value

    const { search: _search, ...query } = router.query
    setSearch(value)
    router.push(
      {
        pathname: "/courses",
        query: value === "" ? { ...query } : { ...query, search: value.trim() },
      },
      undefined,
      { shallow: true }
    )
  }

  console.log("showSearch || showCategories", showSearch || showCategories)
  console.log("searchResults", searchResults)
  console.log("coursesInChosenCategory", coursesInChosenCategory)

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
          <Balancer>Find the course for you</Balancer>
        </Text>
        <Text as="p" align="center" intent="secondary" className="mb-12">
          Unlock Your Potential with the Right Course
        </Text>

        <Input
          size="large"
          name="search"
          label="Search"
          fullWidth
          placeholder="Search courses..."
          className="mb-8"
          icon={MagnifyingGlassIcon}
          onChange={onSearchChange}
          value={search}
        />
      </div>

      <MobileFilterMenu categories={categoriesData} />

      {/* This shows when the user is searching */}
      {showSearch || showCategories ? (
        <section className="mb-16">
          <Text
            as="h2"
            intent="primary"
            tracking="wide"
            align="left"
            className="mt-8 ml-6 mb-7"
          >
            <span className="font-bold">{searchResults.length} </span>
            {searchResults.length === 1 ? "result" : "results"} for courses
            matching
            <span className="font-bold"> &quot;{search}&quot;</span>
          </Text>

          <div className="flex px-6 pb-6 overflow-x-scroll gap-x-8">
            {searchResults.length > 0
              ? searchResults.map(course => (
                  <div className="w-[18rem]" key={course.id}>
                    <CourseCard
                      icon={course.icon}
                      title={course.title}
                      shortDesc={course.short_desc}
                      href={{
                        pathname: "courses/[slug]",
                        query: {
                          ...router.query,
                          slug: course.slug,
                        },
                      }}
                    />
                  </div>
                ))
              : coursesInChosenCategory.map(course => (
                  <div className="w-[18rem]" key={course.id}>
                    <CourseCard
                      icon={course.icon}
                      title={course.title}
                      shortDesc={course.short_desc}
                      href={{
                        pathname: "courses/[slug]",
                        query: {
                          ...router.query,
                          slug: course.slug,
                        },
                      }}
                    />
                  </div>
                ))}
          </div>
        </section>
      ) : (
        <>
          {/* This shows when a user is not searching */}

          {/* Featured courses */}
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
                <div className="w-[18rem]" key={course.id}>
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

          {/* Courses sorted by category */}
          {categorisedCourses.map(category => (
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
        </>
      )}

      <div className="h-32" />
    </Layout>
  )
}

export default CoursesPage

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const [allCourses, categories, categorisedCourses] = await Promise.all([
    getAllCourses(),
    getAllCategories(),
    getAllCoursesSortedByCategory({ noEmptyCategories: true }),
  ])

  const { data: allCoursesData, error: allCoursesError } = allCourses
  if (allCoursesError) throw allCoursesError

  const { data: categoriesData, error: categoriesError } = categories
  if (categoriesError) throw categoriesError

  if (!categorisedCourses) {
    throw new Error("Error fetching categorised courses")
  }

  return {
    props: {
      allCourses: allCoursesData,
      categories: categoriesData,
      categorisedCourses,
    },
  }
}
