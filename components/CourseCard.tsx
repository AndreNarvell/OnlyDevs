import { Text } from "../components/Text"
import { Database } from "../types/supabase"
import { getImageUrl } from "../utils/getImageUrl"
import * as Progress from "@radix-ui/react-progress"
import Image from "next/image"
import Link from "next/link"
import React, { FC } from "react"
import { UrlObject } from "url"

type Course = Database["public"]["Tables"]["courses"]["Row"]

interface Props {
  id: Course["id"]
  title: Course["title"]
  shortDesc: Course["short_desc"]
  href: string | UrlObject
  showImage?: boolean
  progress?: number
}

export const CourseCard: FC<Props> = ({
  id,
  title,
  shortDesc,
  href,
  showImage = true,
  progress,
}) => {
  return (
    <article className="flex flex-col flex-shrink-0 h-full transition border bg-background rounded-marketing overflow-clip border-accents-2 hover:border-accents-5 w-full max-w-[18rem]">
      <Link href={href}>
        {showImage && (
          <div className="w-full aspect-[5/3] min-h-[12rem]">
            <Image
              width={500}
              height={300}
              src={getImageUrl("course-backgrounds", id)}
              alt={`Background for ${title}`}
              className="object-cover object-center w-full h-full"
            />
          </div>
        )}

        <div className="w-full p-4 pt-3 pb-8 bg-background">
          <div className="flex flex-row items-center gap-x-3 h-14">
            <Image
              width={40}
              height={40}
              src={getImageUrl("course-icons", id)}
              alt={`Icon for ${title}`}
              className="flex-grow-0 flex-shrink-0 object-cover object-center w-10 h-10 rounded-full"
            />
            <Text
              intent="primary"
              weight="bold"
              as="h3"
              className="line-clamp-2"
            >
              {title}
            </Text>
          </div>

          <Text
            intent="secondary"
            size="sm"
            className="mt-2 line-clamp-2 h-[2.625rem]"
            as="p"
          >
            {shortDesc}
          </Text>

          {progress !== undefined && (
            <div className="flex flex-col items-center gap-2 mt-6 -mb-4">
              <Progress.Root
                value={progress}
                max={100}
                className="w-full h-2 rounded-full bg-accents-2 overflow-clip"
              >
                <Progress.Indicator
                  style={{ transform: `translateX(-${100 - progress}%)` }}
                  className="h-full bg-success"
                />
              </Progress.Root>

              <Text as="p" size="sm" weight="bold" className="-mt-0.5">
                {progress}&nbsp;%&nbsp;complete
              </Text>
            </div>
          )}
        </div>
      </Link>
    </article>
  )
}
