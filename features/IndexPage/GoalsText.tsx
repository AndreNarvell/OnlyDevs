import React, { FC } from "react"
import { Text } from "../../components/Text"
import Balancer from "react-wrap-balancer"
import { IconComponent } from "../../types/IconComponent"

interface Props {
  icon: IconComponent
  title: string
  body: string
}

export const GoalsText: FC<Props> = ({ title, body, ...props }) => {
  return (
    <div className="flex flex-col items-center w-full max-w-sm py-8 mx-auto md:max-w-full">
      <div className="flex items-center justify-center w-10 h-10 my-1 bg-accents-3 rounded-marketing text-accents-5">
        <props.icon className="w-6 h-6" />
      </div>
      <Balancer>
        <Text
          size="xl"
          weight="medium"
          leading="tight"
          tracking="wide"
          className="py-2"
          align="center"
          as="h2"
        >
          {title}
        </Text>
      </Balancer>

      <Text
        size="base"
        tracking="wide"
        intent="secondary"
        leading="relaxed"
        weight="medium"
        align="center"
        as="p"
      >
        {body}
      </Text>
    </div>
  )
}
