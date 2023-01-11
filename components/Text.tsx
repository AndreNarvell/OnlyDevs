import { cva, VariantProps } from "class-variance-authority"
import { FC, HTMLAttributes, ReactNode } from "react"

const text = cva("", {
  variants: {
    size: {
      xs: "text-xs",
      sm: "text-sm",
      base: "text-base",
      lg: "text-lg",
      xl: "text-[1.375rem]",
      "2xl": "text-2xl",
      "3xl": "text-[2rem]",
    },
    leading: {
      none: "leading-none",
      tight: "leading-tight",
      snug: "leading-snug",
      normal: "leading-normal",
      relaxed: "leading-relaxed",
      loose: "leading-loose",
    },
    tracking: {
      normal: "tracking-normal",
      wide: "tracking-wide",
    },
    weight: {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
      extrabold: "font-extrabold",
    },
    intent: {
      primary: "text-foreground",
      secondary: "text-secondary",
      error: "text-error",
    },
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    },
    display: {
      inline: "inline",
      block: "block",
    },
  },

  defaultVariants: {
    size: "base",
    leading: "normal",
    tracking: "normal",
    weight: "normal",
    intent: "primary",
    align: "left",
    display: "block",
  },
})

type TextProps = VariantProps<typeof text> &
  HTMLAttributes<
    HTMLHeadingElement | HTMLSpanElement | HTMLParagraphElement
  > & {
    as: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "span" | "p"
    children?: ReactNode
  }

export const Text: FC<TextProps> = ({
  as = "span",
  size,
  leading,
  tracking,
  weight,
  intent,
  align,
  display,
  className,
  ...rest
}) => {
  const Element = as

  return (
    <Element
      className={text({
        size,
        leading,
        tracking,
        weight,
        intent,
        align,
        display,
        className,
      })}
      {...rest}
    />
  )
}
