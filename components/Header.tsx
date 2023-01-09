import { FC, Fragment, ReactNode } from "react"
import { Popover, Transition } from "@headlessui/react"
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline"
import { ButtonLink } from "./Button"
import { Logo } from "./Logo"
import Link from "next/link"
import { TextLink } from "./TextLink"

interface DesktopLinkProps {
  children: ReactNode
  href: string
}

const DesktopLink: FC<DesktopLinkProps> = ({ children, href }) => (
  <Link
    href={href}
    className="font-medium text-accents-6 hover:text-foreground"
  >
    {children}
  </Link>
)

interface MobileLinkProps {
  children: ReactNode
  href: string
}

const MobileLink: FC<MobileLinkProps> = ({ children, href }) => (
  <Link
    href={href}
    className="font-medium py-4 text-accents-6 hover:text-foreground"
  >
    {children}
  </Link>
)

export function Header() {
  return (
    <Popover className="relative">
      <div className="sticky mx-auto max-w-7xl bg-accents-1">
        <div className="flex items-center justify-between border-b border-accents-2 px-6 h-16 md:justify-start md:space-x-10">
          <div className="flex justify-start lg:w-0 lg:flex-1">
            <Link href="/">
              <Logo />
            </Link>
          </div>
          <div className="-my-2 -mr-2 md:hidden">
            <Popover.Button className="inline-flex items-center justify-center rounded-md bg-white p-2 hover:bg-accents-2 rounded-base">
              <span className="sr-only">Open menu</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </Popover.Button>
          </div>

          <nav className="hidden space-x-10 md:flex">
            <DesktopLink href="/pricing">Pricing</DesktopLink>
            <DesktopLink href="/courses">Docs</DesktopLink>
          </nav>

          <div className="hidden items-center justify-end md:flex md:flex-1 lg:w-0">
            <ButtonLink href="/signin" intent="secondary">
              Sign in
            </ButtonLink>
            <ButtonLink href="/signup" className="ml-4">
              Sign up
            </ButtonLink>
          </div>
        </div>
      </div>

      <Transition
        as={Fragment}
        enter="duration-200 ease-out"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="duration-100 ease-in"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <Popover.Panel
          focus
          className="absolute inset-x-0 top-0 origin-top-right transform p-2 transition md:hidden bg-accents-5/40 backdrop-blur-2xl rounded-base"
        >
          <div className="rounded-base shadow-lg border-accents-2 border">
            <div className="px-5 pt-5">
              <div className="flex items-center justify-between">
                <Logo />
                <div className="-mr-2">
                  <Popover.Button className="inline-flex items-center justify-center rounded-base bg-white p-2 hover:bg-accents-2">
                    <span className="sr-only">Close menu</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </Popover.Button>
                </div>
              </div>
              <div className="mt-6">
                <nav className="flex flex-col text-center">
                  <MobileLink href="/pricing">Pricing</MobileLink>
                  <MobileLink href="/docs">Docs</MobileLink>
                </nav>
              </div>
            </div>

            <div className="space-y-6 py-6 px-5">
              <div>
                <ButtonLink fullWidth href="/signup">
                  Sign up
                </ButtonLink>
                <p className="mt-6 text-center text-base font-medium text-gray-500">
                  Existing customer? <TextLink href="/signin">Sign in</TextLink>
                </p>
              </div>
            </div>
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  )
}
