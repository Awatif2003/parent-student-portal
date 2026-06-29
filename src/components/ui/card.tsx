import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const cardVariants = cva(
  "bg-card text-card-foreground flex flex-col rounded-lg border",
  {
    variants: {
      variant: {
        /** Elevated surface with the shared soft shadow and a gentle hover lift. */
        default:
          "shadow-card transition-shadow duration-200 hover:shadow-card-hover",
        /** Flat surface — no shadow, no hover. For dense/nested contexts. */
        subtle: "shadow-none",
        /** Compact KPI surface (tighter padding handled by content). */
        stat: "shadow-card transition-shadow duration-200 hover:shadow-card-hover",
        /** Clickable card: pointer cursor + lift on hover, focus ring support. */
        interactive:
          "shadow-card cursor-pointer transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5 focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none",
      },
      padding: {
        none: "py-0",
        default: "gap-6 py-6",
        compact: "gap-4 py-4",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "default",
    },
  },
)

type CardProps = React.ComponentProps<"div"> & VariantProps<typeof cardVariants>

function Card({ className, variant, padding, ...props }: CardProps) {
  return (
    <div
      data-slot="card"
      data-variant={variant ?? "default"}
      className={cn(cardVariants({ variant, padding }), className)}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className,
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-none font-semibold", className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className,
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="card-content" className={cn("px-6", className)} {...props} />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
  cardVariants,
}
