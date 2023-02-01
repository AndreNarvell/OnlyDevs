import { Layout } from "./Layout"
import clsx from "clsx"
import Link from "next/link"
import { useRouter } from "next/router"
import { FC, ReactNode } from "react"

interface Props {
  children: ReactNode
  isTeacher: boolean
}

export const DashboardLayout: FC<Props> = ({ children, isTeacher }) => {
  return (
    <Layout background="accents-1">
      <DashboardNavigation isTeacher={isTeacher} />
      {children}
    </Layout>
  )
}

interface DashboardNavigationProps {
  isTeacher: boolean
}

const DashboardNavigation: FC<DashboardNavigationProps> = ({ isTeacher }) => {
  return (
    <div className="flex p-1 mx-auto mb-12 border gap-x-1 border-accents-2 rounded-marketing w-max">
      <DashboardNavButton href="/dashboard">My courses</DashboardNavButton>
      <DashboardNavButton href="/saved-courses">
        Saved courses
      </DashboardNavButton>
      {isTeacher && (
        <DashboardNavButton href="/created-courses">
          Created courses
        </DashboardNavButton>
      )}
      <DashboardNavButton href="/settings">Settings</DashboardNavButton>
    </div>
  )
}

interface DashboardNavButton {
  children: ReactNode
  href: string
}

const DashboardNavButton: FC<DashboardNavButton> = ({ children, href }) => {
  const router = useRouter()

  const active = router.pathname === href

  return (
    <Link
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
