import { Text } from "../../../components/Text"
import { TextLink } from "../../../components/TextLink"
import { useGlobalState } from "../../../stores/globalState"
import { useShoppingCart } from "../../../stores/shoppingCart"
import { Course } from "../../../types/Course"
import { formatPrice } from "../../../utils/formatPrice"
import { getImageUrl } from "../../../utils/getImageUrl"
import Image from "next/image"
import Link from "next/link"
import { FC } from "react"

interface Props {
  course: Course
}

export const CartItem: FC<Props> = ({ course }) => {
  const shoppingCartButtonRef = useGlobalState(
    state => state.shoppingCartButtonRef
  )

  const removeFromCart = useShoppingCart(state => state.removeFromCart)

  return (
    <div className="flex items-center w-full p-4 border border-accents-2 rounded-marketing">
      <div className="">
        <Link
          href={{
            pathname: "/courses/[slug]",
            query: { slug: course.slug },
          }}
          onClick={() => shoppingCartButtonRef?.current?.click()}
        >
          <Image
            alt={`Icon for ${course.title}`}
            src={getImageUrl("course-icons", course.id)}
            width={64}
            height={64}
            className="w-16 rounded-full"
          />
        </Link>
      </div>

      <div className="flex justify-between w-full gap-x-4">
        <TextLink
          href={{
            pathname: "/courses/[slug]",
            query: { slug: course.slug },
          }}
          onClick={() => shoppingCartButtonRef?.current?.click()}
          size="sm"
          className="pl-2 line-clamp-2"
          weight="semibold"
        >
          {course.title}
        </TextLink>

        <div>
          <Text as="p" size="sm" weight="bold">
            {formatPrice(course.price)}
          </Text>

          <button
            onClick={() => removeFromCart(course.id)}
            className="text-sm transition text-accents-5 hover:text-error"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  )
}
