import { zodResolver } from "@hookform/resolvers/zod"
import { useSupabaseClient } from "@supabase/auth-helpers-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "../../components/Button"
import { Input } from "../../components/Input"
import { AuthLayout } from "../../components/layouts/AuthLayout"
import { Text } from "../../components/Text"
import { siteUrl } from "../../constants/siteUrl"
import { Database } from "../../types/supabase"

const signUpForm = z.object({
  email: z.string().email(),
})

type SignUpForm = z.infer<typeof signUpForm>

const SigninPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpForm>({
    resolver: zodResolver(signUpForm),
    defaultValues: {
      email: "",
    },
  })

  const { auth } = useSupabaseClient<Database>()

  const onSubmit = async (values: SignUpForm) => {
    const { data, error } = await auth.resetPasswordForEmail(values.email, {
      redirectTo: `${siteUrl}/auth/update-password`,
    })

    console.log(data, error)

    setShowText(true)
  }

  const [showText, setShowText] = useState(false)

  return (
    <AuthLayout>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative z-20 flex flex-col gap-4 p-12 border bg-accents-1 border-accents-2 rounded-marketing"
      >
        {!showText && (
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
          </>
        )}

        {showText && (
          <>
            <Text
              as="h1"
              align="center"
              intent="primary"
              size="xl"
              className="mb-4"
            >
              A reset link has been sent to your email!
            </Text>
            <Text as="p" align="center" intent="secondary" className="mb-4">
              Don&lsquo;t forget to check your spam folder
            </Text>
          </>
        )}
      </form>
    </AuthLayout>
  )
}

export default SigninPage
