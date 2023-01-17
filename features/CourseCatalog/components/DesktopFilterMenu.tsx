import { FC } from "react"
import { Text } from "../../../components/Text"
import { Category } from "../../../types/Category"
import { useCategories } from "../hooks/useCategories"
import { FilterItem } from "./MobileFilterMenu"

interface Props {
  categories: Category[]
}

export const DesktopFilterMenu: FC<Props> = ({ categories }) => {
  const { activeCategories, handleCategoryChange } = useCategories()

  return (
    <div className="hidden mb-72 lg:block">
      <ul>
        <Text as="label" className="mb-2 ml-4">
          Categories
        </Text>

        {categories.map(category => (
          <FilterItem
            label={category.title}
            name={String(category.id)}
            id={String(category.id)}
            formPrefix="desktop.category."
            noBorder
            checked={activeCategories.includes(category.id)}
            onChange={e => handleCategoryChange(e, category.id)}
            key={category.id}
          />
        ))}
      </ul>
    </div>
  )
}
