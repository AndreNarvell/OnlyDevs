import { ExclamationCircleIcon } from "@heroicons/react/20/solid"
import { cva, VariantProps } from "class-variance-authority"
import clsx from "clsx"
import { FC, HTMLAttributes, SVGProps } from "react"
import { Text } from "./Text"

const input = cva(
  "border rounded-base flex items-center justify-center transition whitespace-nowrap bg-background border-accents-2 focus:outline-none focus:border-accents-5 placeholder:opacity-40 placeholder:text-foreground font-medium",
  {
    variants: {
      size: {
        small: "text-sm h-8 px-3",
        base: "text-base h-10 px-3",
        large: "text-base h-12 py-2 px-4",
      },
      disabled: {
        true: " cursor-not-allowed",
      },
      error: {
        true: "border-error focus:border-error placeholder:text-error text-error caret-error",
      },
      fullWidth: {
        true: "w-full",
        false: "w-max",
      },
    },

    defaultVariants: {
      size: "base",
      disabled: false,
      error: false,
      fullWidth: false,
    },
  }
)

interface Props
  extends HTMLAttributes<HTMLInputElement>,
    Omit<VariantProps<typeof input>, "error"> {
  placeholder: string
  label: string
  showLabel?: boolean
  name: string
  id?: string
  disabled?: boolean
  error?: string
  type?: "text" | "email" | "password" | "number"
  icon?: (
    props: SVGProps<SVGSVGElement> & {
      title?: string | undefined
      titleId?: string | undefined
    }
  ) => JSX.Element
  value?: string
}

export const Input: FC<Props> = ({
  type = "text",
  id,
  showLabel,
  label,
  size,
  disabled,
  error,
  fullWidth,
  className,
  icon,
  ...rest
}) => {
  const Icon = icon

  const isError = !!error

  return (
    <div className="relative">
      <label
        className={clsx(showLabel ? "mb-1 block" : "sr-only")}
        htmlFor={id}
      >
        <Text as="span" weight="medium" size="xs" intent="secondary">
          {label}
        </Text>
      </label>

      {Icon && (
        <Icon className="absolute w-5 h-5 -translate-y-1/2 pointer-events-none top-1/2 left-3 opacity-40 text-foreground" />
      )}

      <input
        {...rest}
        id={id}
        className={input({
          size,
          disabled,
          error: isError,
          fullWidth,
          className: clsx(
            {
              "pl-10": Icon,
              "pl-3": !Icon,
            },
            className
          ),
        })}
      />

      {isError && (
        <div className="flex items-center mt-1 text-error gap-x-1">
          <ExclamationCircleIcon className="w-5 h-5" />
          <Text size="sm" intent="error">
            {error}
          </Text>
        </div>
      )}
    </div>
  )
}