import { IconComponent } from "../types/IconComponent"
import { Text } from "./Text"
import { ExclamationCircleIcon } from "@heroicons/react/20/solid"
import { cva, VariantProps } from "class-variance-authority"
import clsx from "clsx"
import { forwardRef, HTMLAttributes } from "react"

export const input = cva(
  "border rounded-base flex items-center justify-center transition whitespace-nowrap bg-background border-accents-2 focus:outline-none focus:border-accents-5 placeholder:opacity-40 placeholder:text-foreground font-medium scroll-mt-input file:hidden file:inset-0 file:cursor-pointer",
  {
    variants: {
      size: {
        small: "text-sm h-8 px-3",
        base: "text-base h-10 px-3",
        large: "text-base h-12 py-2 px-4",
      },
      disabled: {
        true: "bg-accents-1 border-accents-2 placeholder:text-accents-4 text-accents-5 cursor-not-allowed",
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

export interface CustomInputProps {
  label: string
  name: string
  placeholder?: string
  showLabel?: boolean
  id?: string
  disabled?: boolean
  error?: string
  type?: "text" | "email" | "password" | "number" | "file"
  icon?: IconComponent
  value?: string | number
  readOnly?: boolean
  inputClassName?: string
  labelClassName?: string
}

type Props = HTMLAttributes<HTMLInputElement> &
  Omit<VariantProps<typeof input>, "error"> &
  CustomInputProps

export const Input = forwardRef<HTMLInputElement, Props>(
  (
    {
      type = "text",
      id,
      showLabel,
      label,
      placeholder,
      size,
      disabled,
      error,
      fullWidth,
      className,
      icon,
      inputClassName,
      labelClassName,
      ...rest
    },
    ref
  ) => {
    const Icon = icon

    return (
      <div className={clsx("relative h-max", fullWidth && "w-full", className)}>
        <label
          className={clsx(showLabel ? "mb-1 block" : "sr-only")}
          htmlFor={id}
        >
          <Text as="span" weight="medium" size="xs" intent="primary">
            {label}
          </Text>
        </label>

        <div className="relative">
          <input
            type={type}
            aria-invalid={!!error}
            placeholder={placeholder ?? label}
            disabled={disabled}
            title={disabled ? "This field is disabled" : undefined}
            id={id}
            ref={ref}
            className={input({
              size,
              disabled,
              error: !!error,
              fullWidth,
              className: clsx(
                {
                  "pl-10": Icon,
                  "pl-3": !Icon,
                },
                inputClassName,
                type === "file" && "cursor-pointer leading-9"
              ),
            })}
            {...rest}
          />

          {Icon && (
            <Icon
              className={clsx(
                "absolute w-5 h-5 pointer-events-none top-1/2 -translate-y-1/2 left-3 opacity-40",
                error ? "text-error" : "text-foreground transition"
              )}
            />
          )}
        </div>

        <FieldError error={error} />
      </div>
    )
  }
)

Input.displayName = "Input"

export const FieldError = ({ error, mr }: { error?: string; mr?: boolean }) => (
  <div
    aria-hidden={!error}
    role="alert"
    className={clsx(
      "flex items-center mt-1 text-error gap-x-1 overflow-clip duration-300 ease-out",
      error ? "h-5" : "h-0"
    )}
  >
    {error && (
      <ExclamationCircleIcon className={clsx("w-5 h-5", mr && "mr-0.5")} />
    )}

    <Text size="sm" intent="error" as="p">
      {error}
    </Text>
  </div>
)
