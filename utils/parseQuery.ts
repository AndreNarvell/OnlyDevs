/**
 * Used for when supabaes redirects to a page with a query string attached
 */
export const parseQuery = (remove: string, asPath: string) => {
  const trimmed = asPath.replace(remove, "")
  return new URLSearchParams(trimmed)
}
