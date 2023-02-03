import { GetServerSidePropsContext } from "next"

export const validateQuery = (
  ctx: GetServerSidePropsContext,
  queryKeys: string[],
  redirectUrl: string
):
  | [values: string[], redirect: undefined]
  | [
      values: undefined,
      redirect: {
        redirect: {
          destination: string
          permanent: false
        }
      }
    ] => {
  const { query } = ctx

  const values = queryKeys.map(key => query[key])

  if (values.some(value => value === undefined)) {
    return [
      undefined,
      {
        redirect: {
          destination: redirectUrl,
          permanent: false,
        },
      },
    ]
  }

  // Check if type of value is not string and remove it + type assert
  const filteredValues = values.filter(
    (value): value is string => typeof value === "string"
  )

  return [filteredValues, undefined]
}
