import { PropsWithChildren } from "react"
import { Layout } from "./Layout"

export const AuthLayout = ({ children }: PropsWithChildren) => {
  return (
    <Layout background="accents-1">
      <div className="flex flex-col items-center justify-center min-h-[80vh] py-24 gap-y-8">
        <main className="relative w-full px-6 md:w-1/2">
          <div className="absolute inset-0 z-10 bg-success/30 blur-3xl " />

          {children}
        </main>
      </div>
    </Layout>
  )
}
