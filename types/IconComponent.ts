import { SVGProps } from "react"

export type IconComponent = (
  props: SVGProps<SVGSVGElement> & {
    title?: string | undefined
    titleId?: string | undefined
  }
) => JSX.Element
