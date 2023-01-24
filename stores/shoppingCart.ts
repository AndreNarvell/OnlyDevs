import { create } from "zustand"
import { persist } from "zustand/middleware"
import { getCoursesInCart } from "../models/courses"
import { Course } from "../types/Course"

interface ShoppingCart {
  cartItems: string[]
  enrichedCartItems: Course[]
  addToCart: (id: string) => void
  removeFromCart: (id: string) => void
  clearCart: () => void
  refreshCourseData: () => void
}

export const useShoppingCart = create(
  persist<ShoppingCart>(
    (set, get) => ({
      cartItems: [],
      enrichedCartItems: [],

      addToCart: async (id: string) => {
        set(prev => {
          const exists = prev.cartItems.find(item => item === id)
          if (exists) return prev

          return {
            ...prev,
            cartItems: [...prev.cartItems, id],
          }
        })

        const courses = await getCoursesInCart(get().cartItems)

        if (courses) {
          set(prev => {
            return {
              ...prev,
              enrichedCartItems: courses,
            }
          })
        }
      },

      refreshCourseData: async () => {
        const courses = await getCoursesInCart(get().cartItems)

        if (courses) {
          set(prev => {
            return {
              ...prev,
              enrichedCartItems: courses,
            }
          })
        }
      },

      removeFromCart: async (id: string) => {
        set(prev => ({
          ...prev,
          cartItems: prev.cartItems.filter(item => item !== id),
          enrichedCartItems: prev.enrichedCartItems.filter(
            item => item.id !== id
          ),
        }))

        const courses = await getCoursesInCart(get().cartItems)

        set(prev => {
          return {
            ...prev,
            enrichedCartItems: courses,
          }
        })
      },

      clearCart: () => {
        set(prev => ({
          ...prev,
          cartItems: [],
          enrichedCartItems: [],
        }))
      },
    }),
    { name: "shopping-cart" }
  )
)
