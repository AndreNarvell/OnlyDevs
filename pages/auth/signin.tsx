import { zodResolver } from "@hookform/resolvers/zod"
import { useSupabaseClient } from "@supabase/auth-helpers-react"
import { useRouter } from "next/router"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "../../components/Button"
import { Input } from "../../components/Input"
import { AuthLayout } from "../../components/layouts/AuthLayout"
import { Text } from "../../components/Text"
import { TextLink } from "../../components/TextLink"
import { GithubButton } from "../../features/AuthPages/components/GithubButton"
import { GoogleButton } from "../../features/AuthPages/components/GoogleButton"
import { Database } from "../../types/supabase"

const signUpForm = z.object({
  email: z.string().email(),
  password: z.string().min(8),
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
      password: "",
    },
  })

  const router = useRouter()

  const { auth } = useSupabaseClient<Database>()

  const onSubmit = async (values: SignUpForm) => {
    const { data, error } = await auth.signInWithPassword({
      email: values.email,
      password: values.password,
    })

    if (error) {
      throw console.log(error)
    }

    console.log("Signed in")

    router.push("/dashboard")
  }

  return (
    <AuthLayout>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative z-20 flex flex-col gap-4 p-12 border bg-accents-1 border-accents-2 rounded-marketing"
      >
        <Text as="h1" size="2xl" weight="bold" align="center" className="mb-4">
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

        <TextLink
          intent="secondary"
          align="center"
          href="/auth/forgot-password"
        >
          Forgot password? Click here →
        </TextLink>
      </form>
    </AuthLayout>
  )
}

export default SigninPage
