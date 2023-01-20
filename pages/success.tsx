import { GetServerSideProps, NextPage } from "next"
import Image from "next/image"
import Link from "next/link"
import Stripe from "stripe"
import { ButtonLink } from "../components/Button"
import { Layout } from "../components/layouts/Layout"
import { Text } from "../components/Text"
import { TextLink } from "../components/TextLink"
import { stripe } from "../lib/stripe"
import type { Course } from "../types/Course"
import { formatPrice } from "../utils/formatPrice"
import { motion } from "framer-motion"
import { useCallback, useEffect, useRef, useState } from "react"
import ReactCanvasConfetti from "react-canvas-confetti"

interface Props {
  lineItems: Stripe.LineItem[]
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

const SuccessPage: NextPage<Props> = ({ lineItems }) => {
  const refAnimationInstance = useRef(null)

  const getInstance = useCallback(instance => {
    refAnimationInstance.current = instance
  }, [])

  const makeShot = useCallback((particleRatio, opts) => {
    refAnimationInstance.current &&
      refAnimationInstance.current({
        ...opts,
        origin: { y: 0.7 },
        particleCount: Math.floor(200 * particleRatio),
      })
  }, [])

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
    setTimeout(() => {
      fire()
    }, 100)
  }, [])

  return (
    <Layout>
      <ReactCanvasConfetti
        refConfetti={getInstance}
        className="fixed inset-0 w-full h-full pointer-events-none"
      />
      <div className="flex justify-between w-full gap-16 mt-32">
        <motion.section className="flex-shrink-0 mb-12 w-80">
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
            {lineItems.map(lineItem => (
              <Course
                title={lineItem.description}
                icon="https://unsplash.it/123/123"
                price={lineItem.amount_total}
                slug={lineItem.description}
                key={lineItem.id}
              />
            ))}
            {lineItems.map(lineItem => (
              <Course
                title={lineItem.description}
                icon="https://unsplash.it/123/123"
                price={lineItem.amount_total}
                slug={lineItem.description}
                key={lineItem.id}
              />
            ))}
            {lineItems.map(lineItem => (
              <Course
                title={lineItem.description}
                icon="https://unsplash.it/123/123"
                price={lineItem.amount_total}
                slug={lineItem.description}
                key={lineItem.id}
              />
            ))}
          </motion.ul>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 128 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", mass: 0.5, damping: 3, stiffness: 10 }}
          className="z-10 flex flex-col items-center w-full gap-4 rounded-marketing"
        >
          <Text as="h1" size="3xl" weight="bold" align="center">
            You did dit!
          </Text>

          <Text as="p" align="center" intent="secondary">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim
            ratione non consequatur possimus, in expedita, iste quas odit est
            quidem vel illum officia reiciendis. Cupiditate reiciendis explicabo
            a! Quo, ducimus!
          </Text>

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
  )
}

const Course = ({
  title,
  icon,
  price,
  slug,
}: {
  title: string
  price: number
  icon: string
  slug: string
}) => {
  return (
    <motion.li
      variants={item}
      className="flex items-center p-4 border bg-accents-1 border-accents-2 rounded-marketing"
    >
      <div className="">
        <Link
          href={{
            pathname: "/courses/[slug]",
            query: { slug: slug },
          }}
        >
          <Image
            alt={`Icon for ${title}`}
            src={icon}
            width={48}
            height={48}
            className="w-12 rounded-full"
          />
        </Link>
      </div>

      <div className="flex justify-between w-full gap-x-4">
        <TextLink
          href={{
            pathname: "/courses/[slug]",
            query: { slug: slug },
          }}
          size="sm"
          className="pl-2 line-clamp-2"
          weight="semibold"
        >
          {title}
        </TextLink>

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
      { limit: 100 }
    )

    return {
      props: {
        lineItems: lineItems.data,
      },
    }
  } catch (error) {
    console.log(error)

    return {
      props: {
        lineItems: [],
      },
    }
  }
}
