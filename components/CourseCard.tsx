import React, { FC } from "react"
import Image from "next/image"
import { Text } from "../components/Text"
import { Database } from "../types/supabase"

type Course = Database["public"]["Tables"]["courses"]["Row"]

interface Props {
  backgroundImage: Course["background_image"]
  icon: Course["icon"]
  title: Course["title"]
  shortDesc: Course["short_desc"]
}

export const CourseCard: FC<Props> = ({
  backgroundImage,
  icon,
  title,
  shortDesc,
}) => {
  return (
    <div className="flex flex-col my-8 bg-background rounded-marketing overflow-clip">
      <div className="w-full overflow-clip">
        <Image
          width={280}
          height={220}
          src={backgroundImage}
          alt=""
          className="object-cover object-center w-full "
        />
      </div>

      <div className="w-full p-4 bg-background">
        <div className="flex flex-row items-center gap-x-4">
          <Image
            width={50}
            height={50}
            src={icon}
            alt=""
            className="flex-grow-0 flex-shrink-0 rounded-full"
          />
          <Text intent="primary" size="lg">
            {title}
          </Text>
        </div>
        <Text intent="secondary" size="base" className="mt-4 line-clamp-2">
          {shortDesc} Lorem ipsum dolor sit, amet consectetur adipisicing elit.
          Non, repellat at ut recusandae aspernatur explicabo nihil, quisquam
          enim odio molestias neque impedit soluta, saepe perferendis eum
          facilis veniam tempore voluptates.
        </Text>
      </div>
    </div>
  )
}
