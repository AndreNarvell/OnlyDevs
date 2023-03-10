import { Input } from "../../components/Input"
import { Meta } from "../../components/Meta"
import { Text } from "../../components/Text"
import { Layout } from "../../components/layouts/Layout"
import { SidebarLayout } from "../../components/layouts/SidebarLayout"
import { CourseContainer } from "../../features/CourseCatalog/components/CourseContainer"
import { DesktopFilterMenu } from "../../features/CourseCatalog/components/DesktopFilterMenu"
import { MobileFilterMenu } from "../../features/CourseCatalog/components/MobileFilterMenu"
import { useSearch } from "../../features/CourseCatalog/hooks/useSearch"
import { parseCategories } from "../../features/CourseCatalog/utils/filter"
import { searchCourses } from "../../features/CourseCatalog/utils/searchCourses"
import { getAllCategories } from "../../models/categories"
import {
  getAllCourses,
  getAllCoursesSortedByCategory,
} from "../../models/courses"
import { Category, CategoryWithCourses } from "../../types/Category"
import { Course } from "../../types/Course"
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline"
import { GetServerSideProps } from "next"
import { useRouter } from "next/router"
import React, { FC } from "react"

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
  const { search, handleSearchChange } = useSearch()

  const showCategories = router.query.categories !== undefined
  const showSearch = search.trim().length > 0

  const coursesInChosenCategories = allCourses.filter(course => {
    if (typeof router.query.categories !== "string") return false

    const parsedCategories = parseCategories(router.query.categories)

    return parsedCategories.includes(course.category_id)
  })

  const searchResults = searchCourses(
    search.trimStart(),
    showCategories ? coursesInChosenCategories : allCourses
  )

  const numberOfSearchResults = showSearch
    ? searchResults.length
    : coursesInChosenCategories.length

  const searchResultsTemplate =
    numberOfSearchResults === 1 ? "result" : "results"

  const areCategoriesSelected =
    showCategories && coursesInChosenCategories.length > 0
  const areCategoriesSelectedTemplate = `in chosen ${
    coursesInChosenCategories.length === 1 ? "category" : "categories"
  }`

  const allTemplatesCombined = `
    ${numberOfSearchResults} ${searchResultsTemplate}
    ${areCategoriesSelected ? areCategoriesSelectedTemplate : ""}
    ${showSearch ? `matching "${search}"` : ""}
  `

  // 0 results matching ""
  // 0 results in chosen category
  // 0 results in chosen categories
  // 0 results in chosen category matching ""
  // 0 results in chosen categories matching ""

  return (
    <>
      <Meta
        title="Courses"
        description="Unlock Your Potential with the Right Course"
      />

      <Layout wide background="accents-1">
        <SidebarLayout
          title="Find the course for you"
          paragraph="Unlock Your Potential with the Right Course"
          sidebar={
            <div className="px-6">
              <Input
                size="large"
                name="search"
                label="Search"
                fullWidth
                placeholder="Search"
                icon={MagnifyingGlassIcon}
                onChange={handleSearchChange}
                value={search}
                className="mb-6"
              />

              <DesktopFilterMenu categories={categoriesData} />
              <MobileFilterMenu categories={categoriesData} />
            </div>
          }
        >
          {/* This shows when the user is searching */}
          {showSearch || showCategories ? (
            <CourseContainer
              title={
                <Text
                  as="h2"
                  intent="primary"
                  tracking="wide"
                  align="left"
                  className="mt-2 mb-5 ml-6"
                >
                  {allTemplatesCombined}
                </Text>
              }
              courses={
                search.length > 0
                  ? searchResults.map(result => ({
                      ...result,
                      tags: result.tags.split(" "),
                    }))
                  : coursesInChosenCategories
              }
            />
          ) : (
            <>
              {/* This shows when a user is not searching */}

              {/* Featured courses */}
              <CourseContainer
                title="Featured"
                courses={allCourses}
                showImage
                limit={3}
              />

              {/* Courses sorted by category */}
              {categorisedCourses.map(category => (
                <CourseContainer
                  title={category.title}
                  key={category.id}
                  courses={category.courses}
                />
              ))}
            </>
          )}

          <div className="h-32" />
        </SidebarLayout>
      </Layout>
    </>
  )
}

export default CoursesPage

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const [allCourses, categories, categorisedCourses] = await Promise.all([
    getAllCourses(),
    getAllCategories(),
    getAllCoursesSortedByCategory({ noEmptyCategories: true }),
  ])

  if (!allCourses.data || !categories.data || !categorisedCourses) {
    throw new Error("Error fetching categorised courses")
  }

  return {
    props: {
      allCourses: allCourses.data,
      categories: categories.data,
      categorisedCourses,
    },
  }
}
