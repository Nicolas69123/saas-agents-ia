export interface InvoiceItem {
  description: string
  quantity: number
  unit_price: number
  amount: number
}

export interface ExpenseRow {
  category: string
  description?: string
  amount: number
  date?: string
  vat?: number
}

export interface SlideContent {
  title?: string
  subtitle?: string
  body?: string
  bullets?: string[]
  imageQuery?: string
}

export interface DocumentRequest {
  type: string
  title: string
  format?: "docx" | "xlsx" | "pptx" | "pdf"
  content?: string
  data?: {
    company_name?: string
    company_address?: string
    company_siret?: string
    company_tva?: string
    company_phone?: string
    company_email?: string
    client_name?: string
    client_address?: string
    client_siret?: string
    client_tva?: string
    invoice_number?: string
    invoice_date?: string
    due_date?: string
    items?: InvoiceItem[]
    expenses?: ExpenseRow[]
    total_ht?: number
    tva_rate?: number
    tva_amount?: number
    total_ttc?: number
    payment_terms?: string
    payment_method?: string
    iban?: string
    period?: string
    slides?: SlideContent[]
    theme?: "business" | "marketing" | "finance" | "dark"
  }
  recommendations?: string[]
  alerts?: { level: string; message: string }[]
}

export interface GeneratedDocument {
  filename: string
  buffer: Buffer
  mimeType: string
  format: "docx" | "xlsx" | "pptx" | "pdf"
}

export const FORMAT_MIME: Record<string, string> = {
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  pdf: "application/pdf",
}

export const FORMAT_LABELS: Record<string, string> = {
  docx: "Document Word",
  xlsx: "Tableur Excel",
  pptx: "Presentation PowerPoint",
  pdf: "Document PDF",
}
