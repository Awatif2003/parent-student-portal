import type { Dict } from "@/types"

export interface Invoice extends Dict {
  id?: string | number
  invoice_number?: string
  reference?: string
  student_name?: string
  description?: string
  balance_name?: string
  date?: string
  created_at?: string
  issued_at?: string
  due_date?: string
  amount?: number | string
  total?: number | string
  balance?: number | string
  status_display?: string
  status?: string
  invoice_status?: string
  balance_id?: string | number
}

export interface Payment extends Dict {
  id?: string | number
  receipt_number?: string
  reference?: string
  payment_reference?: string
  student_name?: string
  payer?: string
  date?: string
  payment_date?: string
  created_at?: string
  amount?: number | string
  paid_amount?: number | string
  status_display?: string
  status?: string
  payment_status?: string
  method?: string
  payment_method?: string
}
