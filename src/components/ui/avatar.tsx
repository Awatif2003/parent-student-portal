import type { ComponentProps } from "react"

import { cn } from "@/lib/utils"

interface AvatarProps extends ComponentProps<"div"> {
  src?: string
  name: string
  size?: "sm" | "md" | "lg"
}

const sizes = {
  sm: "size-8 text-xs",
  md: "size-9 text-sm",
  lg: "size-12 text-base",
}

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("")
}

export function Avatar({ src, name, size = "md", className, ...props }: AvatarProps) {
  return (
    <div
      className={cn(
        "bg-primary/10 text-primary inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full font-semibold",
        sizes[size],
        className,
      )}
      {...props}
    >
      {src ? (
        <img src={src} alt={name} width={48} height={48} className="size-full object-cover" />
      ) : (
        <span>{initials(name) || "SY"}</span>
      )}
    </div>
  )
}
