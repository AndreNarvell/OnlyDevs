export const goToCheckout = async (cartItems: string[], cancelUrl: string) => {
  console.log(cancelUrl)

  const response = await fetch("/api/checkout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ cartItems, cancelUrl }),
    redirect: "follow",
  })

  if (!response.ok) {
    throw new Error("Error while creating checkout session")
  }

  const url = await response.json()

  console.log(url)

  window.location = url
}
