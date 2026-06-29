import mark from "@/assets/logos/shuleyangu-mark.png"
import { cn } from "@/lib/utils"

interface BrandLogoProps {
  /** `wordmark` shows the mark + name; `icon` shows just the mark. */
  variant?: "wordmark" | "icon"
  className?: string
  markClassName?: string
}

/**
 * Theme-adaptive brand lockup: the ShuleYangu flower mark plus the wordmark
 * rendered as HTML text so it follows `text-foreground` in light and dark.
 */
export function BrandLogo({ variant = "wordmark", className, markClassName }: BrandLogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <img
        src={mark}
        alt="ShuleYangu"
        width={36}
        height={36}
        className={cn("size-9 shrink-0 object-contain", markClassName)}
      />
      {variant === "wordmark" ? (
        <span className="flex flex-col leading-none">
          <span className="text-foreground text-base font-extrabold tracking-tight">
            ShuleYangu
          </span>
          <span className="text-muted-foreground text-[0.62rem] font-semibold tracking-[0.18em] uppercase">
            Family Portal
          </span>
        </span>
      ) : null}
    </span>
  )
}
