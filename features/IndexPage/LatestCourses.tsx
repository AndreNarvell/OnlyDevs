import React, { FC } from "react"
import { Text } from "../../components/Text"
import { CourseCard } from "../../components/CourseCard"
import { Input } from "../../components/Input"

import { Database } from "../../types/supabase"
import Link from "next/link"
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid"

interface Props {
  courses: Database["public"]["Tables"]["courses"]["Row"][]
}

export const LatestCourses: FC<Props> = ({ courses }) => {
  return (
    <div className="px-8 border-t bg-accents-1 border-accents-2">
      <Text
        intent="primary"
        size="2xl"
        weight="medium"
        tracking="wide"
        className="mt-8"
        align="center"
      >
        Latest courses
      </Text>
      <Text intent="secondary" size="sm" tracking="wide" align="center">
        Unlock new opportunities with our latest online courses
      </Text>

      <Input
        label="Search courses"
        placeholder="Search courses..."
        name=""
        icon={MagnifyingGlassIcon}
        fullWidth={true}
        className="mt-4"
      />

      {courses.map(course => (
        <CourseCard
          key={course.id}
          backgroundImage={course.background_image}
          icon={course.icon}
          title={course.title}
          shortDesc={course.short_desc}
        />
      ))}
      <Link href="/courses">
        <Text intent="secondary" size="base" className="pb-8" align="center">
          Browse all courses →
        </Text>
      </Link>
    </div>
  )
}
