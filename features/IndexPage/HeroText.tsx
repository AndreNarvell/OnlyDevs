import { Text } from "../../components/Text"
import { ButtonLink } from "../../components/Button"
import { Slider } from "./SliderCloud"

export const HeroText = () => {
  return (
    <div className="z-10 md:px-16">
      <div className="px-8 md:mb-6">
        <Text
          size="3xl"
          weight="bold"
          tracking="wide"
          align="center"
          intent="primary"
          leading="tight"
          className="mb-4"
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
        >
          Choose from 213,000 online video courses with new additions published
          every month
        </Text>
      </div>

      <div className="mb-1 md:mb-0 md:hidden">
        <Slider rows={3} tagsPerRow={10} />
      </div>

      <ButtonLink href="" size="large" className="w-full" fullWidth>
        Sign up for free
      </ButtonLink>
      <ButtonLink
        href=""
        intent="secondary"
        size="large"
        fullWidth
        className="w-full mt-2"
      >
        Browse courses
      </ButtonLink>
    </div>
  )
}
