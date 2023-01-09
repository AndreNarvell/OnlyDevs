import React, { FC, SVGProps } from "react"
import { Text } from "../../components/Text"

interface Props {
  icon: (
    props: SVGProps<SVGSVGElement> & {
      title?: string | undefined
      titleId?: string | undefined
    }
  ) => JSX.Element
  title: string
  body: string
}

export const GoalsText: FC<Props> = ({ title, body, ...props }) => {
  return (
    <div className="w-full flex flex-col items-center text-center py-8">
      <div className="bg-accents-3 w-10 h-10 rounded-marketing flex items-center justify-center text-accents-5 my-1">
        <props.icon className="w-6 h-6" />
      </div>

      <Text
        size="xl"
        weight="medium"
        leading="tight"
        tracking="wide"
        className="py-1 px-1"
      >
        {title}
      </Text>
      <Text
        size="base"
        tracking="wide"
        intent="secondary"
        leading="relaxed"
        weight="medium"
      >
        {body}
      </Text>
    </div>
  )
}
