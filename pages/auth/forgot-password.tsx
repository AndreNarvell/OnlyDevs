import { zodResolver } from "@hookform/resolvers/zod"
import { useSupabaseClient } from "@supabase/auth-helpers-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "../../components/Button"
import { Input } from "../../components/Input"
import { AuthLayout } from "../../components/layouts/AuthLayout"
import { Text } from "../../components/Text"
import { siteUrl } from "../../constants/siteUrl"
import { Database } from "../../types/supabase"
import Balancer from "react-wrap-balancer"
import { GmailButton } from "../../features/AuthPages/components/GmailButton"
import { OutlookButton } from "../../features/AuthPages/components/OutlookButton"
import { useRouter } from "next/router"
import { parseQuery } from "../../utils/parseQuery"

const signUpForm = z.object({
  email: z.string().email(),
})

type SignUpForm = z.infer<typeof signUpForm>

const SigninPage = () => {
  const [error, setError] = useState("")
  const { auth } = useSupabaseClient<Database>()
  const { asPath } = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted },
  } = useForm<SignUpForm>({
    resolver: zodResolver(signUpForm),
    defaultValues: {
      email: "",
    },
  })

  const onSubmit = async (values: SignUpForm) => {
    const { error } = await auth.resetPasswordForEmail(values.email, {
      redirectTo: `${siteUrl}/auth/update-password`,
    })
    if (error) {
      return setError(error.message)
    }
  }

  useEffect(() => {
    const query = parseQuery("/auth/update-password#", asPath)
    const errorMessage = query.get("error_description")

    if (errorMessage) {
      setError(errorMessage)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <AuthLayout>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative z-20 flex flex-col gap-4 p-6 border md:p-12 bg-accents-1 border-accents-2 rounded-marketing"
      >
        {!isSubmitted ? (
          <>
            <Text as="h1" size="2xl" weight="bold" align="center">
              Forgot password
            </Text>

            <Input
              size="large"
              label="Email"
              fullWidth
              showLabel
              error={errors.email?.message}
              id="email"
              {...register("email")}
              className="mb-6"
            />

            <Button size="large">Send recovery link</Button>

            {error && (
              <Text as="p" weight="medium" intent="error" align="center">
                Error: {error}
              </Text>
            )}
          </>
        ) : (
          <>
            <Balancer className="mx-auto">
              <Text
                as="h1"
                align="center"
                intent="primary"
                size="xl"
                className="mb-4"
              >
                If the provided email address exists in our database, a reset
                link has been sent to your email.
              </Text>
            </Balancer>

            <Text as="p" align="center" intent="secondary" className="mb-4">
              Don&lsquo;t forget to check your spam folder
            </Text>

            <div className="flex flex-col gap-2">
              <GmailButton />
              <OutlookButton />
            </div>
          </>
        )}
      </form>
    </AuthLayout>
  )
}

export default SigninPage
