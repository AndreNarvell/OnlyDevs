import { FC, ReactNode } from "react"
import { Footer } from "../Footer"
import { Header } from "../../features/Header/components/Header"
import clsx from "clsx"

interface Props {
  children: ReactNode
  background?: "background" | "accents-1"
  wide?: boolean
}

export const Layout: FC<Props> = ({
  children,
  background = "background",
  wide = false,
}) => {
  return (
    <>
      <Header />

      <div className={`bg-${background} min-h-[80vh]`}>
        <main className={clsx("container pt-16", wide && "xl:max-w-screen-xl")}>
          {children}
        </main>
      </div>

      <Footer />
    </>
  )
}
