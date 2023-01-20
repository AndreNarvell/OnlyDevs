import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs"
import { useSession } from "@supabase/auth-helpers-react"
import { GetServerSideProps, NextPage } from "next"
import { useRouter } from "next/router"
import { useEffect } from "react"
import { DashboardLayout } from "../components/layouts/DashboardLayout"
import { SidebarLayout } from "../components/layouts/SidebarLayout"
import { Text } from "../components/Text"
import { TextLink } from "../components/TextLink"

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

const SavedCoursesPage: NextPage = () => {
  const session = useSession()
  const router = useRouter()

  useEffect(() => {
    if (!session) {
      router.push("/auth/signin")
    }
  }, [session, router])

  return (
    <DashboardLayout>
      <SidebarLayout
        title="Profile settings"
        paragraph=""
        sidebar={
          <div className="hidden mb-72 lg:block">
            <ul>
              <Text as="label" className="mb-2 ml-4">
                Categories
              </Text>

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
        <section>section</section>
      </SidebarLayout>
    </DashboardLayout>
  )
}

export default SavedCoursesPage

export const getServerSideProps: GetServerSideProps = async ctx => {
  const supabase = createServerSupabaseClient(ctx)

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session)
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    }

  return {
    props: {
      initialSession: session,
      user: session.user,
    },
  }
}
