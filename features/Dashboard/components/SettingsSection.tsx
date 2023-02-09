import { Button } from "../../../components/Button"
import { Text } from "../../../components/Text"
import { FC, ReactNode } from "react"
import { UseFormProps } from "react-hook-form"
import { useForm } from "react-hook-form"
import { UseFormRegister } from "react-hook-form/dist/types/form"

interface SettingsSectionProps {
  children: ({ register }: { register: UseFormRegister<any> }) => ReactNode
  title: string
  description: string

  formProps?: UseFormProps
  onSubmit: (data: any) => void
}

export const SettingsSection: FC<SettingsSectionProps> = ({
  children,
  title,
  description,
  formProps,
  onSubmit,
}) => {
  const { handleSubmit, register } = useForm(formProps)

  return (
    <section className="p-8 pt-6 mb-16 border border-accents-2 rounded-base">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Text as="h3" size="lg" weight="bold">
          {title}
        </Text>
        <Text as="p" intent="secondary" className="mb-4">
          {description}
        </Text>

        {children({ register })}

        <Button type="submit">Save</Button>
      </form>
    </section>
  )
}
