import { cva, VariantProps } from "class-variance-authority"
import { FC, HTMLAttributes, ComponentProps, forwardRef } from "react"
import Link from "next/link"
import { IconComponent } from "../types/IconComponent"

const button = cva(
  "font-semibold rounded-base flex gap-x-2 items-center transition select-none whitespace-nowrap focus:outline-none focus-visible:ring-2 focus:ring-offset-1 focus:ring-offset-background",
  {
    variants: {
      intent: {
        primary: "focus:ring-foreground",
        secondary: "focus:ring-secondary",
        success: "focus:ring-success",
        error: "focus:ring-error",
      },
      size: {
        small: "text-sm h-8 px-3",
        base: "text-base h-10 px-3",
        large: "text-base h-12 py-2 px-4",
      },
      variant: {
        default: "border hover:bg-opacity-0 active:bg-opacity-[.2]",
        ghost:
          "bg-transparent hover:transition-none hover:bg-opacity-10 active:bg-opacity-[.15]",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
      svgOnly: {
        true: "px-0",
        false: "",
      },
      align: {
        left: "justify-start",
        center: "justify-center",
        right: "justify-end",
      },
    },

    compoundVariants: [
      // Variant: default
      {
        variant: "default",
        intent: "primary",
        className:
          "bg-foreground text-background border-foreground hover:text-foreground active:text-foreground",
      },
      {
        variant: "default",
        intent: "secondary",
        className:
          "bg-background/50 text-foreground border-accents-2 hover:border-foreground hover:bg-foreground active:border-foreground",
      },
      {
        variant: "default",
        intent: "success",
        className:
          "bg-success text-foreground border-success hover:text-success active:text-success",
      },
      {
        variant: "default",
        intent: "error",
        className:
          "bg-error text-foreground border-error hover:text-error active:text-error",
      },

      // Variant: ghost
      {
        variant: "ghost",
        intent: "primary",
        className: "text-foreground hover:bg-foreground",
      },
      {
        variant: "ghost",
        intent: "secondary",
        className: "text-secondary hover:bg-foreground",
      },
      {
        variant: "ghost",
        intent: "success",
        className: "text-success hover:bg-success",
      },
      {
        variant: "ghost",
        intent: "error",
        className: "text-error hover:bg-error",
      },

      // SVG only and sizes
      {
        svgOnly: true,
        size: "small",
        className: "h-8 w-8 flex-shrink-0",
      },
      {
        svgOnly: true,
        size: "base",
        className: "h-10 w-10 flex-shrink-0",
      },
      {
        svgOnly: true,
        size: "large",
        className: "h-12 w-12 flex-shrink-0",
      },
      {
        svgOnly: false,
        size: "small",
        className: "pr-4",
      },
      {
        svgOnly: false,
        size: "base",
        className: "pr-4",
      },
      {
        svgOnly: false,
        size: "large",
        className: "pr-5",
      },
    ],

    defaultVariants: {
      intent: "primary",
      size: "base",
      variant: "default",
      fullWidth: false,
      svgOnly: false,
      align: "center",
    },
  }
)

const buttonIcon = cva("", {
  variants: {
    size: {
      small: "w-5 h-5",
      base: "w-6 h-6",
      large: "w-6 h-6",
    },
  },
  defaultVariants: {
    size: "base",
  },
})

interface IconButton {
  icon?: IconComponent
  type?: "button" | "submit" | "reset"
}

/**
 * Button version of Button
 */
type ButtonProps = VariantProps<typeof button> &
  HTMLAttributes<HTMLButtonElement> &
  IconButton

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      intent,
      size,
      variant,
      fullWidth,
      align,
      icon,
      children,
      svgOnly,
      className,
      ...rest
    },
    ref
  ) => {
    const Icon = icon

    return (
      <button
        ref={ref}
        className={button({
          intent,
          size,
          variant,
          fullWidth,
          align,
          svgOnly: svgOnly || (!children && !!icon),
          className,
        })}
        {...rest}
      >
        {Icon && <Icon className={buttonIcon({ size })} />}
        {children}
      </button>
    )
  }
)
Button.displayName = "Button"

/**
 * Link version of Button
 */
type ButtonLinkProps = VariantProps<typeof button> &
  ComponentProps<typeof Link> &
  IconButton & {
    openInNewTab?: boolean
  }

export const ButtonLink = forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  (
    {
      intent,
      size,
      variant,
      fullWidth,
      align,
      icon,
      children,
      className,
      openInNewTab,
      ...rest
    },
    ref
  ) => {
    const Icon = icon

    return (
      <Link
        ref={ref}
        target={openInNewTab ? "_blank" : undefined}
        rel={openInNewTab ? "noopener noreferrer" : undefined}
        className={button({
          intent,
          size,
          variant,
          fullWidth,
          align,
          svgOnly: !children && !!icon,
          className,
        })}
        {...rest}
      >
        {Icon && <Icon className={buttonIcon({ size })} />}
        {children}
      </Link>
    )
  }
)
ButtonLink.displayName = "ButtonLink"
