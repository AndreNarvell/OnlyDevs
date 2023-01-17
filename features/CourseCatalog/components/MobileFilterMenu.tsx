import {
  AdjustmentsHorizontalIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline"
import clsx from "clsx"
import { ChangeEvent, FC, useState } from "react"
import { Button } from "../../../components/Button"
import { Checkbox } from "../../../components/Checkbox"
import { SidebarMenu } from "../../../components/SidebarMenu"
import { Text } from "../../../components/Text"
import { Category } from "../../../types/Category"
import { useCategories } from "../hooks/useCategories"

interface Props {
  categories: Category[]
}

export const MobileFilterMenu: FC<Props> = ({ categories }) => {
  const [open, setOpen] = useState(false)

  const { activeCategories, handleCategoryChange, clearCategories } =
    useCategories()

  return (
    <>
      <Button
        className="fixed z-10 bottom-16 right-4 lg:hidden"
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
              onClick={clearCategories}
              intent="secondary"
              fullWidth
              icon={TrashIcon}
            >
              Clear filters
            </Button>

            <Button onClick={() => setOpen(false)} fullWidth icon={XMarkIcon}>
              Close
            </Button>
          </>
        }
        middle={categories.map(category => (
          <FilterItem
            label={category.title}
            name={String(category.id)}
            id={String(category.id)}
            formPrefix="mobile.category."
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
  noBorder?: boolean
}

export const FilterItem: FC<FilterItemProps> = ({
  label,
  id,
  formPrefix,
  checked,
  onChange,
  noBorder,
}) => {
  return (
    <li className="list-none">
      <label
        htmlFor={formPrefix + id}
        className={clsx(
          "block px-4 py-3 transition cursor-pointer hover:bg-accents-4/10 hover:transition-none border-foreground/20",
          !noBorder && "border-b"
        )}
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
