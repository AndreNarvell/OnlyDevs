import { ReactNode } from "react"
import { Text } from "../../../components/Text"

interface Props {
  title: string
  children: ReactNode
}

export const CourseSection = ({ children, title }: Props) => {
  return (
    <div>
      <Text as="h2" className="mb-4">
        {title}
      </Text>

      {children}
    </div>
  )
}
