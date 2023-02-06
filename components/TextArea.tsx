import { CustomInputProps, input } from "./Input"
import { Text } from "./Text"
import { ExclamationCircleIcon } from "@heroicons/react/20/solid"
import { VariantProps } from "class-variance-authority"
import clsx from "clsx"
import { forwardRef, HTMLAttributes } from "react"

type Props = HTMLAttributes<HTMLTextAreaElement> &
  Omit<VariantProps<typeof input>, "error"> &
  Omit<CustomInputProps, "type">

export const TextArea = forwardRef<HTMLTextAreaElement, Props>(
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
          <textarea
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
                "py-2",
                "h-48 whitespace-pre-line",
                inputClassName
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

TextArea.displayName = "TextArea"

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
