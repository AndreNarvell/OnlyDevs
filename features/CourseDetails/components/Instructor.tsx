import { Text } from "../../../components/Text"
import { Teacher } from "../../../types/Teacher"
import { getImageUrl } from "../../../utils/getImageUrl"
import { AcademicCapIcon, BookOpenIcon } from "@heroicons/react/20/solid"
import Image from "next/image"

const formatter = new Intl.NumberFormat("en-US")

export const Instructor = ({ teacher }: { teacher: Teacher }) => {
  const formattedNumberOfCourses = formatter.format(teacher.numberOfCourses)
  const formattedNumberOfStudents = formatter.format(
    teacher.totalNumberOfStudents
  )

  return (
    <div className="p-8 pt-6 border border-accents-2 rounded-marketing">
      <Text as="h3" size="xl" weight="semibold" className="mb-1">
        {teacher.profiles.name}
      </Text>

      <Text as="p" intent="secondary" weight="medium" className="mb-4">
        {teacher.short_desc}
      </Text>

      <div className="flex mb-4 gap-x-4">
        <Image
          alt="Picture of teacher"
          src={getImageUrl("profile-pictures", teacher.id)}
          width={96}
          height={96}
          className="object-cover object-center w-24 h-24 rounded-full"
        />

        <ul className="flex flex-col gap-y-1">
          <li className="flex flex-row items-center gap-x-2">
            <BookOpenIcon className="w-5 h-5" />
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
