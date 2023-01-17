import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs"
import { SessionContextProvider, Session } from "@supabase/auth-helpers-react"
import { useState } from "react"
import "../styles/globals.scss"
import type { AppProps } from "next/app"
import { Plus_Jakarta_Sans } from "@next/font/google"
import Head from "next/head"
import { Meta } from "../components/Meta"
import { Database } from "../types/supabase"

export const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  style: "normal",
})

function MyApp({
  Component,
  pageProps,
}: AppProps<{
  initialSession: Session
}>) {
  const [supabaseClient] = useState(() =>
    createBrowserSupabaseClient<Database>()
  )

  return (
    <>
      <Head>
        <link
          href="/favicon-light-theme.png"
          rel="icon"
          media="(prefers-color-scheme: light)"
        />
        <link
          href="/favicon-dark-theme.png"
          rel="icon"
          media="(prefers-color-scheme: dark)"
        />
      </Head>

      <Meta />

      <div className={plusJakartaSans.className}>
        <SessionContextProvider
          supabaseClient={supabaseClient}
          initialSession={pageProps.initialSession}
        >
          <Component {...pageProps} />
        </SessionContextProvider>
      </div>
    </>
  )
}

export default MyApp
