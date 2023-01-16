import { AcademicCapIcon, PlayIcon } from "@heroicons/react/20/solid"
import Image from "next/image"
import { Text } from "../../../components/Text"
import { Teacher } from "../../../types/Teacher"

const formatter = new Intl.NumberFormat("en-US")

export const Instructor = ({ teacher }: { teacher: Teacher }) => {
  const formattedNumberOfCourses = formatter.format(teacher.numberOfCourses)
  const formattedNumberOfStudents = formatter.format(
    teacher.totalNumberOfStudents
  )

  console.log(teacher)

  return (
    <div>
      <Text as="h3" size="xl" weight="medium" className="mb-1">
        {teacher.profiles.name}
      </Text>

      <Text as="p" intent="secondary" weight="medium" className="mb-4">
        {teacher.short_desc}
      </Text>

      <div className="flex mb-4 gap-x-8">
        {teacher.profiles.picture ? (
          <Image
            alt="Picture of teacher"
            src={teacher.profiles.picture}
            className="w-24 h-24"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-error" />
        )}

        <ul className="flex flex-col gap-y-1">
          <li className="flex flex-row items-center gap-x-2">
            <PlayIcon className="w-5 h-5" />
            <Text as="span" display="inline" weight="medium" intent="secondary">
              {formattedNumberOfCourses}{" "}
              {teacher.numberOfCourses === 1 ? "Course" : "Courses"}
            </Text>
          </li>
          <li className="flex flex-row items-center gap-x-2">
            <AcademicCapIcon className="w-5 h-5" />
            <Text as="span" display="inline" weight="medium" intent="secondary">
              {formattedNumberOfStudents}{" "}
              {teacher.totalNumberOfStudents === 1 ? "Student" : "Students"}
            </Text>
          </li>
        </ul>
      </div>

      <Text as="h3" weight="medium" className="mb-1">
        About me
      </Text>

      <Text as="p" intent="secondary" weight="medium" className="pb-8">
        {teacher.description}
      </Text>
    </div>
  )
}
