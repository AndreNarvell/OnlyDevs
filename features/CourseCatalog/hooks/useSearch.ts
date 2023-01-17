import { useRouter } from "next/router"
import { ChangeEvent, useEffect, useState } from "react"

export const useSearch = () => {
  const [search, setSearch] = useState("")
  const router = useRouter()

  useEffect(() => {
    if (typeof router.query.search === "string") {
      setSearch(router.query.search)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value

    const { search: _search, ...query } = router.query

    setSearch(value)

    router.push(
      {
        pathname: "/courses",
        query: value === "" ? { ...query } : { ...query, search: value.trim() },
      },
      undefined,
      { shallow: true }
    )
  }

  return {
    search,
    handleSearchChange,
  }
}
