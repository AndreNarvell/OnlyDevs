import {
  BasicPopover,
  BasicPopoverDivider,
} from "../../../components/BasicPopover"
import { Button } from "../../../components/Button"
import { Text } from "../../../components/Text"
import { useGlobalState } from "../../../stores/globalState"
import { useShoppingCart } from "../../../stores/shoppingCart"
import { formatPrice } from "../../../utils/formatPrice"
import { goToCheckout } from "../../../utils/goToCheckout"
import { CartItem } from "./CartItem"
import { FaceFrownIcon, ShoppingCartIcon } from "@heroicons/react/24/outline"
import { ShoppingCartIcon as ShoppingCartIconSolid } from "@heroicons/react/24/solid"
import { useRouter } from "next/router"
import { useEffect, useRef, useState } from "react"

export const ShoppingCart = () => {
  const [show, setShow] = useState(false)
  const { asPath } = useRouter()

  useEffect(() => {
    setShow(true)
  }, [])

  const { cartItems, enrichedCartItems } = useShoppingCart(state => ({
    cartItems: state.cartItems,
    enrichedCartItems: state.enrichedCartItems,
  }))

  const setShoppingCartButtonRef = useGlobalState(
    state => state.setShoppingCartButtonRef
  )

  const buttonRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    setShoppingCartButtonRef(buttonRef)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const totalPrice = enrichedCartItems.reduce((previousValue, cartItem) => {
    return previousValue + cartItem.price
  }, 0)

  const isEmpty = cartItems.length === 0

  if (!show) return <div className="w-8 h-8" />

  return (
    <BasicPopover
      button={
        <button
          ref={buttonRef}
          aria-label="Your profile"
          className="flex items-center justify-end w-8 h-8 rounded-full focus-visible:ring-2 focus:ring-offset-1 focus:ring-offset-background"
        >
          {!isEmpty && (
            <Text as="span" size="sm" weight="semibold" className="mr-1">
              {cartItems.length}
            </Text>
          )}
          {!isEmpty ? (
            <ShoppingCartIconSolid className="flex-shrink-0 w-6 h-6" />
          ) : (
            <ShoppingCartIcon className="flex-shrink-0 w-6 h-6" />
          )}
        </button>
      }
    >
      <div className="flex flex-col gap-2 w-80">
        {enrichedCartItems.map(course => (
          <CartItem key={course.id} course={course} />
        ))}

        {isEmpty && (
          <div className="flex flex-col items-center justify-center w-full p-4 border gap-y-4 border-accents-2 rounded-marketing">
            <Text as="p">
              Oops, looks like your cart is empty! Please add a course to the
              cart so that we can buy some food...
            </Text>
            <FaceFrownIcon className="flex-shrink-0 w-10 h-10 text-secondary" />
          </div>
        )}

        {!isEmpty && (
          <>
            <BasicPopoverDivider />

            <Text
              as="p"
              weight="semibold"
              tracking="wide"
              size="lg"
              className="flex items-center justify-center my-2"
            >
              Total: {formatPrice(totalPrice)}
            </Text>

            <Button onClick={() => goToCheckout(cartItems, asPath)} fullWidth>
              Go to checkout
            </Button>
          </>
        )}
      </div>
    </BasicPopover>
  )
}
