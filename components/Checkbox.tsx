import { cva, cx, VariantProps } from "class-variance-authority"
import clsx from "clsx"
import { ChangeEvent, FC, forwardRef, HTMLAttributes } from "react"
import { FieldError } from "./Input"
import { Text } from "./Text"

const checkbox = cva(
  [
    "peer shadow-sm relative w-4 h-4 cursor-pointer scroll-mt-input appearance-none items-center justify-center rounded-[3px] ml-0.5 transition-[border] flex-shrink-0 flex-grow-0",
    "bg-transparent active:bg-foreground/20 checked:bg-foreground checked:active:bg-foreground",
    "border hover:border-foreground checked:border-foreground disabled:border-error",
  ],
  {
    variants: {
      disabled: {
        true: "",
        false: "",
      },
      error: {
        true: "border-error-dark hover:border-error checked:bg-error checked:border-error",
        false: "border-accents-5",
      },
    },

    defaultVariants: {
      disabled: false,
      error: false,
    },
  }
)

interface Props
  extends HTMLAttributes<HTMLInputElement>,
    Omit<VariantProps<typeof checkbox>, "error"> {
  label: string
  id?: string
  name?: string
  touched?: boolean
  error?: string
  showError?: boolean
  className?: string
  checked?: boolean
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
  disabled?: boolean
}

export const Checkbox: FC<Props> = forwardRef<HTMLInputElement, Props>(
  ({ label, id, disabled, error, className, ...rest }, ref) => {
    return (
      <div className={className}>
        <div className="flex items-center">
          <input
            type="checkbox"
            id={id}
            ref={ref}
            className={checkbox({
              disabled,
              error: !!error,
            })}
            {...rest}
          />
          <Check />

          <label
            htmlFor={id}
            className={cx(
              "cursor-pointer select-none pl-2 transition",
              "peer-disabled:cursor-not-allowed",
              error && "text-error"
            )}
          >
            <Text as="span" size="sm" className={clsx(!!error && "text-error")}>
              {label}
            </Text>
          </label>
        </div>

        {error && <FieldError error={error} mr />}
      </div>
    )
  }
)
Checkbox.displayName = "Checkbox"

const Check = () => (
  <svg
    width={16}
    height={16}
    viewBox="0 0 16 16"
    fill="none"
    className="absolute w-4 h-4 translate-x-0.5 opacity-0 pointer-events-none text-background peer-checked:opacity-100"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4 7.5L7.125 10.625L12.75 5"
      stroke="black"
      strokeWidth={1.5}
      strokeLinecap="round"
    />
  </svg>
)
