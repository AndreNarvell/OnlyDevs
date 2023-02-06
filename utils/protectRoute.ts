import { Database } from "../types/supabase"
import {
  createServerSupabaseClient,
  Session,
} from "@supabase/auth-helpers-nextjs"
import { GetServerSidePropsContext } from "next"

type SuccessReturn = {
  isAuthed: true
  session: Session
  supabase: ReturnType<typeof createServerSupabaseClient<Database>>
}

type FailureReturn = {
  isAuthed: false
  redirect: {
    redirect: {
      destination: string
      permanent: boolean
    }
  }
}

export const protectRoute = async (
  context: GetServerSidePropsContext,
  redirectUrl: string = "/auth/signin"
): Promise<SuccessReturn | FailureReturn> => {
  const supabase = createServerSupabaseClient<Database>(context)

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return {
      isAuthed: false,
      redirect: {
        redirect: {
          destination: redirectUrl,
          permanent: false,
        },
      },
    }
  }

  return {
    isAuthed: true,

    supabase,
    session,
  }
}
