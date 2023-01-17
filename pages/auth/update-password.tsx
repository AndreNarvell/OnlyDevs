import { zodResolver } from "@hookform/resolvers/zod"
import { useSupabaseClient } from "@supabase/auth-helpers-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "../../components/Button"
import { Input } from "../../components/Input"
import { AuthLayout } from "../../components/layouts/AuthLayout"
import { Text } from "../../components/Text"
import { Database } from "../../types/supabase"

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

  const [error, setError] = useState("")

  const { auth } = useSupabaseClient<Database>()

  const onSubmit = async (values: SignUpForm) => {
    const { data, error } = await auth.updateUser({
      password: values.password,
    })

    if (error) {
      setError(error.message)
    }

    console.log(data, error)
  }

  return (
    <AuthLayout>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative z-20 flex flex-col gap-4 p-12 border bg-accents-1 border-accents-2 rounded-marketing"
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
  )
}

export default SigninPage
