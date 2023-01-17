import { ShoppingCartIcon } from "@heroicons/react/24/outline"
import { useSupabaseClient } from "@supabase/auth-helpers-react"
import { useEffect, useState } from "react"
import {
  BasicPopover,
  BasicPopoverDivider,
} from "../../../components/BasicPopover"
import { Button } from "../../../components/Button"
import { Course } from "../../../types/Course"
import { Database } from "../../../types/supabase"
import { CartItem } from "./CartItem"

export const ShoppingCart = () => {
  const supabase = useSupabaseClient<Database>()
  const [courses, setCourses] = useState<Course[]>([])

  useEffect(() => {
    supabase
      .from("courses")
      .select("*")
      .in("id", [
        "85baf646-27bd-464a-a6c1-39c873685d0a",
        "787598e6-fa0f-4d9a-9071-692497b73030",
      ])
      .then(({ data, error }) => {
        if (data) {
          console.log(data, error)
          setCourses(data)
        }
      })
  }, [])

  return (
    <BasicPopover
      button={
        <button
          aria-label="Your profile"
          className="flex items-center justify-center w-8 h-8 rounded-full focus-visible:ring-2 focus:ring-offset-1 focus:ring-offset-background"
        >
          <ShoppingCartIcon className="w-6 h-6" />
        </button>
      }
    >
      <CartItem />

      <BasicPopoverDivider />

      <Button>Go to checkout</Button>
    </BasicPopover>
  )
}
