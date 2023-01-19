import { FC, ReactNode } from "react"
import { Footer } from "../Footer"
import { Header } from "../../features/Header/components/Header"

interface Props {
  children: ReactNode
  background?: "background" | "accents-1"
}

export const Layout: FC<Props> = ({ children, background = "background" }) => {
  return (
    <>
      <Header />
      <div className={`bg-${background} min-h-[80vh]`}>
        <main className={"container"}>{children}</main>
      </div>
      <Footer />
    </>
  )
}
