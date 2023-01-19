import { useShoppingCart } from "../stores/shoppingCart"

export const goToCheckout = async () => {
  const cartItems = useShoppingCart.getState().cartItems

  const response = await fetch("/api/checkout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ cartItems }),
    redirect: "follow",
  })

  if (!response.ok) {
    throw new Error("Something went wrong")
  }

  const url = await response.json()

  console.log(url)

  window.location = url
}
