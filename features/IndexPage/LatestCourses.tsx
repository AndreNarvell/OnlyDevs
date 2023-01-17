import React, { FC } from "react"
import { Text } from "../../components/Text"
import { CourseCard } from "../../components/CourseCard"
import { Input } from "../../components/Input"
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid"
import { Button, ButtonLink } from "../../components/Button"
import { TextLink } from "../../components/TextLink"
import { Course } from "../../types/Course"
import { useRouter } from "next/router"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Category } from "../../types/Category"
import { serialiseCategories } from "../CourseCatalog/utils/filter"

interface Props {
  courses: Course[]
  categories: Category[]
}

const searchValidationSchema = z.object({
  search: z.string().min(2, "Search must be at least 2 characters"),
})

export const LatestCourses: FC<Props> = ({ courses, categories }) => {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ search: string }>({
    resolver: zodResolver(searchValidationSchema),
  })

  return (
    <div className="grid lg:grid-cols-3 sm:mb-32 gap-x-6">
      <div className="w-full p-8 mx-auto border-t lg:col-span-2 bg-accents-1 border-accents-2 sm:border sm:rounded-marketing sm:max-w-max">
        <Text
          as="h2"
          intent="primary"
          size="2xl"
          weight="medium"
          tracking="wide"
          align="center"
        >
          Latest Courses
        </Text>
        <Text
          as="p"
          intent="secondary"
          size="sm"
          tracking="wide"
          align="center"
          className="mb-4"
        >
          Unlock new opportunities with our latest online courses
        </Text>

        <form
          className="flex gap-2"
          onSubmit={handleSubmit(values => {
            router.push({
              pathname: "/courses",
              query: {
                search: values.search,
              },
            })
          })}
        >
          <Input
            label="Search courses"
            placeholder="Search courses..."
            icon={MagnifyingGlassIcon}
            fullWidth
            error={errors.search?.message}
            {...register("search")}
          />

          <Button>Search</Button>
        </form>

        <div className="grid gap-6 my-8 place-items-center sm:grid-cols-2">
          {courses.map(course => (
            <CourseCard
              key={course.id}
              backgroundImage={course.background_image}
              icon={course.icon}
              title={course.title}
              shortDesc={course.short_desc}
              href={{
                pathname: "courses/[slug]",
                query: { slug: course.slug },
              }}
            />
          ))}
        </div>

        <TextLink
          href="/courses"
          intent="secondary"
          align="center"
          tracking="wide"
        >
          Browse all courses →
        </TextLink>
      </div>

      {/* Category box */}
      <div className="hidden p-8 border lg:block bg-accents-1 border-accents-2 rounded-marketing h-max">
        <Text
          as="h3"
          intent="primary"
          size="2xl"
          weight="medium"
          tracking="wide"
          align="center"
        >
          Top Categories
        </Text>

        <Text
          as="p"
          intent="secondary"
          size="sm"
          tracking="wide"
          align="center"
          className="mb-4"
        >
          Check these out or whatever
        </Text>

        <ol className="flex flex-col gap-1 mb-3">
          {categories.map(category => (
            <li key={category.id} className="">
              <ButtonLink
                variant="ghost"
                align="left"
                href={{
                  pathname: "/courses",
                  query: {
                    categories: serialiseCategories([category.id]),
                  },
                }}
              >
                {category.title}
              </ButtonLink>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
