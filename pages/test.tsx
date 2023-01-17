import { GetServerSideProps } from "next"
import { KeywordSlider } from "../features/IndexPage/KeywordSlider"
import { supabase } from "../lib/supabase"

const Test = () => {
  return (
    <>
      <KeywordSlider rows={20} duration={[50000, 500000]} />

      <div className="container py-64"></div>
    </>
  )
}

export default Test

export const getServerSideProps: GetServerSideProps = async ({}) => {
  const creator = "56820e25-0643-4d30-8ace-fa2083bab794"

  const { data, error } = await supabase
    .from("courses")
    .select("number_of_students")
    .eq("creator", creator)

  console.log(data, error)

  const numberOfStudents = data?.reduce<number>((prev, curr) => {
    const currentOrZero = curr?.number_of_students ?? 0
    return prev + currentOrZero
  }, 0)

  console.log({ numberOfStudents })

  return {
    props: {},
  }
}
