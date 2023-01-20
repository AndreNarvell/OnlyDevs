import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs"
import { SessionContextProvider, Session } from "@supabase/auth-helpers-react"
import { useEffect, useState } from "react"
import "../styles/globals.scss"
import type { AppProps } from "next/app"
import { Plus_Jakarta_Sans } from "@next/font/google"
import Head from "next/head"
import { Meta } from "../components/Meta"
import { Database } from "../types/supabase"
import { useShoppingCart } from "../stores/shoppingCart"
import { supabase } from "../lib/supabase"

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

  const refreshCourseData = useShoppingCart(prev => prev.refreshCourseData)

  // Refresh course data on initial load
  useEffect(() => {
    refreshCourseData()
  }, [])

  // Refresh course data every minute
  useEffect(() => {
    const interval = setInterval(() => {
      refreshCourseData()
    }, 1000 * 60)

    return () => clearInterval(interval)
  }, [refreshCourseData])

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
