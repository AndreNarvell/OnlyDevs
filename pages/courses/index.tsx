import React, { FC } from "react"
import { Input } from "../../components/Input"
import { Text } from "../../components/Text"
import { CourseCard } from "../../components/CourseCard"
import { GetServerSideProps } from "next"
import {
  CategoryWithCourses,
  getAllCourses,
  getAllCoursesSortedByCategory,
} from "../../models/courses"
import { useRouter } from "next/router"
import { getAllCategories } from "../../models/categories"
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline"
import { Course } from "../../types/Course"
import { searchCourses } from "../../utils/searchCourses"
import { Category } from "../../types/Category"
import { GridLayout } from "../../components/layouts/GridLayout"
import { useSearch } from "../../features/CourseCatalog/hooks/useSearch"
import { parseCategories } from "../../features/CourseCatalog/utils/filter"
import { DesktopFilterMenu } from "../../features/CourseCatalog/components/DesktopFilterMenu"
import { MobileFilterMenu } from "../../features/CourseCatalog/components/MobileFilterMenu"
import { CourseContainer } from "../../features/CourseCatalog/components/CourseContainer"

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
    <GridLayout
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
    </GridLayout>
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
