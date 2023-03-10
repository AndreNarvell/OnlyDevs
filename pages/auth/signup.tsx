import { Button } from "../../components/Button"
import { Checkbox } from "../../components/Checkbox"
import { Input } from "../../components/Input"
import { Meta } from "../../components/Meta"
import { Text } from "../../components/Text"
import { AuthLayout } from "../../components/layouts/AuthLayout"
import { GithubButton } from "../../features/AuthPages/components/GithubButton"
import { GmailButton } from "../../features/AuthPages/components/GmailButton"
import { GoogleButton } from "../../features/AuthPages/components/GoogleButton"
import { OutlookButton } from "../../features/AuthPages/components/OutlookButton"
import { Database } from "../../types/supabase"
import { parseQuery } from "../../utils/parseQuery"
import { zodResolver } from "@hookform/resolvers/zod"
import { useSupabaseClient } from "@supabase/auth-helpers-react"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import Balancer from "react-wrap-balancer"
import { z } from "zod"

const signUpForm = z
  .object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string(),
    acceptTerms: z.boolean().refine(value => value, {
      message: "You must accept the terms and conditions",
    }),
  })
  .refine(
    values => {
      if (!values.password || !values.confirmPassword) {
        return false
      }
      if (values.password !== values.confirmPassword) {
        return false
      }
      return true
    },
    {
      message: "Passwords don't match",
      path: ["confirmPassword"],
    }
  )

type SignUpForm = z.infer<typeof signUpForm>

const SignupPage = () => {
  const { asPath } = useRouter()
  const { auth } = useSupabaseClient<Database>()
  const [error, setError] = useState("")

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
  } = useForm<SignUpForm>({
    resolver: zodResolver(signUpForm),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
  })

  const onSubmit = async (values: SignUpForm) => {
    const { error } = await auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        data: {
          name: values.name,
        },
      },
    })

    if (error) {
      return setError(error.message)
    }
  }

  useEffect(() => {
    const query = parseQuery("/auth/signup#", asPath)
    const errorMessage = query.get("error_description")

    if (errorMessage) {
      setError(errorMessage)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const showNextStep = isSubmitSuccessful && !error

  return (
    <>
      <Meta title="Sign up" />

      <AuthLayout>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="relative z-20 flex flex-col gap-4 p-6 border md:p-12 bg-accents-1 border-accents-2 rounded-marketing"
        >
          {!showNextStep ? (
            <>
              <Text
                as="h1"
                size="2xl"
                weight="bold"
                align="center"
                className="mb-4"
              >
                Sign up
              </Text>

              <GoogleButton label="Sign up with Google" />
              <GithubButton label="Sign up with Github" />

              <div className="flex items-center">
                <div className="w-full h-px bg-accents-2" />

                <Text as="p" className="flex-shrink-0 px-4">
                  Or
                </Text>

                <div className="w-full h-px bg-accents-2" />
              </div>

              <Input
                size="large"
                label="Full name"
                fullWidth
                showLabel
                error={errors.name?.message}
                id="name"
                {...register("name")}
              />

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
              />
              <Input
                size="large"
                label="Confirm password"
                fullWidth
                showLabel
                type="password"
                error={errors.confirmPassword?.message}
                id="confirmPassword"
                {...register("confirmPassword")}
              />

              <Checkbox
                required
                label="I agree to the terms of service"
                id="acceptTerms"
                error={errors.acceptTerms?.message}
                {...register("acceptTerms")}
                className="my-2"
              />

              <Button size="large">Sign up</Button>

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
                  A verification link has been sent to your email!
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
    </>
  )
}

export default SignupPage
