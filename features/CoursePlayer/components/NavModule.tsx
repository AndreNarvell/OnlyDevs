import { Text } from "../../../components/Text"
import { TextLink } from "../../../components/TextLink"
import { CourseStructure } from "../../../types/Course"
import { Disclosure } from "@headlessui/react"
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from "@heroicons/react/20/solid"
import clsx from "clsx"
import { useRouter } from "next/router"
import { FC } from "react"

interface Props {
  module: CourseStructure["modules"][0]
  progress: string[]
}

export const NavModule: FC<Props> = ({ module, progress }) => {
  const { query } = useRouter()

  const isCompleted =
    module.lessons.length > 0
      ? module.lessons.every(lesson => progress.includes(lesson.id))
      : false

  const isInProgress = module.lessons.some(lesson =>
    progress.includes(lesson.id)
  )

  const isCurrentModule = module.lessons.some(
    lesson => lesson.id === query.lessonId
  )

  return (
    <Disclosure as="li" key={module.id}>
      {({ open }) => (
        <>
          <Disclosure.Button className="flex items-stretch mt-px gap-x-2">
            <div className="relative flex flex-col items-center gap-y-0.5">
              {isCompleted ? (
                <CheckIcon className="flex-shrink-0 w-5 h-5 text-success" />
              ) : (
                <div className="flex items-center justify-center w-5 h-5">
                  <div
                    className={clsx(
                      "flex-shrink-0 w-3 h-3 rounded-full",
                      isInProgress ? "bg-success" : "bg-accents-3"
                    )}
                  />
                </div>
              )}

              {open ? (
                <svg
                  className={clsx(
                    "absolute top-[22px] left-[9px]",
                    isCompleted ? "text-success" : "text-accents-3"
                  )}
                  width="10"
                  height="24"
                  viewBox="0 0 10 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1 1V18C1 20.7614 3.23858 23 6 23H9"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeWidth={2}
                  />
                </svg>
              ) : (
                /* Straight connector */

                <div
                  className={clsx(
                    "flex-grow flex-shrink-0 w-[1.5px] h-auto min-h-auto",
                    isCompleted ? "bg-success" : "bg-accents-3"
                  )}
                />
              )}
            </div>

            <Text
              as="h2"
              size="xs"
              intent="secondary"
              className={clsx(
                open ? "pb-5" : "pb-5",
                isCurrentModule ? "!text-foreground" : "text-accents-6"
              )}
            >
              {module.title}
            </Text>

            {open ? (
              <ChevronDownIcon className="flex-shrink-0 w-5 h-5 text-secondary" />
            ) : (
              <ChevronRightIcon className="flex-shrink-0 w-5 h-5 text-secondary" />
            )}
          </Disclosure.Button>

          <Disclosure.Panel as="ol">
            {module.lessons.map((lesson, index, array) => {
              const isCurrentLesson = query.lessonId === lesson.id

              return (
                <li
                  className="flex items-stretch pb-1 ml-5 gap-x-2"
                  key={lesson.id}
                >
                  <div className="relative flex flex-col items-center gap-y-0.5">
                    <div className="flex items-center justify-center w-5 h-5">
                      <div
                        className={clsx(
                          "flex-shrink-0 w-3 h-3 rounded-full",
                          isInProgress ? "bg-success" : "bg-accents-3"
                        )}
                      />
                    </div>

                    {index !== array.length - 1 && (
                      <div
                        className={clsx(
                          "flex-grow flex-shrink-0 w-px h-auto min-h-auto",
                          isCompleted ? "bg-success" : "bg-accents-3"
                        )}
                      />
                    )}
                  </div>

                  <TextLink
                    size="xs"
                    intent="secondary"
                    className={clsx(
                      "w-full",
                      index !== array.length - 1 && "pb-5",
                      isCurrentLesson
                        ? "font-bold !text-foreground"
                        : "text-accents-6"
                    )}
                    href={{
                      pathname: "/my-courses",
                      query: {
                        ...query,
                        lessonId: lesson.id,
                      },
                    }}
                  >
                    {lesson.title}
                  </TextLink>
                </li>
              )
            })}

            <svg
              width="21"
              height="18"
              className={clsx(
                "relative ml-2.5",
                isCompleted ? "text-success" : "text-accents-3"
              )}
              viewBox="0 0 22 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11 9L16 9C18.7614 9 21 6.76142 21 4L21 1"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth={2}
              />
              <path
                d="M11 9L6 9C3.23858 9 1 11.2386 1 14L1 17"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth={2}
              />
            </svg>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}
