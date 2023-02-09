import { ArrayInput } from "../../../components/ArrayInput"
import { Button } from "../../../components/Button"
import { Input } from "../../../components/Input"
import { Meta } from "../../../components/Meta"
import { Select } from "../../../components/Select"
import { Text } from "../../../components/Text"
import { TextArea } from "../../../components/TextArea"
import { UnavailableOnMobile } from "../../../components/UnavailableOnMobile"
import { CourseCreatorLayout } from "../../../components/layouts/CourseCreatorLayout"
import { useConfirmLeave } from "../../../features/CourseCreator/hooks/useConfirmLeave"
import { useLoadCourse } from "../../../features/CourseCreator/hooks/useLoadCourse"
import {
  EditorContent,
  useEditorContent,
} from "../../../features/CourseCreator/stores/editorContent"
import { courseDetailsSchema } from "../../../features/CourseCreator/types/CourseDetails"
import { getCourseCreatorData } from "../../../models/courses"
import { CourseStructure } from "../../../types/Course"
import { Database } from "../../../types/supabase"
import { getImageUrl } from "../../../utils/getImageUrl"
import { protectRoute } from "../../../utils/protectRoute"
import { zodResolver } from "@hookform/resolvers/zod"
import { useSupabaseClient } from "@supabase/auth-helpers-react"
import { GetServerSideProps, NextPage } from "next"
import Image from "next/image"
import { FormEvent, useState } from "react"
import { useForm, FormProvider } from "react-hook-form"
import toast, { Toaster } from "react-hot-toast"

interface Props {
  course: CourseStructure
}

type DetailsForm = EditorContent["details"] & {
  icon: File | undefined
  background_image: File | undefined
}

