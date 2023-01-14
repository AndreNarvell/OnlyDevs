import { VariantProps } from "class-variance-authority"
import Link from "next/link"
import { ComponentProps, FC } from "react"
import { text } from "./Text"

interface Props extends VariantProps<typeof text>, ComponentProps<typeof Link> {
  href: string
}

export const TextLink: FC<Props> = ({
  className,
  children,
  ...props
}: ComponentProps<typeof Link>) => {
  return (
    <Link {...props} className={text({ ...props, isLink: true, className })}>
      {children}
    </Link>
  )
}
