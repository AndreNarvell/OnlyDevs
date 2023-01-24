import { zodResolver } from "@hookform/resolvers/zod"
import { useSupabaseClient } from "@supabase/auth-helpers-react"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "../../components/Button"
import { Input } from "../../components/Input"
import { AuthLayout } from "../../components/layouts/AuthLayout"
import { Meta } from "../../components/Meta"
import { Text } from "../../components/Text"
import { TextLink } from "../../components/TextLink"
import { GithubButton } from "../../features/AuthPages/components/GithubButton"
import { GoogleButton } from "../../features/AuthPages/components/GoogleButton"
import { Database } from "../../types/supabase"
import { parseQuery } from "../../utils/parseQuery"

const signUpForm = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

type SignUpForm = z.infer<typeof signUpForm>

const SigninPage = () => {
  const [error, setError] = useState("")
  const router = useRouter()
  const { auth } = useSupabaseClient<Database>()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpForm>({
    resolver: zodResolver(signUpForm),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (values: SignUpForm) => {
    const { error } = await auth.signInWithPassword({
      email: values.email,
      password: values.password,
    })

    if (error) {
      return setError(error.message)
    }

    router.push("/dashboard")
  }

  useEffect(() => {
    const query = parseQuery("/auth/signin#", router.asPath)
    const errorMessage = query.get("error_description")

    if (errorMessage) {
      setError(errorMessage)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <Meta title="Sign in to OnlyDevs" />

      <AuthLayout>
        <form
          onSubmit={handleSubmit(onSubmit, (errors, event) => {})}
          className="relative z-20 flex flex-col gap-4 p-6 border md:p-12 bg-accents-1 border-accents-2 rounded-marketing"
        >
          <Text
            as="h1"
            size="2xl"
            weight="bold"
            align="center"
            className="mb-4"
          >
            Sign in
          </Text>

          <GoogleButton label="Sign in with Google" />
          <GithubButton label="Sign in with Github" />

          <div className="flex items-center">
            <div className="w-full h-px bg-accents-2" />

            <Text as="p" className="flex-shrink-0 px-4">
              Or
            </Text>

            <div className="w-full h-px bg-accents-2" />
          </div>

          <Input
            size="large"
            label="Email"
            fullWidth
            showLabel
            error={errors.email?.message}
            id="email"
            {...register("email")}
          />

          <Input
            size="large"
            label="Password"
            fullWidth
            showLabel
            type="password"
            error={errors.password?.message}
            id="password"
            {...register("password")}
            className="mb-6"
          />

          <Button size="large">Sign in</Button>

          {error && (
            <Text as="p" weight="medium" intent="error" align="center">
              Error: {error}
            </Text>
          )}

          <TextLink
            intent="secondary"
            align="center"
            href="/auth/forgot-password"
          >
            Forgot password? Click here →
          </TextLink>
        </form>
      </AuthLayout>
    </>
  )
}

export default SigninPage
