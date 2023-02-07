import { ButtonLink } from "../components/Button"
import { Meta } from "../components/Meta"
import { Text } from "../components/Text"
import { Layout } from "../components/layouts/Layout"
import { stripe } from "../lib/stripe"
import { supabase } from "../lib/supabase"
import { useShoppingCart } from "../stores/shoppingCart"
import type { Course as ICourse } from "../types/Course"
import { convertLineItemsToCartItems } from "../utils/convertLineItemsToCartItems"
import { formatPrice } from "../utils/formatPrice"
import { motion } from "framer-motion"
import { GetServerSideProps, NextPage } from "next"
import Image from "next/image"
import { useCallback, useEffect, useRef } from "react"
import ReactCanvasConfetti from "react-canvas-confetti"
import Balancer from "react-wrap-balancer"

interface Props {
  courses: ICourse[]
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      delayChildren: 1,
      staggerChildren: 0.25,
    },
  },
}

const item = {
  hidden: { opacity: 0, x: -100, transition: { duration: 0.5 } },
  show: { opacity: 1, x: 0, transition: { duration: 0.5 } },
}

const SuccessPage: NextPage<Props> = ({ courses }) => {
  const refAnimationInstance = useRef(null)

  console.log(courses)

  // @ts-ignore
  const getInstance = useCallback(instance => {
    refAnimationInstance.current = instance
  }, [])

  // @ts-ignore
  const makeShot = useCallback((particleRatio, opts) => {
    refAnimationInstance.current &&
      // @ts-ignore
      refAnimationInstance.current({
        ...opts,
        origin: { y: 0.7 },
        particleCount: Math.floor(200 * particleRatio),
      })
  }, [])

  const clearCart = useShoppingCart(state => state.clearCart)

  const fire = useCallback(() => {
    makeShot(0.25, {
      spread: 26,
      startVelocity: 55,
    })

    makeShot(0.2, {
      spread: 60,
    })

    makeShot(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    })

    makeShot(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    })

    makeShot(0.1, {
      spread: 120,
      startVelocity: 45,
    })
  }, [makeShot])

  useEffect(() => {
    if (courses.length > 0) {
      clearCart()
    }

    setTimeout(() => {
      fire()
    }, 100)
  }, [courses, fire, clearCart])

  return (
    <>
      <Meta title="Order confirmation" noIndex />

      <Layout background="accents-1">
        <ReactCanvasConfetti
          refConfetti={getInstance}
          className="fixed inset-0 w-full h-full pointer-events-none"
        />
        <div className="w-full gap-16 px-6 mt-10 md:flex md:justify-between md:mt-32 sm:px-28 md:px-10">
          <motion.section className="mb-12 md:flex-shrink-0 md:w-80">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Text as="h1" align="center" weight="bold" className="mb-4">
                Your new courses:
              </Text>
            </motion.div>

            <motion.ul
              variants={container}
              initial="hidden"
              animate="show"
              className="flex flex-col gap-4"
            >
              {courses.map(course => (
                <Course
                  title={course.title}
                  icon={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/course-icons/${course.id}`}
                  price={course.price}
                  key={course.id}
                />
              ))}
            </motion.ul>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 128 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: "spring",
              mass: 0.5,
              damping: 3,
              stiffness: 10,
            }}
            className="z-10 flex flex-col items-center w-full gap-4 rounded-marketing"
          >
            <Text as="h1" size="3xl" weight="bold" align="center">
              You did it!
            </Text>
            <Balancer>
              <Text as="p" align="center" intent="secondary">
                Congratulations! You just purchased a course. Head over to
                &quot;My courses&quot; to start your new journey to become the
                best you you can be!
              </Text>
            </Balancer>

            <ButtonLink
              href="/dashboard"
              size="large"
              intent="success"
              className="w-max"
            >
              Go to my courses
            </ButtonLink>
          </motion.section>
        </div>
      </Layout>
    </>
  )
}

const Course = ({
  title,
  icon,
  price,
}: {
  title: string
  price: number
  icon: string
}) => {
  return (
    <motion.li
      variants={item}
      className="flex items-center p-4 border bg-accents-1 border-accents-2 rounded-marketing"
    >
      <div className="flex justify-between w-full gap-x-4">
        <div className="w-10 h-10 rounded-full shrink-0">
          <Image
            alt={`Icon for ${title}`}
            src={icon}
            width={48}
            height={48}
            className="w-10 h-10 rounded-full shrink-0"
          />
        </div>

        <Text
          as="p"
          size="sm"
          className="whitespace-pre-line line-clamp-2 shrink grow-0"
          weight="semibold"
        >
          {title}
        </Text>

        <div>
          <Text as="p" size="sm" weight="bold">
            {formatPrice(price)}
          </Text>
        </div>
      </div>
    </motion.li>
  )
}

export default SuccessPage

export const getServerSideProps: GetServerSideProps = async context => {
  try {
    const { query } = context
    const checkoutSessionId = query.checkoutSessionId

    if (typeof checkoutSessionId !== "string") {
      return {
        props: {
          lineItems: [],
        },
      }
    }

    const lineItems = await stripe.checkout.sessions.listLineItems(
      checkoutSessionId,
      { limit: 100, expand: ["data.price", "data.price.product"] }
    )

    const cartItems = convertLineItemsToCartItems(lineItems.data)

    const { data: courses } = await supabase
      .from("courses")
      .select("*")
      .in("id", cartItems)

    return {
      props: {
        courses,
      },
    }
  } catch (error) {
    console.log(error)

    return {
      props: {
        courses: [],
      },
    }
  }
}
