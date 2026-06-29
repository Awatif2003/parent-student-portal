import { Toaster, toast } from "sonner"

export const notify = {
  success: toast.success,
  error: toast.error,
  info: toast.info,
  message: toast,
}

export function AppToaster() {
  return <Toaster richColors closeButton position="top-right" />
}
