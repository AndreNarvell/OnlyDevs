import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs"
import { useSession } from "@supabase/auth-helpers-react"
import { GetServerSideProps } from "next"
import { Layout } from "../components/layouts/Layout"
import { Text } from "../components/Text"

const DashboardPage = () => {
  const session = useSession()
  const user = session?.user

  return (
    <Layout>
      {user && (
        <Text
          as="p"
          align="center"
          size="3xl"
          weight="semibold"
          tracking="wide"
          className="mt-6"
        >
          Hi, {user.user_metadata.name}!
        </Text>
      )}
    </Layout>
  )
}

export default DashboardPage

export const getServerSideProps: GetServerSideProps = async ctx => {
  const supabase = createServerSupabaseClient(ctx)

  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session)
    return {
      redirect: {
        destination: "/",
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
