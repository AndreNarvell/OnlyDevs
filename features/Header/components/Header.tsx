import { Fragment } from "react"
import { Popover, Transition } from "@headlessui/react"
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline"
import { Button, ButtonLink } from "../../../components/Button"
import { Logo } from "../../../components/Logo"
import Link from "next/link"
import { TextLink } from "../../../components/TextLink"
import { Text } from "../../../components/Text"
import { useSession } from "@supabase/auth-helpers-react"
import { UserMenu } from "./UserMenu"
import { ShoppingCart } from "./ShoppingCart"

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
  const session = useSession()
  const user = session?.user

  return (
    <Popover>
      <div className="h-16" />
      <div className="fixed top-0 z-40 w-full border-b bg-background/50 border-accents-2 backdrop-blur-md">
        <div className="container w-full mx-auto">
          <div className="flex items-center justify-between h-16 px-6 md:justify-start md:space-x-10">
            <Link href="/" className="flex justify-start lg:w-0 lg:flex-1">
              <Logo />
            </Link>

            <Popover.Button
              as={Button}
              variant="ghost"
              icon={Bars3Icon}
              aria-label="Open menu"
              className="-my-2 -mr-2 md:hidden"
            />

            <nav className="hidden space-x-10 md:flex">
              {links.map(link => (
                <TextLink href={link.href} key={link.name} weight="medium">
                  {link.name}
                </TextLink>
              ))}
            </nav>

            <div className="items-center justify-end hidden gap-x-2 md:flex md:flex-1 lg:w-0">
              {user ? (
                <>
                  <ShoppingCart />
                  <UserMenu />
                </>
              ) : (
                <>
                  <ButtonLink href="/auth/signin" intent="secondary">
                    Sign in
                  </ButtonLink>

                  <ButtonLink href="/auth/signup" className="ml-4">
                    Sign up
                  </ButtonLink>
                </>
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
          <div className="border shadow-lg rounded-base border-accents-2">
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
                  {links.map(link => (
                    <ButtonLink
                      variant="ghost"
                      size="base"
                      fullWidth
                      href={link.href}
                      key={link.name}
                    >
                      {link.name}
                    </ButtonLink>
                  ))}
                </nav>
              </div>
            </div>

            <div className="px-5 py-6 space-y-6">
              <ButtonLink fullWidth href="/auth/signup">
                Sign up
              </ButtonLink>

              <Text as="span" weight="medium" align="center" className="mt-6">
                Existing customer?{" "}
                <TextLink intent="success" display="inline" href="/auth/signin">
                  Sign in
                </TextLink>
              </Text>
            </div>
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  )
}
