import Head from "next/head"
import { FC } from "react"

interface Props {
  title?: string
  description?: string
}

const defaultDescription =
  "OnlyDevs is a platform for high-quality video tutorials and curated learning resources."

export const Meta: FC<Props> = ({
  title,
  description = defaultDescription,
}) => {
  const titleTemplate = title ? `${title} – OnlyDevs` : "OnlyDevs"

  return (
    <Head>
      <title key="title">{titleTemplate}</title>
      <meta property="og:title" content={titleTemplate} key="og:title" />

      <meta name="description" content={description} key="description" />
      <meta
        property="og:description"
        content={description}
        key="og:description"
      />
    </Head>
  )
}
