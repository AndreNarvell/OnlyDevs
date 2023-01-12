import "../styles/globals.scss"
import type { AppProps } from "next/app"
import { Plus_Jakarta_Sans } from "@next/font/google"
import Head from "next/head"
import { Meta } from "../components/Meta"

export const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  style: "normal",
})

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link
          href="favicon-light-theme.png"
          rel="icon"
          media="(prefers-color-scheme: light)"
        />
        <link
          href="favicon-dark-theme.png"
          rel="icon"
          media="(prefers-color-scheme: dark)"
        />
      </Head>

      <Meta />

      <div className={plusJakartaSans.className}>
        <Component {...pageProps} />
      </div>
    </>
  )
}

export default MyApp
