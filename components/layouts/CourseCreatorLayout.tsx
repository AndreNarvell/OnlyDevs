import { Layout } from "./Layout"
import clsx from "clsx"
import Link from "next/link"
import { useRouter } from "next/router"
import { FC, ReactNode } from "react"

interface Props {
  children: ReactNode
  wide?: boolean
}

export const CourseCreatorLayout: FC<Props> = ({ children, wide = false }) => {
  return (
    <Layout wide={wide} background="accents-1">
      <CourseCreatorNavigation />
      {children}

      <div className="h-16" />
    </Layout>
  )
}

const CourseCreatorNavigation = () => {
  const { query } = useRouter()

  return (
    <div className="hidden p-1 mx-auto mb-12 border lg:flex gap-x-1 border-accents-2 rounded-marketing w-max">
      <CourseCreatorNavButton href={`/create/${query.courseId}/details`}>
        Details
      </CourseCreatorNavButton>
      <CourseCreatorNavButton href={`/create/${query.courseId}/curriculum`}>
        Curriculum
      </CourseCreatorNavButton>
      <CourseCreatorNavButton href={`/create/${query.courseId}/summary`}>
        Summary
      </CourseCreatorNavButton>
    </div>
  )
}

interface DashboardNavButton {
  children: ReactNode
  href: string
}

const CourseCreatorNavButton: FC<DashboardNavButton> = ({ children, href }) => {
  const router = useRouter()
  const active = router.asPath.includes(href)

  return (
    <Link
      shallow
      href={href}
      className={clsx(
        "h-10 sm:px-6 px-2 text-foreground rounded-base flex items-center justify-center select-none transition font-medium tracking-wide text-sm",
        active ? "bg-success" : "hover:bg-accents-2 active:bg-accents-3"
      )}
    >
      {children}
    </Link>
  )
}
