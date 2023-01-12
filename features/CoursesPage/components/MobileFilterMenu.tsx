import {
  AdjustmentsHorizontalIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline"
import { useRouter } from "next/router"
import { ChangeEvent, FC, useCallback, useEffect, useState } from "react"
import { Button } from "../../../components/Button"
import { Checkbox } from "../../../components/Checkbox"
import { SidebarMenu } from "../../../components/SidebarMenu"
import { Text } from "../../../components/Text"
import { Category } from "../../../types/Category"
import {
  parseCategories,
  serialiseCategories,
  setCategory,
} from "../utils/filter"

interface Props {
  categories: Category[]
}

export const MobileFilterMenu: FC<Props> = ({ categories }) => {
  const [open, setOpen] = useState(false)
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

  const clearFilters = () => {
    setActiveCategories([])
    router.push(
      {
        pathname: "/courses",
        query: {
          ...router.query,
          categories: "[]",
        },
      },
      undefined,
      { shallow: true }
    )
  }

  return (
    <>
      <Button
        className="fixed z-10 bottom-16 right-4"
        icon={AdjustmentsHorizontalIcon}
        onClick={() => setOpen(true)}
      >
        <span className="w-12 text-center">Filters</span>
        <Text
          as="span"
          size="xs"
          weight="bold"
          className="flex items-center justify-center w-6 h-6 rounded-full bg-accents-7 text-background"
        >
          1
        </Text>
      </Button>

      <SidebarMenu
        open={open}
        onClose={() => setOpen(false)}
        title="Categories"
        bottom={
          <>
            <Button
              onClick={clearFilters}
              intent="secondary"
              fullWidth
              icon={TrashIcon}
            >
              Clear filters
            </Button>

            <Button
              onClick={() => setOpen(open => false)}
              fullWidth
              icon={XMarkIcon}
            >
              Close
            </Button>
          </>
        }
        middle={categories.map(category => (
          <FilterItem
            label={category.title}
            name={String(category.id)}
            id={String(category.id)}
            formPrefix="category."
            checked={activeCategories.includes(category.id)}
            onChange={e => handleCategoryChange(e, category.id)}
            key={category.id}
          />
        ))}
      />
    </>
  )
}

interface FilterItemProps {
  label: string
  id: string
  name: string
  formPrefix?: string
  checked: boolean
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
}

export const FilterItem: FC<FilterItemProps> = ({
  label,
  id,
  formPrefix,
  checked,
  onChange,
}) => {
  return (
    <li className="list-none">
      <label
        htmlFor={formPrefix + id}
        className="block px-4 py-3 transition border-b cursor-pointer hover:bg-accents-4/10 hover:transition-none border-foreground/20"
      >
        <Checkbox
          label={label}
          id={formPrefix + id}
          name={formPrefix + id}
          checked={checked}
          onChange={onChange}
        />
      </label>
    </li>
  )
}
