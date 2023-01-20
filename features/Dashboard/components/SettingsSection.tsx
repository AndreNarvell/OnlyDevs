import { FC, ReactNode } from "react"
import { Text } from "../../../components/Text"

interface SettingsSectionProps {
  children: ReactNode
  title: string
  description: string
}

export const SettingsSection: FC<SettingsSectionProps> = ({
  children,
  title,
  description,
}) => {
  return (
    <section className="p-8 pt-6 mb-16 border border-accents-2 rounded-base">
      <Text as="h3" size="lg" weight="bold" className="mb-4">
        {title}
      </Text>
      <Text as="p" className="mb-4">
        {description}
      </Text>

      {children}
    </section>
  )
}
