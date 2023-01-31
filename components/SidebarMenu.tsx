import { plusJakartaSans } from "../pages/_app"
import { Text } from "./Text"
import { Dialog, Transition } from "@headlessui/react"
import { FC, Fragment, ReactNode } from "react"

interface Props {
  open: boolean
  onClose: () => void
  title?: string
  middle?: ReactNode
  bottom?: ReactNode
}

export const SidebarMenu: FC<Props> = ({
  open,
  onClose,
  title = "Untitled sidebar",
  middle,
  bottom,
}) => {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        onClose={onClose}
        className={`relative ${plusJakartaSans.className}`}
      >
        {({ open }) => (
          <>
            <Transition.Child
              as={Fragment}
              enter="ease-in-out duration-500"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in-out duration-500"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 transition-opacity bg-background/50" />
            </Transition.Child>
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-in-out duration-500"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in-out duration-500"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <Dialog.Panel className="fixed top-0 right-0 z-30 h-screen pt-20 pb-16 bg-accents-1/80 backdrop-blur-2xl min-w-[50%]">
                <div className="flex flex-col justify-between h-full">
                  <div className="px-4 pb-4 border-b border-foreground/20">
                    <Text as="h3" size="xl" weight="bold">
                      {title}
                    </Text>
                  </div>
                  <div className="h-full">{middle}</div>

                  <div className="flex flex-col items-end gap-2 px-2 pt-2 border-t border-foreground/20">
                    {bottom}
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </>
        )}
      </Dialog>
    </Transition.Root>
  )
}
