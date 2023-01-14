import { useRouter } from "next/router"
import { ChangeEvent, useCallback, useEffect, useState } from "react"
import {
  parseCategories,
  serialiseCategories,
  setCategory,
} from "../utils/filter"

export const useCategories = () => {
  const [activeCategories, setActiveCategories] = useState<number[]>([])
  const router = useRouter()

  useEffect(() => {
    if (typeof router.query.categories === "string") {
      setActiveCategories(parseCategories(router.query.categories))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleCategoryChange = useCallback(
    async (e: ChangeEvent<HTMLInputElement>, id: number) => {
      const newArray = setCategory(id, e.target.checked, activeCategories)

      const { categories: _categories, ...query } = router.query
      setActiveCategories(newArray)
      router.push(
        {
          pathname: "/courses",
          query:
            activeCategories.length === 0
              ? { ...query }
              : { ...query, categories: serialiseCategories(newArray) },
        },
        undefined,
        { shallow: true }
      )
    },
    [router, activeCategories]
  )

  const clearCategories = () => {
    setActiveCategories([])

    const { categories: _categories, ...query } = router.query

    router.push(
      {
        pathname: "/courses",
        query: {
          ...query,
          // categories: "[]",
        },
      },
      undefined,
      { shallow: true }
    )
  }

  return {
    activeCategories,
    handleCategoryChange,
    clearCategories,
  }
}
