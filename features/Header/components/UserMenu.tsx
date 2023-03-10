import { BasicMenu, BasicMenuDivider } from "../../../components/BasicMenu"
import { Button, ButtonLink } from "../../../components/Button"
import { Text } from "../../../components/Text"
import { useUser } from "../../../hooks/useUser"
import { Menu } from "@headlessui/react"
import {
  ArrowLeftOnRectangleIcon,
  BookOpenIcon,
  HeartIcon,
  IdentificationIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline"
import {
  useSession,
  useSupabaseClient,
  useUser as useUser2,
} from "@supabase/auth-helpers-react"
import clsx from "clsx"

export const UserMenu = () => {
  const { auth } = useSupabaseClient()
  const session = useSession()
  const user = session!.user
  const { profile, error } = useUser()

  const first = useUser2()

  console.log(session, first)

  const username =
    profile?.name ?? user.user_metadata.full_name ?? user.user_metadata.name

  return (
    <BasicMenu
      button={
        <button
          aria-label="Your profile"
          className="flex items-center justify-center w-8 h-8 rounded-full bg-success focus-visible:ring-2 focus:ring-offset-1 focus:ring-offset-background"
        >
          {username.slice(0, 1)}
        </button>
      }
    >
      <Text as="p" align="center" className="mt-6 mb-4">
        {username}
      </Text>

      <BasicMenuDivider />

      <Menu.Item>
        {({ active }) => (
          <ButtonLink
            href="/dashboard"
            variant="ghost"
            align="left"
            icon={BookOpenIcon}
            className={clsx("hover:bg-success/100", active && "bg-success/100")}
          >
            My courses
          </ButtonLink>
        )}
      </Menu.Item>

      <Menu.Item>
        {({ active }) => (
          <ButtonLink
            href="/saved-courses"
            variant="ghost"
            align="left"
            icon={HeartIcon}
            className={clsx("hover:bg-success/100", active && "bg-success/100")}
          >
            Saved courses
          </ButtonLink>
        )}
      </Menu.Item>

      <Menu.Item>
        {({ active }) => (
          <ButtonLink
            href="/become-a-teacher"
            variant="ghost"
            align="left"
            icon={IdentificationIcon}
            className={clsx("hover:bg-success/100", active && "bg-success/100")}
          >
            Become a teacher
          </ButtonLink>
        )}
      </Menu.Item>

      <Menu.Item>
        {({ active }) => (
          <ButtonLink
            href="/settings"
            variant="ghost"
            align="left"
            icon={WrenchScrewdriverIcon}
            className={clsx("hover:bg-success/100", active && "bg-success/100")}
          >
            Settings
          </ButtonLink>
        )}
      </Menu.Item>

      <BasicMenuDivider />

      <Menu.Item>
        {({ active }) => (
          <Button
            onClick={() => auth.signOut()}
            variant="ghost"
            align="left"
            icon={ArrowLeftOnRectangleIcon}
            className={clsx("hover:bg-error/100", active && "bg-error/100")}
          >
            Sign out
          </Button>
        )}
      </Menu.Item>
    </BasicMenu>
  )
}
