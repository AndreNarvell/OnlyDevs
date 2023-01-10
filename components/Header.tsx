import { FC, Fragment, ReactNode } from "react"
import { Popover, Transition } from "@headlessui/react"
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline"
import { ButtonLink } from "./Button"
import { Logo } from "./Logo"
import Link from "next/link"
import { TextLink } from "./TextLink"
import { Text } from "./Text"

const links = [
  {
    name: "Courses",
    href: "/courses",
  },
  {
    name: "Become a teacher",
    href: "/become-a-teacher",
  },
]

export function Header() {
  return (
    <Popover>
      <div className="h-16" />
      <div className="fixed top-0 z-40 w-full border-b bg-blur border-accents-2 backdrop-blur-md">
        <div className="container w-full mx-auto">
          <div className="flex items-center justify-between h-16 px-6 md:justify-start md:space-x-10">
            <div className="flex justify-start lg:w-0 lg:flex-1">
              <Link href="/">
                <Logo />
              </Link>
            </div>

            <div className="-my-2 -mr-2 md:hidden">
              <Popover.Button className="inline-flex items-center justify-center p-2 rounded-md hover:bg-accents-2 rounded-base">
                <span className="sr-only">Open menu</span>
                <Bars3Icon className="w-6 h-6" aria-hidden="true" />
              </Popover.Button>
            </div>

            <nav className="hidden space-x-10 md:flex">
              {links.map(link => (
                <Link
                  href={link.href}
                  className="font-medium text-accents-8 hover:text-foreground"
                  key={link.name}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            <div className="items-center justify-end hidden md:flex md:flex-1 lg:w-0">
              <ButtonLink href="/signin" intent="secondary">
                Sign in
              </ButtonLink>
              <ButtonLink href="/signup" className="ml-4">
                Sign up
              </ButtonLink>
            </div>
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
          className="fixed inset-x-0 top-0 z-40 p-2 transition origin-top-right transform md:hidden bg-blur backdrop-blur-2xl rounded-base"
        >
          <div className="border shadow-lg rounded-base border-accents-2">
            <div className="px-5 pt-5">
              <div className="flex items-center justify-between">
                <Logo />

                <div className="-mr-2">
                  <Popover.Button className="inline-flex items-center justify-center p-2 bg-white rounded-base hover:bg-accents-2">
                    <span className="sr-only">Close menu</span>
                    <XMarkIcon className="w-6 h-6" aria-hidden="true" />
                  </Popover.Button>
                </div>
              </div>

              <div className="mt-6">
                <nav className="flex flex-col">
                  {links.map(link => (
                    <Link
                      href={link.href}
                      className="py-4 text-accents-8 hover:text-foreground"
                      key={link.name}
                    >
                      <Text
                        size="sm"
                        weight="medium"
                        tracking="wide"
                        align="center"
                      >
                        {link.name}
                      </Text>
                    </Link>
                  ))}
                </nav>
              </div>
            </div>

            <div className="px-5 py-6 space-y-6">
              <ButtonLink fullWidth href="/signup">
                Sign up
              </ButtonLink>

              <Text weight="medium" align="center" className="mt-6">
                Existing customer? <TextLink href="/signin">Sign in</TextLink>
              </Text>
            </div>
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  )
}
