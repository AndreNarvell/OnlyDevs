const formatter = new Intl.NumberFormat("EN-us", {
  style: "currency",
  currency: "USD",
  useGrouping: true,
})

export const formatPrice = (price: number, quantityUnit?: string) =>
  !Number.isNaN(price)
    ? formatter
        .format(price / 100)
        .replace(",00", "")
        .concat(quantityUnit ? ` / ${quantityUnit}` : "")
    : "---"
