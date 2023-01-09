import { GoalsText } from "../features/IndexPage/GoalsText"
import { HeroText } from "../features/IndexPage/HeroText"
import { FeaturedCourses } from "../features/IndexPage/FeaturedCourses"
import { supabase } from "../lib/supabase"
import { ForwardIcon, AcademicCapIcon } from "@heroicons/react/24/outline"
import { Layout } from "../components/Layout"

const asd = supabase
  .from("courses")
  .select("*")
  .then(value => console.log(value))

const Home = () => {
  return (
    <Layout>
      <div className="px-6">
        <HeroText />

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
      </div>

      <FeaturedCourses />
    </Layout>
  )
}

export default Home