const CreatePage: NextPage<Props> = ({ course }) => {
  useLoadCourse(course)
  useConfirmLeave()

  const [details, setDetails] = useEditorContent(state => [
    state.details,
    state.setDetails,
  ])

  const iconUrl = getImageUrl("course-icons", course.id, { noCache: true })
  const backgroundImageUrl = getImageUrl("course-backgrounds", course.id, {
    noCache: true,
  })

  const [previewIconUrl, setPreviewIconUrl] = useState(
    getImageUrl("course-icons", course.id, { preview: true, noCache: true })
  )
  const [previewBackgroundImageUrl, setPreviewBackgroundImageUrl] = useState(
    getImageUrl("course-backgrounds", course.id, {
      preview: true,
      noCache: true,
    })
  )

  const refreshPreviews = () => {
    setPreviewIconUrl(
      getImageUrl("course-icons", course.id, { preview: true, noCache: true })
    )
    setPreviewBackgroundImageUrl(
      getImageUrl("course-backgrounds", course.id, {
        preview: true,
        noCache: true,
      })
    )
  }

  const methods = useForm<DetailsForm>({
    defaultValues: {
      title: "",
      description: "",
      category_id: 1,
      short_desc: "",
      price: 0,
      includes: [],
      requirements: [],
      tags: [],
      icon: undefined,
      background_image: undefined,
    },
    values: {
      ...details,
      icon: undefined,
      background_image: undefined,
    },
    resolver: zodResolver(courseDetailsSchema),
  })

  const titleMin = courseDetailsSchema.shape.title.minLength
  const titleMax = courseDetailsSchema.shape.title.maxLength

  const descriptionMin = courseDetailsSchema.shape.description.minLength
  const descriptionMax = courseDetailsSchema.shape.description.maxLength

  const shortDescMin = courseDetailsSchema.shape.short_desc.minLength
  const shortDescMax = courseDetailsSchema.shape.short_desc.maxLength

  const {
    register,
    setValue,
    formState: { errors },
    watch,
  } = methods

  const supabase = useSupabaseClient<Database>()

  const handleFileChange = async (
    e: FormEvent<HTMLInputElement>,
    bucket: string,
    fieldName: "icon" | "background_image"
  ) => {
    const file = e.currentTarget.files?.[0]

    setValue(fieldName, file)

    if (!file) return

    await supabase.storage.from(bucket).upload("pre-" + course.id, file, {
      upsert: true,
      cacheControl: "10",
    })

    refreshPreviews()
  }

  const onSubmit = (formValues: DetailsForm) => {
    setDetails(formValues)

    console.log(formValues)

    toast("Saved!", { position: "bottom-center", icon: "💾" })
  }

  const titleLength = watch("title")?.length
  const descriptionLength = watch("description")?.length
  const shortDescLength = watch("short_desc")?.length

  return (
    <>
      <Meta title="Course creator" />

      <Toaster />

      <UnavailableOnMobile />

      <CourseCreatorLayout>
        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            className="p-16 border rounded-marketing border-accents-2"
          >
            <div className="grid grid-cols-2 py-8 border-b gap-x-16 border-accents-2">
              <div>
                <Input
                  id="title"
                  {...register("title")}
                  fullWidth
                  showLabel
                  label="Title"
                  error={errors.title?.message}
                />
                <Text
                  as="p"
                  intent="secondary"
                  italic
                  size="sm"
                  className="mb-4"
                >
                  {titleLength} characters of min {titleMin} and max {titleMax}
                </Text>
              </div>

              <Text as="p" size="sm" className="mt-5 italic" intent="secondary">
                Your title should be as we say in swedish “kort and koncis”!
              </Text>
            </div>

            <div className="grid grid-cols-2 py-8 border-b gap-x-16 border-accents-2">
              <div>
                <TextArea
                  id="description"
                  {...register("description")}
                  fullWidth
                  showLabel
                  label="Description"
                  error={errors.description?.message}
                />
                <Text
                  as="p"
                  intent="secondary"
                  italic
                  size="sm"
                  className="mb-4"
                >
                  {descriptionLength} characters of min {descriptionMin} and max{" "}
                  {descriptionMax}
                </Text>
              </div>

              <Text as="p" size="sm" className="mt-5 italic" intent="secondary">
                The description is your main selling point! This is where you
                lockar till dig students. Really think this through when writing
                your description.
              </Text>
            </div>

            <div className="grid grid-cols-2 py-8 border-b gap-x-16 border-accents-2">
              <div>
                <TextArea
                  id="short_desc"
                  {...register("short_desc")}
                  fullWidth
                  showLabel
                  label="Short description"
                  error={errors.short_desc?.message}
                />
                <Text
                  as="p"
                  intent="secondary"
                  italic
                  size="sm"
                  className="mb-4"
                >
                  {shortDescLength} characters of min {shortDescMin} and max{" "}
                  {shortDescMax}
                </Text>
              </div>
              <Text as="p" size="sm" className="mt-5 italic" intent="secondary">
                Here you write a summarize of your main description. This goes
                on all the cards.
              </Text>
            </div>

            <div className="grid grid-cols-2 py-8 border-b gap-x-16 border-accents-2">
              <ArrayInput
                name="includes"
                label="This course includes"
                error={errors.includes?.message}
              />
              <Text
                as="p"
                size="sm"
                className="mt-5 italic "
                intent="secondary"
              >
                You need to specify what this course includes. For example, 30
                hours of video material and/or text documents.
              </Text>
            </div>

            <div className="grid grid-cols-2 py-8 border-b gap-x-16 border-accents-2">
              <ArrayInput
                name="requirements"
                label="Requirements"
                error={errors.requirements?.message}
              />
              <Text as="p" size="sm" className="mt-5 italic" intent="secondary">
                You also need to write down the requirements for taking this
                course. If the student needs a modern computer, or previous
                knowledge of JavaScript etc.
              </Text>
            </div>

            <div className="grid grid-cols-2 py-8 border-b gap-x-16 border-accents-2">
              <ArrayInput
                name="tags"
                label="Tags"
                error={errors.tags?.message}
              />
              <Text as="p" size="sm" className="mt-5 italic" intent="secondary">
                You also need to write down the requirements for taking this
                course. If the student needs a modern computer, or previous
                knowledge of JavaScript etc.
              </Text>
            </div>

            <div className="grid grid-cols-2 py-8 border-b gap-x-16 border-accents-2">
              <Select
                label="Category"
                showLabel
                id="category_id"
                fullWidth
                className="w-48 mb-4"
                error={errors.category_id?.message}
                {...register("category_id")}
                options={[
                  {
                    label: "JavaScript",
                    value: 1,
                  },
                  {
                    label: "CSS",
                    value: 5,
                  },
                  {
                    label: "React",
                    value: 6,
                  },
                  {
                    label: "Node",
                    value: 7,
                  },
                  {
                    label: "Git",
                    value: 8,
                  },
                  {
                    label: "CI/CD",
                    value: 9,
                  },
                  {
                    label: "Angular",
                    value: 10,
                  },
                  {
                    label: "HTML5",
                    value: 11,
                  },
                  {
                    label: "TypeScript",
                    value: 12,
                  },
                  {
                    label: "Vue",
                    value: 13,
                  },
                ]}
              />
              <Text as="p" size="sm" className="mt-5 italic" intent="secondary">
                You also need to write down the requirements for taking this
                course. If the student needs a modern computer, or previous
                knowledge of JavaScript etc.
              </Text>
            </div>

            <div className="grid grid-cols-2 py-8 border-b gap-x-16 border-accents-2">
              <div>
                <Input
                  onChange={e => handleFileChange(e, "course-icons", "icon")}
                  type="file"
                  name="icon"
                  label="Icon"
                  fullWidth
                  showLabel
                  error={errors.icon?.message}
                />

                <div className="flex gap-x-2">
                  <div className="flex flex-col ">
                    <Image
                      width={100}
                      height={100}
                      alt=""
                      src={iconUrl}
                      unoptimized
                      className="w-10 h-10 rounded-full aspect-square"
                      suppressHydrationWarning
                    />
                    <Text as="p" size="sm">
                      Current icon
                    </Text>
                  </div>

                  <div className="flex flex-col ">
                    <Image
                      width={100}
                      height={100}
                      alt=""
                      src={previewIconUrl}
                      unoptimized
                      className="w-10 h-10 rounded-full aspect-square"
                      suppressHydrationWarning
                    />
                    <Text as="label" size="sm">
                      Preview of new icon
                    </Text>
                  </div>
                </div>
              </div>
              <Text as="p" size="sm" className="mt-5 italic" intent="secondary">
                This is the icon displayed on the course card and in the course
                catalog. Select a square image with a minimum size of 128x128
                pixels.
              </Text>
            </div>

            <div className="grid grid-cols-2 py-8 border-b gap-x-16 border-accents-2">
              <div>
                <Input
                  onChange={e =>
                    handleFileChange(
                      e,
                      "course-backgrounds",
                      "background_image"
                    )
                  }
                  type="file"
                  name="background_image"
                  label="Background image"
                  fullWidth
                  showLabel
                  error={errors.background_image?.message}
                />

                <div className="flex gap-x-2">
                  <div className="flex flex-col ">
                    <Image
                      width={100}
                      unoptimized
                      height={100}
                      alt=""
                      src={backgroundImageUrl}
                      className="aspect-[5/3]"
                      suppressHydrationWarning
                    />
                    <Text as="label" size="sm">
                      Preview of new background
                    </Text>
                  </div>

                  <div className="flex flex-col ">
                    <Image
                      width={100}
                      unoptimized
                      height={100}
                      alt=""
                      src={previewBackgroundImageUrl}
                      className="aspect-[5/3]"
                      suppressHydrationWarning
                    />
                    <Text as="label" size="sm">
                      Preview of new background
                    </Text>
                  </div>
                </div>
              </div>
              <Text as="p" size="sm" className="mt-5 italic" intent="secondary">
                Last but not least, the background image! Select a image with a
                16:9 ratio with a minimum size of 1280x720.
              </Text>
            </div>

            <Button intent="success" className="mt-8">
              Save
            </Button>
          </form>
        </FormProvider>
      </CourseCreatorLayout>
    </>
  )
}
export default CreatePage

export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  const auth = await protectRoute(ctx, "/dashboard")
  if (!auth.isAuthed) {
    return auth.redirect
  }

  const courseId = ctx.query?.courseId
  if (typeof courseId !== "string") {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    }
  }

  const course = await getCourseCreatorData(courseId)
  if (!course) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      course,
    },
  }
}
