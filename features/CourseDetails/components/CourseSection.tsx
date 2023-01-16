import { ReactNode } from "react"
import { Text } from "../../../components/Text"

interface Props {
  title: string
  children: ReactNode
}

export const CourseSection = ({ children, title }: Props) => {
  return (
    <section className="pb-8">
      <Text weight="semibold" size="2xl" as="h2" className="mb-4">
        {title}
      </Text>

      {children}
    </section>
  )
}
