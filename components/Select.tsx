import { CustomInputProps, FieldError, input } from "./Input"
import { Text } from "./Text"
import { VariantProps } from "class-variance-authority"
import clsx from "clsx"
import { ChangeEvent, forwardRef, HTMLAttributes } from "react"

type Props = Omit<HTMLAttributes<HTMLSelectElement>, "onChange"> &
  Omit<VariantProps<typeof input>, "error"> &
  CustomInputProps & {
    options?: { label: string; value: string | number }[]
    onChange?: (e: ChangeEvent<HTMLSelectElement>) => void
  }

export const Select = forwardRef<HTMLSelectElement, Props>(
  (
    {
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
      options,
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
          <select
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
                inputClassName
              ),
            })}
            {...rest}
          >
            {options?.map((option, index) => (
              <option value={option.value} key={index}>
                {option.label}
              </option>
            ))}
          </select>

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

Select.displayName = "Select"
