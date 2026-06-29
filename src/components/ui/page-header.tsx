import * as React from "react"

import { cn } from "@/lib/utils"

/** Eyebrow pill — a soft brand-tinted label with a leading dot. */
function PageHeaderEyebrow({
  className,
  children,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="page-eyebrow"
      className={cn(
        "bg-primary/10 text-primary ring-primary/15 inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[0.7rem] font-semibold tracking-[0.08em] uppercase ring-1 ring-inset",
        className,
      )}
      {...props}
    >
      <span aria-hidden="true" className="bg-primary size-1.5 shrink-0 rounded-full" />
      {children}
    </span>
  )
}

interface PageHeaderProps extends Omit<React.ComponentProps<"header">, "title"> {
  eyebrow?: React.ReactNode
  title: React.ReactNode
  description?: React.ReactNode
  icon?: React.ReactNode
  actions?: React.ReactNode
}

/**
 * Premium page header: eyebrow pill + title + description, with an optional
 * right-aligned actions cluster that stacks beneath on small screens.
 */
function PageHeader({
  eyebrow,
  title,
  description,
  icon,
  actions,
  className,
  ...props
}: PageHeaderProps) {
  return (
    <header
      data-slot="page-header"
      className={cn(
        "flex flex-col gap-4 md:flex-row md:items-end md:justify-between",
        className,
      )}
      {...props}
    >
      <div className="flex min-w-0 items-start gap-3">
        {icon ? (
          <span className="bg-primary/10 text-primary ring-primary/15 mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-md ring-1 ring-inset [&_svg]:size-5">
            {icon}
          </span>
        ) : null}
        <div className="min-w-0">
          {eyebrow ? <PageHeaderEyebrow>{eyebrow}</PageHeaderEyebrow> : null}
          <h1
            className={cn(
              "text-foreground text-2xl font-semibold tracking-tight text-balance",
              eyebrow && "mt-3",
            )}
          >
            {title}
          </h1>
          {description ? (
            <p className="text-muted-foreground mt-1 text-sm leading-6">
              {description}
            </p>
          ) : null}
        </div>
      </div>
      {actions ? (
        <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>
      ) : null}
    </header>
  )
}

export { PageHeader, PageHeaderEyebrow }
