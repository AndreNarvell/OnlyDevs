import { ArrayInput } from "../../../components/ArrayInput"
import { Button } from "../../../components/Button"
import { Input } from "../../../components/Input"
import { Meta } from "../../../components/Meta"
import { Text } from "../../../components/Text"
import { TextArea } from "../../../components/TextArea"
import { CourseCreatorLayout } from "../../../components/layouts/CourseCreatorLayout"
import { useLoadCourse } from "../../../features/CourseCreator/hooks/useLoadCourse"
import {
  EditorContent,
  useEditorContent,
} from "../../../features/CourseCreator/stores/editorContent"
import { courseDetailsSchema } from "../../../features/CourseCreator/types/CourseDetails"
import {
  getLessonDataForLessons,
  getModulesAndLessons,
} from "../../../models/courses"
import { CourseStructure } from "../../../types/Course"
import { Database } from "../../../types/supabase"
import { zodResolver } from "@hookform/resolvers/zod"
import { useSupabaseClient } from "@supabase/auth-helpers-react"
import { GetServerSideProps, NextPage } from "next"
import Image from "next/image"
import { FormEvent, useEffect, useState } from "react"
import { useForm, FormProvider } from "react-hook-form"

interface Props {
  course: CourseStructure
}

const iconsTemplate = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/course-icons/pre-`

const bgImagesTemplate = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/course-backgrounds/pre-`

type DetailsForm = EditorContent["details"] & {
  icon: File | undefined
  background_image: File | undefined
}

const CreatePage: NextPage<Props> = ({ course }) => {
  const [details, setDetails] = useEditorContent(state => [
    state.details,
    state.setDetails,
  ])
  useLoadCourse(course)

  const [iconUrl, setIconUrl] = useState(
    `${iconsTemplate}${course.id}?t=${Date.now()}`
  )
  const [backgroundImageUrl, setBackgroundImageUrl] = useState(
    `${bgImagesTemplate}${course.id}?t=${Date.now()}`
  )

  const refreshPreviews = () => {
    setIconUrl(`${iconsTemplate}${course.id}?t=${Date.now()}`)
    setBackgroundImageUrl(`${bgImagesTemplate}${course.id}?t=${Date.now()}`)
  }

  const methods = useForm<DetailsForm>({
    values: {
      ...details,
      icon: undefined,
      background_image: undefined,
    },
    resolver: zodResolver(courseDetailsSchema),
  })

  const supabase = useSupabaseClient<Database>()

  const {
    register,
    setValue,
    formState: { errors },
  } = methods

  // console.log("watch", methods.watch())
  // console.log("errors:", errors)

  const handleFileChange = async (
    e: FormEvent<HTMLInputElement>,
    bucket: string,
    fieldName: "icon" | "background_image"
  ) => {
    const file = e.currentTarget.files?.[0]

    console.log("Set file", file)

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
  }

  return (
    <>
      <Meta title="Course creator" />

      <CourseCreatorLayout>
        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            className="p-16 border rounded-marketing border-accents-2"
          >
            <div className="grid grid-cols-2 py-8 border-b gap-x-16 border-accents-2">
              <Input
                id="title"
                {...register("title")}
                className="mb-2"
                fullWidth
                showLabel
                label="Title"
                error={errors.title?.message}
              />
              <Text as="p" size="sm" className="mt-5 italic" intent="secondary">
                Your title should be as we say in swedish “kort and koncis”!
              </Text>
            </div>

            <div className="grid grid-cols-2 py-8 border-b gap-x-16 border-accents-2">
              <TextArea
                id="description"
                {...register("description")}
                className="mb-2"
                fullWidth
                showLabel
                label="Description"
                error={errors.description?.message}
              />
              <Text as="p" size="sm" className="mt-5 italic" intent="secondary">
                The description is your main selling point! This is where you
                lockar till dig students. Really think this through when writing
                your description.
              </Text>
            </div>

            <div className="grid grid-cols-2 py-8 border-b gap-x-16 border-accents-2">
              <TextArea
                id="short_desc"
                {...register("short_desc")}
                className="mb-2"
                fullWidth
                showLabel
                label="Short description"
                error={errors.short_desc?.message}
              />
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

                <Image
                  width={100}
                  height={100}
                  alt="Preview of course icon"
                  src={iconUrl}
                  unoptimized
                />
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

                <Image
                  width={100}
                  unoptimized
                  height={100}
                  alt="Preview of background image"
                  src={backgroundImageUrl}
                />
              </div>
              <Text as="p" size="sm" className="mt-5 italic" intent="secondary">
                This is the icon displayed on the course card and in the course
                catalog. Select a square image with a minimum size of 128x128
                pixels.
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

export const getServerSideProps: GetServerSideProps<Props> = async context => {
  const courseId = context.params?.courseId
  if (typeof courseId !== "string") {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    }
  }

  const course = await getModulesAndLessons(courseId)
  if (!course) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    }
  }

  const allLessonIds = course.modules
    .flatMap(module => module.lessons)
    .map(lesson => lesson.id)

  const lessonData = await getLessonDataForLessons(allLessonIds)

  console.log(lessonData)

  if (!lessonData) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    }
  }

  // Merge lesson data with lesson
  const newModules = course.modules.map(module => {
    return {
      ...module,
      lessons: module.lessons.map(lesson => {
        const theLessonData = lessonData.find(
          lessonData => lessonData.id === lesson.id
        )
        if (!theLessonData) {
          return lesson
        }

        return {
          ...lesson,
          video_url: theLessonData.video_url,
          article_data: theLessonData.article_data,
        }
      }),
    }
  })

  // const newModules = course.modules.map(module => {
  //   return module.lessons.map(lesson => {
  //     const theLessonData = lessonData.find(
  //       lessonData => lessonData.id === lesson.id
  //     )
  //     if (!theLessonData) {
  //       return lesson
  //     }

  //     return {
  //       ...lesson,
  //       video_url: theLessonData.video_url,
  //       article_data: theLessonData.article_data,
  //     }
  //   })
  // })

  return {
    props: {
      course: {
        ...course,
        modules: newModules,
      },
    },
  }
}
