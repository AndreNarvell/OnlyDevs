import { Input } from "./Input"
import { Text } from "./Text"
import { FieldError } from "./TextArea"
import { MinusCircleIcon, PlusCircleIcon } from "@heroicons/react/24/outline"
import { useFormContext, useFieldArray } from "react-hook-form"

interface Props {
  name: string
  label: string
  id?: string
  error?: string
}

export const ArrayInput = ({ name, id, label, error }: Props) => {
  const { register } = useFormContext()
  const { fields, append, remove } = useFieldArray({ name })

  return (
    <div>
      <label className="block mb-1" htmlFor={id}>
        <Text
          as="span"
          weight="medium"
          size="xs"
          intent={error ? "error" : "primary"}
        >
          {label}
        </Text>
      </label>

      {fields.map((field, index) => (
        <div className="flex mb-2 gap-x-1" key={field.id}>
          <Input
            fullWidth
            className="max-w-sm"
            label={`Row ${index + 1}`}
            {...register(`${name}.${index}`)}
          />

          <button
            onClick={() => remove(index)}
            type="button"
            className="flex mt-2 transition gap-x-1 hover:text-foreground text-secondary"
          >
            <MinusCircleIcon className="w-6 h-6" />
          </button>
        </div>
      ))}

      <button
        onClick={() => append("")}
        type="button"
        className="flex items-center mb-2 transition gap-x-2 hover:text-foreground text-secondary"
      >
        <PlusCircleIcon className="w-6 h-6" /> Add row
      </button>

      <FieldError error={error} />
    </div>
  )
}
