import { PropsWithChildren } from "react"
import { Footer } from "./Footer"
import { Header } from "./Header"

export const Layout = ({ children }: PropsWithChildren) => {
  return (
    <>
      <Header />
      <main className="container">{children}</main>
      <Footer />
    </>
  )
}
