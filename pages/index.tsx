import { Layout } from "../components/layouts/Layout"
import { GoalsText } from "../features/IndexPage/GoalsText"
import { HeroText } from "../features/IndexPage/HeroText"
import { KeywordSlider } from "../features/IndexPage/KeywordSlider"
import { LatestCourses } from "../features/IndexPage/LatestCourses"
import { getAllCategories } from "../models/categories"
import { getLatestCourses } from "../models/courses"
import { Category } from "../types/Category"
import { Course } from "../types/Course"
import { ForwardIcon, AcademicCapIcon } from "@heroicons/react/24/outline"
import { GetServerSideProps, NextPage } from "next"

interface Props {
  courses: Course[]
  categories: Category[]
}

const Home: NextPage<Props> = ({ courses, categories }) => {
  return (
    <Layout>
      <div className="px-6">
        <section className="grid grid-cols-1 mt-24 md:grid-cols-2 md:mb-32">
          <HeroText />

          <div className="hidden md:px-4 md:block">
            <KeywordSlider rows={5} tagsPerRow={10} />
          </div>
        </section>

        <section className="grid grid-cols-1 sm:px-6 gap-x-12 md:grid-cols-2 md:mb-32">
          <GoalsText
            title="Achieve Your Career Goals with OnlyDevs"
            body="Our platform offers a wide range of online courses that can help you build the skills and knowledge you need to succeed."
            icon={ForwardIcon}
          />

          <GoalsText
            title="Advance Your Education"
            body="We provide high-quality video tutorials and curated learning resources to support your studies in addition."
            icon={AcademicCapIcon}
          />
        </section>
      </div>

      <LatestCourses courses={courses} categories={categories} />
    </Layout>
  )
}

export default Home

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const { data: coursesData, error: coursesError } = await getLatestCourses(2)
  if (coursesError) {
    throw new Error("Could not fetch courses")
  }

  const { data: categoriesData, error: categoriesError } =
    await getAllCategories()
  if (categoriesError) {
    throw categoriesError
  }

  return {
    props: {
      courses: coursesData,
      categories: categoriesData,
    },
  }
}
