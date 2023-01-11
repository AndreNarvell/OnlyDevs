import React, { FC } from "react"
import { Text } from "../../components/Text"
import { CourseCard } from "../../components/CourseCard"
import { Input } from "../../components/Input"

import { Database } from "../../types/supabase"
import Link from "next/link"
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid"
import { ButtonLink } from "../../components/Button"

const categories = [
  {
    name: "HTML",
    slug: "html",
  },
  {
    name: "CSS",
    slug: "css",
  },
  {
    name: "JavaScript",
    slug: "javascript",
  },
  {
    name: "React",
    slug: "react",
  },
  {
    name: "TypeScript",
    slug: "typescript",
  },
  {
    name: "Node.js",
    slug: "node-js",
  },
]

interface Props {
  courses: Database["public"]["Tables"]["courses"]["Row"][]
}

export const LatestCourses: FC<Props> = ({ courses }) => {
  return (
    <div className="grid lg:grid-cols-3 sm:mb-32 gap-x-6">
      <div className="p-8 border-t lg:col-span-2 bg-accents-1 border-accents-2 sm:border sm:rounded-marketing">
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

        <Input
          label="Search courses"
          placeholder="Search courses..."
          name="search"
          icon={MagnifyingGlassIcon}
          fullWidth
        />

        <div className="grid gap-6 my-8 sm:grid-cols-2">
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

        <Link href="/courses">
          <Text
            as="span"
            intent="secondary"
            size="base"
            className="transition hover:text-foreground"
            align="center"
            tracking="wide"
          >
            Browse all courses →
          </Text>
        </Link>
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
            <li key={category.slug} className="">
              <ButtonLink
                variant="ghost"
                align="left"
                href={{
                  pathname: "courses",
                  query: { tags: category.slug },
                }}
                className=""
              >
                {category.name}
              </ButtonLink>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
