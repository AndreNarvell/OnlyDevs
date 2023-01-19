import { Popover, Transition } from "@headlessui/react"
import { Fragment, MutableRefObject, ReactNode } from "react"

interface Props {
  children?:
    | React.ReactNode
    | ((bag: {
        open: boolean
        close: (
          focusableElement?: HTMLElement | MutableRefObject<HTMLElement | null>
        ) => void
      }) => React.ReactElement<any, string | React.JSXElementConstructor<any>>)
  button: ReactNode
}

export const BasicPopover = ({ children, button }: Props) => {
  return (
    <Popover as="div" className="relative">
      <Popover.Button as="div">{button}</Popover.Button>
      <Transition
        as={Fragment}
        enter="duration-200 ease-out"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="duration-100 ease-in"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <Popover.Overlay className="fixed inset-0 z-10 h-screen bg-background/30" />
      </Transition>

      <Transition
        as={Fragment}
        enter="duration-200 ease-out"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="duration-100 ease-in"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <Popover.Panel className="sm:absolute fixed left-1/2 sm:left-auto -translate-x-1/2 sm:translate-x-0 sm:right-0 z-10 flex flex-col min-w-[4rem] p-2 border top-16 sm:top-10 gap-y-2 border-accents-2 bg-accents-1 backdrop-blur-2xl rounded-base shadow-2xl">
          {children}
        </Popover.Panel>
      </Transition>
    </Popover>
  )
}

export const BasicPopoverDivider = () => <hr className="border-accents-2" />
