import { RefObject } from "react"
import { create } from "zustand"

interface GlobalState {
  shoppingCartButtonRef: RefObject<HTMLButtonElement> | undefined
  setShoppingCartButtonRef: (ref: RefObject<HTMLButtonElement>) => void
}

export const useGlobalState = create<GlobalState>(set => ({
  shoppingCartButtonRef: undefined,

  setShoppingCartButtonRef: ref =>
    set(prev => ({
      ...prev,
      shoppingCartButtonRef: ref,
    })),
}))
