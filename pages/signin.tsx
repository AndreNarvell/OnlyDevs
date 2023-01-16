import { zodResolver } from "@hookform/resolvers/zod"
import { useSupabaseClient } from "@supabase/auth-helpers-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "../components/Button"
import { Input } from "../components/Input"
import { Layout } from "../components/layouts/Layout"
import { Logo } from "../components/Logo"
import { Database } from "../types/supabase"

const signUpForm = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  repeatPassword: z.string().min(8),
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
      name: "",
      email: "",
      password: "",
      repeatPassword: "",
    },
  })

  const onSubmit = (data: SignUpForm) => {
    console.log(data)
    console.log(errors)
  }

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center h-[80vh] gap-y-8">
        <Logo />

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col w-1/2 gap-4 p-12 border bg-accents-1 border-accents-2 rounded-marketing"
        >
          <Input
            size="large"
            label="Full name"
            fullWidth
            showLabel
            error={errors.name?.message}
            {...register("name")}
          />
          <Input
            size="large"
            label="Email"
            fullWidth
            showLabel
            error={errors.email?.message}
            {...register("email")}
          />

          <Input
            size="large"
            label="Password"
            fullWidth
            showLabel
            error={errors.password?.message}
            {...register("password")}
          />
          <Input
            size="large"
            label="Repeat password"
            fullWidth
            showLabel
            error={errors.repeatPassword?.message}
            {...register("repeatPassword")}
          />

          <Button size="large">Sign up</Button>

          <GoogleButton />
        </form>
      </div>
    </Layout>
  )
}

export default SigninPage

const GoogleButton = () => {
  const { auth } = useSupabaseClient<Database>()

  const handleClick = () => {
    auth.signInWithOAuth({ provider: "google" })
  }

  return (
    <Button onClick={handleClick} size="large" intent="secondary">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className="w-6 h-6"
      >
        <path
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          fill="#4285F4"
        />
        <path
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          fill="#34A853"
        />
        <path
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          fill="#FBBC05"
        />
        <path
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          fill="#EA4335"
        />
        <path d="M1 1h22v22H1z" fill="none" />
      </svg>
    </Button>
  )
}
