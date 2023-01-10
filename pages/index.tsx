import { GoalsText } from "../features/IndexPage/GoalsText"
import { HeroText } from "../features/IndexPage/HeroText"
import { LatestCourses } from "../features/IndexPage/LatestCourses"
import { ForwardIcon, AcademicCapIcon } from "@heroicons/react/24/outline"
import { Layout } from "../components/Layout"
import { GetServerSideProps, NextPage } from "next"
import { Database } from "../types/supabase"
import { getLatestCourses } from "../models/courses"
import { Slider } from "../features/IndexPage/SliderCloud"

interface Props {
  courses: Database["public"]["Tables"]["courses"]["Row"][]
}

const Home: NextPage<Props> = ({ courses }) => {
  return (
    <Layout>
      <div className="px-6">
        <section className="grid grid-cols-1 mt-32 md:grid-cols-2 md:mb-32">
          <HeroText />
          <div className="hidden md:block">
            <Slider rows={5} tagsPerRow={10} />
          </div>
        </section>

        <section className="grid grid-cols-1 px-16 gap-x-32 md:grid-cols-2 md:mb-32">
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

      <LatestCourses courses={courses} />
    </Layout>
  )
}

export default Home

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const { data, error } = await getLatestCourses(2)
  if (error) {
    throw new Error("Could not fetch courses")
  }

  return {
    props: {
      courses: data,
    },
  }
}
