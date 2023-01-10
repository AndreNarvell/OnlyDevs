import { GetServerSideProps } from "next"
import { FC } from "react"
import { Layout } from "../components/Layout"
import { Input } from "../components/Input"
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid"

interface Props {
  courses: any
}
const Test: FC<Props> = ({ courses }) => {
  return (
    <Layout>
      <div className="m-8 space-y-4">
        <Input
          label="Search"
          placeholder="Search..."
          name="search"
          showLabel
          fullWidth
        />

        <Input
          label="Search"
          placeholder="Search..."
          name="search"
          error="Obligatorisk"
        />
        <Input label="Search" placeholder="Search..." name="search" />

        <Input
          label="Search"
          placeholder="Search..."
          name="search"
          icon={MagnifyingGlassIcon}
        />
      </div>
    </Layout>
  )
}

export default Test

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  return {
    props: { courses: 1 },
  }
}
