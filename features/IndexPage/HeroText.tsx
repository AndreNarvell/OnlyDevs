import { Text } from "../../components/Text"
import { ButtonLink } from "../../components/Button"
import { KeywordSlider } from "./KeywordSlider"

export const HeroText = () => {
  return (
    <div className="z-10 md:px-4 lg:px-16">
      <div className="px-4 md:mb-6">
        <Text
          size="3xl"
          weight="bold"
          tracking="wide"
          align="center"
          intent="primary"
          leading="tight"
          as="h1"
          className="mb-4"
        >
          A Broad Selection of Courses
        </Text>
        <Text
          as="p"
          size="base"
          intent="secondary"
          align="center"
          leading="tight"
          tracking="wide"
          className="mb-4"
        >
          Choose from 213,000 online video courses with new additions published
          every month
        </Text>
      </div>

      <div className="mb-4 md:mb-0 md:hidden">
        <KeywordSlider rows={3} tagsPerRow={10} />
      </div>

      <ButtonLink href="/auth/signup" size="large" className="w-full" fullWidth>
        Sign up for free
      </ButtonLink>
      <ButtonLink
        href="/courses"
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
