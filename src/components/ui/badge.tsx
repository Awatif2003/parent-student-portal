import type { ComponentProps } from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-md text-xs font-medium ring-1 ring-inset",
  {
    variants: {
      variant: {
        default: "bg-primary/10 text-primary ring-primary/20",
        success: "bg-success/10 text-success-foreground ring-success/20",
        warning:
          "bg-amber-500/10 text-amber-700 ring-amber-500/20 dark:text-amber-300",
        danger: "bg-destructive/10 text-destructive ring-destructive/20",
        muted: "bg-muted text-muted-foreground ring-border",
        outline: "text-foreground ring-border bg-transparent",
        /** Brand chip used as a page/section eyebrow. */
        eyebrow:
          "bg-primary/10 text-primary ring-primary/15 uppercase tracking-[0.08em]",
      },
      size: {
        default: "h-6 px-2",
        sm: "h-5 px-1.5 text-[0.7rem]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export type BadgeVariant = NonNullable<
  VariantProps<typeof badgeVariants>["variant"]
>

export function Badge({
  className,
  variant,
  size,
  ...props
}: ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  )
}

export { badgeVariants }
