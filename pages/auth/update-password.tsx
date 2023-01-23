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
import { Database } from "../../types/supabase"
import { parseQuery } from "../../utils/parseQuery"

const signUpForm = z
  .object({
    password: z.string().min(8),
    confirmPassword: z.string(),
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
      password: "",
      confirmPassword: "",
    },
  })

  const onSubmit = async (values: SignUpForm) => {
    const { error } = await auth.updateUser({
      password: values.password,
    })

    if (error) {
      return setError(error.message)
    }

    router.push("/dashboard")
  }

  useEffect(() => {
    const query = parseQuery("/auth/update-password#", router.asPath)
    const errorMessage = query.get("error_description")

    if (errorMessage) {
      setError(errorMessage)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <Meta title="Update your password" noIndex />

      <AuthLayout>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="relative z-20 flex flex-col gap-4 p-6 border md:p-12 bg-accents-1 border-accents-2 rounded-marketing"
        >
          <Text as="h1" size="2xl" weight="bold" align="center">
            Update password
          </Text>

          <Text as="p" align="center" intent="secondary" className="mb-4">
            You have been logged in. Please change your password here.
          </Text>

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
            className="mb-6"
          />

          <Button size="large">Update</Button>

          {error && (
            <Text as="p" weight="medium" intent="error" align="center">
              Error: {error}
            </Text>
          )}
        </form>
      </AuthLayout>
    </>
  )
}

export default SigninPage
