import { Layout } from "./Layout"
import { PropsWithChildren } from "react"

export const AuthLayout = ({ children }: PropsWithChildren) => {
  return (
    <Layout background="accents-1">
      <div className="flex flex-col items-center justify-center min-h-[80vh]  gap-y-8">
        <main className="relative w-full px-4 md:px-6 md:w-[32rem] pb-32">
          <div className="absolute inset-0 z-10 mb-32 bg-success/30 blur-3xl" />

          {children}
        </main>
      </div>
    </Layout>
  )
}
