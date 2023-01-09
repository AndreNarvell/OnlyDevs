import clsx from "clsx"
import Link from "next/link"
import { ComponentProps } from "react"

export const TextLink = ({
  className,
  children,
  ...props
}: ComponentProps<typeof Link>) => {
  return (
    <Link
      {...props}
      className={clsx("text-success hover:underline", className)}
    >
      {children}
    </Link>
  )
}
