import { Input } from "../components/Input"
import { Meta } from "../components/Meta"
import { Text } from "../components/Text"
import { DashboardLayout } from "../components/layouts/DashboardLayout"
import { SettingsSection } from "../features/Dashboard/components/SettingsSection"
import { supabase } from "../lib/supabase"
import { checkIfUserIsTeacher } from "../models/teacher"
import { protectRoute } from "../utils/protectRoute"
import { useSession } from "@supabase/auth-helpers-react"
import { GetServerSideProps, NextPage } from "next"
import { useRouter } from "next/router"
import { useEffect } from "react"
import Balancer from "react-wrap-balancer"

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
        <div className="text-center">
          <Balancer>
            <Text as="h1" size="3xl" weight="bold" align="center">
              Profile settings
            </Text>
          </Balancer>
          <Text as="p" intent="secondary" align="center" className="mb-8">
            Courses you&apos;ve saved for later
          </Text>
        </div>

        <section className="px-6">
          <SettingsSection
            title="Your Name"
            description="Please enter your full name, or a display name you are comfortable with."
            onSubmit={async values => {
              if (session && typeof values?.name === "string") {
                const response = await fetch("/api/update-profile", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(values),
                })

                if (!response.ok) {
                  return console.error("Error updating profile")
                }
              }
            }}
          >
            {({ register }) => (
              <>
                <Input label="Name" {...register("name")} />
              </>
            )}
          </SettingsSection>

          {isTeacher && (
            <SettingsSection
              title="Your Profile Picture"
              description="The picture associated with your profile. Only visible to others if you are signed up as a teacher."
              onSubmit={async data => {
                console.log(data)
              }}
            >
              {({ register }) => (
                <Input label="Name" {...register("picture")} />
              )}
            </SettingsSection>
          )}
        </section>
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
