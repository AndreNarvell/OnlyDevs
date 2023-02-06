import { Input } from "../components/Input"
import { Meta } from "../components/Meta"
import { Text } from "../components/Text"
import { TextLink } from "../components/TextLink"
import { DashboardLayout } from "../components/layouts/DashboardLayout"
import { SidebarLayout } from "../components/layouts/SidebarLayout"
import { SettingsSection } from "../features/Dashboard/components/SettingsSection"
import { checkIfUserIsTeacher } from "../models/teacher"
import { protectRoute } from "../utils/protectRoute"
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs"
import { useSession } from "@supabase/auth-helpers-react"
import { GetServerSideProps, NextPage } from "next"
import { useRouter } from "next/router"
import { useEffect } from "react"

const categories = [
  {
    title: "Profile",
    href: "/settings",
  },
  {
    title: "Something else",
    href: "/something-else",
  },
]

interface Props {
  isTeacher: boolean
}

const SavedCoursesPage: NextPage<Props> = ({ isTeacher }) => {
  const session = useSession()
  const router = useRouter()

  useEffect(() => {
    if (!session) {
      router.push("/auth/signin")
    }
  }, [session, router])

  return (
    <>
      <Meta title="Profile settings" />

      <DashboardLayout isTeacher={isTeacher}>
        <SidebarLayout
          title="Profile settings"
          paragraph="Coming soon !"
          sidebar={
            <div className="hidden mb-72 lg:block">
              <ul>
                {categories.map(category => (
                  <li key={category.title}>
                    <TextLink
                      href={category.href}
                      className="block px-4 py-3 transition cursor-pointer hover:bg-accents-4/10 hover:transition-none border-foreground/20"
                    >
                      {category.title}
                    </TextLink>
                  </li>
                ))}
              </ul>
            </div>
          }
        >
          <section className="px-6">
            <SettingsSection
              title="Your Name"
              description="Please enter your full name, or a display name you are comfortable with."
            >
              <Input label="Name" name="Hej" />
            </SettingsSection>

            <SettingsSection
              title="Your Profile Picture"
              description="The picture associated with your profile. Only visible to others if you are signed up as a teacher."
            >
              <Input label="Name" name="Hej" />
            </SettingsSection>
          </section>
        </SidebarLayout>
      </DashboardLayout>
    </>
  )
}

export default SavedCoursesPage

export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  const auth = await protectRoute(ctx)
  if (!auth.isAuthed) {
    return auth.redirect
  }
  const { session } = auth

  const isTeacher = await checkIfUserIsTeacher(session.user.id)

  return {
    props: {
      initialSession: session,
      user: session.user,
      isTeacher,
    },
  }
}
