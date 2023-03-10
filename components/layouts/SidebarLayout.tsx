import { FC, ReactNode } from "react"
import { Text } from "../Text"
import Balancer from "react-wrap-balancer"

interface Props {
  title: string
  paragraph: string
  sidebar: ReactNode
  children: ReactNode
}

export const SidebarLayout: FC<Props> = ({
  title,
  paragraph,
  sidebar,
  children,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-5">
      <div className="flex flex-col items-center w-full px-6 lg:col-span-5">
        <Balancer>
          <Text
            as="h1"
            size="3xl"
            weight="bold"
            align="center"
            className="mx-auto mb-2"
          >
            {title}
          </Text>
        </Balancer>

        <Text as="p" align="center" intent="secondary" className="mb-12">
          {paragraph}
        </Text>
      </div>

      <aside className="col-span-1">{sidebar}</aside>
      <main className="col-span-1 lg:col-span-4">{children}</main>
    </div>
  )
}
