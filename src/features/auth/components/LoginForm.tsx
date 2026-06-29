/**
 * LoginForm — the family portal sign-in. POSTs to /auth/login via useLogin,
 * then resolves the parent/student role and redirects. Identifier accepts an
 * email OR a username (some family accounts use a username).
 */
import { zodResolver } from "@hookform/resolvers/zod"
import { CalendarCheck2, Eye, EyeOff, GraduationCap, Receipt } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { BrandLogo } from "@/components/brand/Logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { notify } from "@/components/ui/toast"
import { useLogin } from "@/features/auth/hooks/useLogin"
import { cn } from "@/lib/utils"

const loginSchema = z.object({
  identifier: z.string().min(1, "Enter your email or username."),
  password: z.string().min(1, "Enter your password."),
})

type LoginValues = z.infer<typeof loginSchema>

const highlights = [
  { icon: GraduationCap, label: "Academic progress" },
  { icon: CalendarCheck2, label: "Attendance updates" },
  { icon: Receipt, label: "Fees & receipts" },
]

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const { mutateAsync: login, isPending } = useLogin()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { identifier: "", password: "" },
  })

  async function onSubmit(values: LoginValues) {
    try {
      await login(values)
      notify.success("Signed in successfully.")
    } catch (err) {
      notify.error(err instanceof Error ? err.message : "Unable to sign in.")
    }
  }

  return (
    <div className="bg-surface flex min-h-screen flex-col md:grid md:grid-cols-2">
      {/* Brand / hero panel */}
      <section className="relative hidden overflow-hidden bg-[linear-gradient(160deg,oklch(0.49_0.10_184),oklch(0.34_0.06_188))] text-white md:flex">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.14),transparent_30%)]" />
        <div className="relative flex w-full flex-col justify-between px-12 py-14">
          <BrandLogo variant="icon" markClassName="size-11" />
          <div className="max-w-md">
            <h1 className="text-3xl font-semibold leading-tight tracking-tight">
              Stay close to your child&apos;s school journey.
            </h1>
            <p className="mt-4 text-base leading-7 text-white/80">
              Follow attendance, results, and fees in one calm place — wherever
              you are.
            </p>
            <ul className="mt-8 space-y-3">
              {highlights.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-3 text-sm font-medium text-white/90">
                  <span className="flex size-9 items-center justify-center rounded-md bg-white/10 ring-1 ring-inset ring-white/15">
                    <Icon className="size-[1.1rem]" aria-hidden />
                  </span>
                  {label}
                </li>
              ))}
            </ul>
          </div>
          <p className="text-xs font-medium tracking-wide text-white/60">
            © {new Date().getFullYear()} ShuleYangu · Family Portal
          </p>
        </div>
      </section>

      {/* Form panel */}
      <section className="relative flex flex-1 items-center justify-center px-6 py-12 md:px-10">
        <div className="w-full max-w-[26rem]">
          <div className="md:hidden">
            <BrandLogo />
          </div>
          <div className="mt-8 md:mt-0">
            <h2 className="text-foreground text-2xl font-semibold tracking-tight">
              Welcome back
            </h2>
            <p className="text-muted-foreground mt-2 text-sm leading-6">
              Sign in with the details provided by your school.
            </p>
          </div>

          <form className="mt-8 grid gap-5" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="grid gap-2">
              <Label htmlFor="identifier">Email or username</Label>
              <Input
                id="identifier"
                type="text"
                autoComplete="username"
                placeholder="you@example.com"
                aria-invalid={!!errors.identifier}
                {...register("identifier")}
              />
              {errors.identifier && (
                <span className="text-destructive text-xs">{errors.identifier.message}</span>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="pr-11"
                  aria-invalid={!!errors.password}
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="text-muted-foreground hover:text-foreground absolute inset-y-0 right-0 flex items-center px-3 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {errors.password && (
                <span className="text-destructive text-xs">{errors.password.message}</span>
              )}
            </div>

            <Button type="submit" size="lg" className={cn("mt-1 w-full")} disabled={isPending}>
              {isPending && <Spinner />}
              Sign in
            </Button>
          </form>

          <p className="text-muted-foreground mt-6 text-center text-xs leading-5">
            Trouble signing in? Contact your school administrator.
          </p>
        </div>
      </section>
    </div>
  )
}
