import { Button, ButtonLink } from "../components/Button"
import { Input } from "../components/Input"
import { Meta } from "../components/Meta"
import { Text } from "../components/Text"
import { TextArea } from "../components/TextArea"
import { Layout } from "../components/layouts/Layout"
import { TeacherCloud } from "../features/BecomeATeacher/components/TeacherCloud"
import {
  TeacherForm,
  teacherFormSchema,
} from "../features/BecomeATeacher/types/TeacherForm"
import { serverSideSupabase } from "../lib/supabase"
import { Database } from "../types/supabase"
import { zodResolver } from "@hookform/resolvers/zod"
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs"
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react"
import { GetServerSideProps, NextPage } from "next"
import { ChangeEvent, useState } from "react"
import { useForm } from "react-hook-form"
import Balancer from "react-wrap-balancer"

interface Props {
  isTeacher: boolean
}

const BecomeATeacherPage: NextPage<Props> = ({ isTeacher }) => {
  const [error, setError] = useState("")
  const supabase = useSupabaseClient<Database>()
  const session = useSession()

  const [file, setFile] = useState<File | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitSuccessful, isSubmitting },
  } = useForm<TeacherForm>({
    resolver: zodResolver(teacherFormSchema),
    defaultValues: {
      description: "",
      short_desc: "",
      picture: null,
    },
  })

  const onSubmit = async (values: TeacherForm) => {
    console.log(values)

    setError("")

    if (!session) {
      return setError("You must be logged in to become a teacher")
    }

    if (!(file instanceof File)) {
      return setError("Please select a profile picture")
    }

    const response = await fetch("/api/register-teacher", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        description: values.description,
        short_desc: values.short_desc,
        picture: null,
      }),
    })

    const data = await response.json()
    console.log(data)

    if (!response.ok) {
      setError("Something went wrong. Please try again later.")
    }

    if (data.error) {
      return setError(data.error)
    }

    const { data: uploadData, error } = await supabase.storage
      .from("profile-pictures")
      .upload(session.user.id, file)

    console.log(uploadData, error)
  }

  const showNextStep = !isSubmitting && isSubmitSuccessful && !error

  const descriptionLength = watch("description").length
  const shortDescLength = watch("short_desc").length

  return (
    <>
      <Meta
        title="Become a teacher"
        description="Join 10 000 others and sign up as a teacher on OnlyDevs!"
      />

      <Layout>
        <TeacherCloud />

        <section className="relative w-full px-4 md:px-6 md:w-[32rem] my-32 mx-auto">
          <div className="absolute inset-0 z-10 bg-success/30 blur-3xl " />

          {isTeacher ? (
            <div className="relative z-20 flex flex-col p-6 border md:p-12 bg-accents-1 border-accents-2 rounded-marketing">
              <Text as="h3" weight="bold" align="center" size="lg">
                You are already registered as a teacher
              </Text>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="relative z-20 flex flex-col p-6 border md:p-12 bg-accents-1 border-accents-2 rounded-marketing"
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
                    Register as teacher
                  </Text>

                  <Text
                    as="p"
                    intent="secondary"
                    align="center"
                    className="mb-8"
                  >
                    Upgrade your account to a teacher account by filling out the
                    form below
                  </Text>

                  <TextArea
                    label="Description"
                    fullWidth
                    showLabel
                    error={errors.description?.message}
                    id="description"
                    {...register("description")}
                  />

                  <Text
                    as="p"
                    intent="secondary"
                    italic
                    size="sm"
                    className="mb-4"
                  >
                    {descriptionLength} characters of min 300 and max 800
                  </Text>

                  <TextArea
                    label="Short description"
                    fullWidth
                    showLabel
                    error={errors.short_desc?.message}
                    id="short_desc"
                    {...register("short_desc")}
                  />
                  <Text
                    as="p"
                    intent="secondary"
                    italic
                    size="sm"
                    className="mb-4"
                  >
                    {shortDescLength} characters of min 20 and max 100
                  </Text>

                  <Input
                    label="Picture"
                    fullWidth
                    showLabel
                    type="file"
                    error={errors.picture?.message}
                    id="picture"
                    className="mb-8"
                    {...register("picture", {
                      onChange: (e: ChangeEvent<HTMLInputElement>) => {
                        setFile(e.target.files?.[0] ?? null)
                      },
                    })}
                  />

                  <Button size="large">Register as teacher</Button>

                  {error && (
                    <Text
                      as="p"
                      weight="medium"
                      intent="error"
                      align="center"
                      className="mt-4"
                    >
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
                      You have signed up as a teacher!
                    </Text>
                  </Balancer>

                  <Text
                    as="p"
                    align="center"
                    intent="secondary"
                    className="mb-4"
                  >
                    Go to your dashboard to start creating courses
                  </Text>

                  <ButtonLink href="/created-courses">
                    Go to dashboard
                  </ButtonLink>
                </>
              )}
            </form>
          )}
        </section>
      </Layout>
    </>
  )
}
export default BecomeATeacherPage

export const getServerSideProps: GetServerSideProps<Props> = async context => {
  const supabase = createServerSupabaseClient<Database>(context)

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return {
      props: {
        isTeacher: false,
      },
    }
  }

  const { data } = await serverSideSupabase()
    .from("teachers")
    .select("id")
    .eq("id", session.user.id)
    .single()

  return {
    props: {
      isTeacher: Boolean(data),
    },
  }
}
