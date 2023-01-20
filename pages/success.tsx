import { GetServerSideProps, NextPage } from "next"
import Stripe from "stripe"
import { Button, ButtonLink } from "../components/Button"
import { Layout } from "../components/layouts/Layout"
import { Text } from "../components/Text"
import { stripe } from "../lib/stripe"
import { formatPrice } from "../utils/formatPrice"

interface Props {
  lineItems: Stripe.LineItem[]
}

const SuccessPage: NextPage<Props> = ({ lineItems }) => {
  return (
    <Layout>
      <Text as="h1" align="center" className="mt-16">
        You did it!
      </Text>

      <section className="mb-12">
        {lineItems.map(lineItem => (
          <div key={lineItem.id}>
            <Text as="h2" align="center" className="mt-16">
              {lineItem.description}
            </Text>
            <Text as="h3" align="center">
              {formatPrice(lineItem.amount_total)}
            </Text>
          </div>
        ))}
      </section>

      <ButtonLink
        href="/dashboard"
        size="large"
        intent="success"
        className="mx-auto w-max"
      >
        Go to my courses
      </ButtonLink>
    </Layout>
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
