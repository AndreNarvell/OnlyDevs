import { Button, ButtonLink } from "../../../components/Button"
import { Logo } from "../../../components/Logo"
import { Text } from "../../../components/Text"
import { TextLink } from "../../../components/TextLink"
import { ShoppingCart } from "./ShoppingCart"
import { UserMenu } from "./UserMenu"
import { Popover, Transition } from "@headlessui/react"
import {
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  BookOpenIcon,
  HeartIcon,
  WrenchScrewdriverIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline"
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react"
import Link from "next/link"
import { Fragment } from "react"

const links = [
  {
    name: "Home",
    href: "/",
  },
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
  const { auth } = useSupabaseClient()
  const session = useSession()
  const user = session?.user

  return (
    <Popover>
      <div className="h-16" />
      <div className="fixed top-0 z-40 w-full border-b bg-background/50 border-accents-2 backdrop-blur-md">
        <div className="container w-full mx-auto">
          <div className="flex items-center justify-between h-16 px-6 md:space-x-10">
            <Link href="/">
              <Logo />
            </Link>

            <nav className="hidden space-x-10 md:flex">
              {links.map(link => (
                <TextLink href={link.href} key={link.name} weight="medium">
                  {link.name}
                </TextLink>
              ))}
            </nav>

            <div className="flex items-center gap-x-2">
              {/* <ShoppingCart /> */}

              <ShoppingCart />
              <Popover.Button
                as={Button}
                variant="ghost"
                icon={Bars3Icon}
                aria-label="Open menu"
                className="-my-2 -mr-2 md:hidden"
              />
              {user ? (
                <div className="hidden md:flex">
                  <UserMenu />
                </div>
              ) : (
                <div className="hidden md:flex gap-x-2">
                  <ButtonLink href="/auth/signin" intent="secondary">
                    Sign in
                  </ButtonLink>

                  <ButtonLink href="/auth/signup">Sign up</ButtonLink>
                </div>
              )}
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
          className="fixed inset-x-0 top-0 z-40 p-2 transition origin-top-right transform md:hidden bg-accents-1/50 backdrop-blur-2xl rounded-base"
        >
          <div className="pb-6 border shadow-lg rounded-base border-accents-2">
            <div className="px-5 pt-5">
              <div className="flex items-center justify-between">
                <Link href="/">
                  <Logo />
                </Link>

                <Popover.Button
                  as={Button}
                  variant="ghost"
                  icon={XMarkIcon}
                  aria-label="Close menu"
                  className="-mr-2"
                />
              </div>

              <div className="mt-6">
                <nav className="flex flex-col gap-y-1">
                  {user ? (
                    <>
                      <ButtonLink
                        href="/dashboard"
                        variant="ghost"
                        icon={BookOpenIcon}
                      >
                        My courses
                      </ButtonLink>

                      <ButtonLink
                        href="/saved-courses"
                        variant="ghost"
                        icon={HeartIcon}
                      >
                        Saved courses
                      </ButtonLink>

                      <ButtonLink
                        href="/settings"
                        variant="ghost"
                        icon={WrenchScrewdriverIcon}
                      >
                        Settings
                      </ButtonLink>

                      <Button
                        onClick={() => auth.signOut()}
                        variant="ghost"
                        icon={ArrowLeftOnRectangleIcon}
                        className="mt-6"
                      >
                        Sign out
                      </Button>
                    </>
                  ) : (
                    links.map(link => (
                      <ButtonLink
                        variant="ghost"
                        size="base"
                        href={link.href}
                        key={link.name}
                      >
                        {link.name}
                      </ButtonLink>
                    ))
                  )}
                </nav>
              </div>
            </div>

            {!user && (
              <div className="flex flex-col px-5 pt-6 gap-y-1">
                <ButtonLink href="/auth/signup">Sign up</ButtonLink>

                <ButtonLink intent="secondary" href="/auth/signin">
                  Sign in
                </ButtonLink>
              </div>
            )}
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  )
}
