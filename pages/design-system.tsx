import { FC, ReactNode } from "react"
import { Layout } from "../components/Layout"
import { Button } from "../components/Button"
import { Text } from "../components/Text"
import {
  ArrowDownTrayIcon,
  ArrowPathRoundedSquareIcon,
  BuildingLibraryIcon,
  MagnifyingGlassIcon,
  MagnifyingGlassMinusIcon,
  SpeakerWaveIcon,
  WrenchScrewdriverIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline"
import { ArrowDownTrayIcon as ArrowDownTrayIcon20 } from "@heroicons/react/20/solid"
import { Input } from "../components/Input"
import { Checkbox } from "../components/Checkbox"

const DesignSystemPage = () => {
  return (
    <Layout>
      <Text
        as="h2"
        size="2xl"
        weight="bold"
        className="mt-16 mb-6 underline decoration-accents-2 underline-offset-8"
      >
        Button
      </Text>

      <Section title="Intent">
        <div className="flex gap-x-4">
          <Button>Sign up</Button>
          <Button intent="secondary">Sign up</Button>
          <Button intent="success">Sign up</Button>
          <Button intent="error">Sign up</Button>
        </div>
      </Section>

      <Section title="Size">
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
          <Button intent="secondary" icon={ArrowDownTrayIcon}>
            Download
          </Button>
        </div>
      </Section>

      <Section title="Icon sizes">
        <div className="flex gap-x-4">
          <Button size="small" icon={SpeakerWaveIcon} />
          <Button icon={SpeakerWaveIcon} />
          <Button size="large" icon={SpeakerWaveIcon} />
          <Button size="large" intent="secondary" icon={ArrowDownTrayIcon}>
            Download
          </Button>
          <Button intent="secondary" icon={ArrowDownTrayIcon}>
            Download
          </Button>
          <Button size="small" intent="secondary" icon={ArrowDownTrayIcon20}>
            Download
          </Button>
        </div>
      </Section>

      <Text
        as="h2"
        size="2xl"
        weight="bold"
        className="mt-16 mb-6 underline decoration-accents-2 underline-offset-8"
      >
        Input
      </Text>

      <Section title="Examples">
        <div className="flex gap-x-4">
          <Input
            label="Email"
            name="email"
            placeholder="Email"
            value="john.doe@example.com"
            readOnly
          />
          <Input label="Email" name="email" placeholder="Email" />

          <Input
            label="Email"
            name="email"
            placeholder="Email"
            error="Invalid email"
            value="john.doe@example"
            readOnly
          />
          <Input
            label="Email"
            name="email"
            placeholder="Email"
            error="This field is required"
          />
        </div>
      </Section>

      <Section title="Size">
        <div className="flex gap-x-4">
          <Input label="Email" name="email" placeholder="Email" size="small" />
          <Input label="Email" name="email" placeholder="Email" />
          <Input label="Email" name="email" placeholder="Email" size="large" />
        </div>
      </Section>

      <Section title="Disabled">
        <div className="flex gap-x-4">
          <Input
            label="Disabled with placeholder"
            name="input-disabled-placeholder"
            disabled
          />
          <Input
            label="Disabled with value"
            name="input-disabled-value"
            value="Disabled with value"
            readOnly
            disabled
          />
        </div>
      </Section>

      <Section title="Show label">
        <div className="flex flex-col gap-4">
          <Input
            label="Email"
            name="email"
            id="input-label-email"
            type="email"
            value="john.doe@example.com"
            readOnly
            showLabel
          />
          <Input
            label="Password"
            name="password"
            id="input-label-password"
            type="password"
            value="12345678"
            readOnly
            showLabel
          />
        </div>
      </Section>

      <Text
        as="h2"
        size="2xl"
        weight="bold"
        className="mt-16 mb-6 underline decoration-accents-2 underline-offset-8"
      >
        Checkbox
      </Text>

      <Section title="Normal">
        <div className="flex flex-col gap-4">
          <Checkbox id="checkbox-1" label="Accept terms and conditions?" />
          <Checkbox
            id="checkbox-2"
            label="Accept terms and conditions?"
            defaultChecked
          />
        </div>
      </Section>

      <Section title="Error">
        <div className="flex flex-col gap-4">
          <Checkbox
            id="checkbox-3"
            label="Accept terms and conditions?"
            error="This field is required"
          />
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
