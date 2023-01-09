import { Text } from "../../components/Text"
import { ButtonLink } from "../../components/Button"

export const HeroText = () => {
  return (
    <div className="mt-32">
      <div className="px-6">
        <Text
          size="3xl"
          weight="bold"
          tracking="wide"
          align="center"
          intent="primary"
          leading="tight"
        >
          A broad selection of courses
        </Text>
        <Text
          size="base"
          intent="secondary"
          align="center"
          leading="tight"
          tracking="wide"
          weight="medium"
          className="mt-2"
        >
          Choose from 213,000 online video courses with new additions published
          every month
        </Text>
      </div>
      <ButtonLink href="" size="large" className="w-full mt-8" fullWidth>
        Sign up for free
      </ButtonLink>
      <ButtonLink
        href=""
        intent="secondary"
        size="large"
        fullWidth
        className="w-full mt-4"
      >
        Browse courses
      </ButtonLink>
    </div>
  )
}
