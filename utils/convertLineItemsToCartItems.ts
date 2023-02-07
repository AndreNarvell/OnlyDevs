import Stripe from "stripe"

export const convertLineItemsToCartItems = (
  lineItems: Stripe.LineItem[]
): string[] => {
  return lineItems
    .map(item => {
      if (
        item.price === null ||
        item.price.product === undefined ||
        typeof item.price.product === "string" ||
        item.price.product.deleted === true ||
        item.price.product.metadata.course_id === undefined
      ) {
        return undefined
      }

      return item.price.product.metadata.course_id
    })
    .filter((item): item is string => item !== undefined)
}
