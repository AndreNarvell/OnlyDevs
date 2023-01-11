import { FC, ReactNode } from "react"
import { Layout } from "../components/Layout"
import { Button } from "../components/Button"
import { Text } from "../components/Text"
import {
  ArrowPathRoundedSquareIcon,
  BuildingLibraryIcon,
  SpeakerWaveIcon,
  WrenchScrewdriverIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline"

const DesignSystemPage = () => {
  return (
    <Layout>
      <Text
        as="h2"
        size="2xl"
        weight="bold"
        className="mt-16 mb-6 underline decoration-accents-2 underline-offset-8"
      >
        Buttons
      </Text>

      <Section title="Default">
        <div className="flex gap-x-4">
          <Button>Sign up</Button>
          <Button intent="secondary">Sign up</Button>
          <Button intent="success">Sign up</Button>
          <Button intent="error">Sign up</Button>
        </div>
      </Section>

      <Section title="Sizes">
        <div className="flex gap-x-4">
          <Button size="large">Large</Button>
          <Button>Base</Button>
          <Button size="small">Small</Button>
        </div>
      </Section>

      <Section title="Variant: Ghost">
        <div className="flex gap-x-4">
          <Button intent="primary" variant="ghost">
            Sign up
          </Button>
          <Button intent="secondary" variant="ghost">
            Sign up
          </Button>
          <Button intent="success" variant="ghost">
            Sign up
          </Button>
          <Button intent="error" variant="ghost">
            Sign up
          </Button>
        </div>
      </Section>

      <Section title="Icon">
        <div className="flex gap-x-4">
          <Button intent="primary" icon={ArrowPathRoundedSquareIcon} />
          <Button intent="secondary" icon={BuildingLibraryIcon} />
          <Button intent="success" icon={WrenchScrewdriverIcon} />
          <Button intent="error" icon={SpeakerWaveIcon} />
        </div>
      </Section>

      <Section title="Icon sizes">
        <div className="flex gap-x-4">
          <Button size="small" icon={SpeakerWaveIcon} />
          <Button icon={SpeakerWaveIcon} />
          <Button size="large" icon={SpeakerWaveIcon} />
        </div>
      </Section>
    </Layout>
  )
}

export default DesignSystemPage

interface SectionProps {
  title: string
  children: ReactNode
}
const Section: FC<SectionProps> = ({ title, children }) => {
  return (
    <div className="mb-12">
      <Text as="h3" size="lg" weight="semibold" className="mb-4">
        {title}
      </Text>

      <div className="p-4 border rounded-base border-accents-2">{children}</div>
    </div>
  )
}
