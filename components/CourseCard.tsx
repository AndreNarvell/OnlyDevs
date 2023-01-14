import React, { FC } from "react"
import Image from "next/image"
import { Text } from "../components/Text"
import { Database } from "../types/supabase"
import Link from "next/link"
import { UrlObject } from "url"

type Course = Database["public"]["Tables"]["courses"]["Row"]

interface Props {
  backgroundImage?: Course["background_image"]
  icon: Course["icon"]
  title: Course["title"]
  shortDesc: Course["short_desc"]
  href: string | UrlObject
}

export const CourseCard: FC<Props> = ({
  backgroundImage,
  icon,
  title,
  shortDesc,
  href,
}) => {
  return (
    <article className="flex flex-col flex-shrink-0 h-full transition border bg-background rounded-marketing overflow-clip border-accents-2 hover:border-accents-5 w-full max-w-[18rem]">
      <Link href={href}>
        {backgroundImage && (
          <div className="w-full aspect-[5/3] min-h-[12rem]">
            <Image
              width={500}
              height={300}
              src={backgroundImage}
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
              src={icon}
              alt={`Icon for ${title}`}
              className="flex-grow-0 flex-shrink-0 rounded-full"
            />
            <Text intent="primary" weight="bold" as="h3">
              {title}
            </Text>
          </div>
          <Text
            intent="secondary"
            size="sm"
            className="mt-2 line-clamp-2"
            as="p"
          >
            {shortDesc}

            <span className="text-success/50">
              {" "}
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Non,
              perspiciatis nihil! Modi nisi quis maxime voluptatum libero hic
              aspernatur labore.
            </span>
          </Text>
        </div>
      </Link>
    </article>
  )
}
