import "../styles/globals.scss"
import type { AppProps } from "next/app"
import { Plus_Jakarta_Sans } from "@next/font/google"

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  style: "normal",
})

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className={plusJakartaSans.className}>
      <Component {...pageProps} />
    </div>
  )
}

export default MyApp
