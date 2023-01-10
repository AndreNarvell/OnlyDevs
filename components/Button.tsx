import { cva, VariantProps } from "class-variance-authority"
import { FC, HTMLAttributes, ComponentProps } from "react"
import Link from "next/link"

const button = cva(
  "font-semibold border rounded-base flex items-center justify-center transition select-none whitespace-nowrap",
  {
    variants: {
      intent: {
        primary:
          "bg-foreground text-background border-foreground hover:bg-transparent hover:text-foreground active:text-foreground",
        secondary:
          "text-foreground border-accents-2 hover:bg-transparent hover:border-foreground active:border-foreground",
        success:
          "bg-success text-foreground border-success hover:bg-transparent hover:text-success active:text-success",
        error:
          "bg-error text-foreground border-error hover:bg-transparent hover:text-error active:text-error",
      },
      size: {
        small: "text-sm h-8 px-3",
        base: "text-base h-10 px-3",
        large: "text-base h-12 py-2 px-4",
      },
      variant: {
        default: "border active:bg-accents-2",
      },
      fullWidth: {
        true: "w-full",
        false: "w-max",
      },
    },

    defaultVariants: {
      intent: "primary",
      size: "base",
      variant: "default",
      fullWidth: false,
    },
  }
)

/**
 * Button version of Button
 */
type ButtonProps = VariantProps<typeof button> &
  HTMLAttributes<HTMLButtonElement>

export const Button: FC<ButtonProps> = ({
  intent,
  size,
  variant,
  fullWidth,
  className,
  children,
  ...rest
}) => {
  console.log({ intent, size, variant, className })

  return (
    <button
      className={button({ intent, size, variant, fullWidth, className })}
      {...rest}
    >
      {children}
    </button>
  )
}

/**
 * Link version of Button
 */
type ButtonLinkProps = VariantProps<typeof button> & ComponentProps<typeof Link>

export const ButtonLink: FC<ButtonLinkProps> = ({
  intent,
  size,
  children,
  variant,
  fullWidth,
  className,
  ...rest
}) => {
  return (
    <Link
      className={button({ intent, size, variant, fullWidth, className })}
      {...rest}
    >
      {children}
    </Link>
  )
}
