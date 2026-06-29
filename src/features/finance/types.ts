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

/** Printable receipt payload from `GET /finance/payments/{id}/receipt/`. */
export interface Receipt {
  id: string
  receipt_number: string
  payment_date: string
  amount: string
  payment_method_display: string
  reference_number: string
  paid_by_name: string
  paid_by_phone: string
  received_by_name: string
  notes: string
  is_verified: boolean
  is_cancelled: boolean
  balance_after: string | null
  school: {
    name: string
    code: string
    address: string
    city: string
    region: string
    phone: string
    email: string
    motto: string
    logo_url: string
  }
  student: { id: string; name: string; admission_number: string; stream: string }
  invoice: {
    id: string
    invoice_number: string
    term: string
    total_amount: string
    paid_amount: string
    balance: string
    status: string
  }
}
