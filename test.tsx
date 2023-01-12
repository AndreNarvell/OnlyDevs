import { Dialog } from "@headlessui/react"
import { XMarkIcon } from "@heroicons/react/24/outline"

const SideBarShoppingCartMenu = () => {
  const open = true

  const setOpen = (open: boolean) => {}

  return (
    <Dialog as="div" className="relative z-40" open={open} onClose={setOpen}>
      {/* Overlay */}
      <div className="fixed inset-0 transition-opacity bg-mauve12/50" />

      {/*

        enterFrom="translate-x-full"
        enterTo="translate-x-0"
        leaveFrom="translate-x-0"
        leaveTo="translate-x-full"

      */}

      {/* Panel */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="fixed inset-y-0 right-0 flex max-w-full pl-10 pointer-events-none">
            <Dialog.Panel className="w-screen max-w-md pointer-events-auto">
              <div className="flex flex-col h-full overflow-y-scroll bg-white shadow-xl">
                <div className="flex-1 px-4 overflow-y-auto sm:px-6">
                  <div className="flex items-center justify-between h-16">
                    <Dialog.Title className="text-lg font-semibold">
                      Varukorg
                    </Dialog.Title>
                    <div className="flex items-center justify-center ml-3">
                      <button
                        type="button"
                        className="p-3 -m-2 rounded-full active:bg-mauve3"
                        onClick={() => setOpen(false)}
                      >
                        <span className="sr-only">Close panel</span>
                        <XMarkIcon className="w-6 h-6" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Dialog.Panel>
          </div>
        </div>
      </div>
    </Dialog>
  )
}
