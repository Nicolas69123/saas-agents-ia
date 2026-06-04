import PDFDocument from "pdfkit"
import { execFile } from "child_process"
import { promisify } from "util"
import { mkdtemp, writeFile, readFile, rm } from "fs/promises"
import { tmpdir } from "os"
import path from "path"
import type { DocumentRequest, GeneratedDocument } from "./types"
import { FORMAT_MIME } from "./types"
import { parseMarkdown, type InlineSpan } from "./markdown"

const execFileAsync = promisify(execFile)
type PDFDocumentInstance = InstanceType<typeof PDFDocument>

const ACCENT = "#4F46E5"
const TEXT_PRIMARY = "#111827"
const TEXT_SECONDARY = "#6B7280"
const LIGHT_GRAY = "#E5E7EB"

function streamToBuffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    stream.on("data", (c: Buffer) => chunks.push(c))
    stream.on("end", () => resolve(Buffer.concat(chunks)))
    stream.on("error", reject)
  })
}

function buildInvoicePdf(req: DocumentRequest): PDFDocumentInstance {
  const d = req.data || {}
  const items = d.items || []

  const doc = new PDFDocument({ size: "A4", margin: 50 })

  // Header
  doc.fontSize(11).fillColor(TEXT_PRIMARY).font("Helvetica-Bold")
    .text(d.company_name || "[Votre entreprise]", 50, 50)
  doc.fontSize(9).fillColor(TEXT_SECONDARY).font("Helvetica")
    .text(d.company_address || "[Adresse]", 50, 68)
    .text(`SIRET: ${d.company_siret || ""}`, 50, 82)
    .text(`TVA: ${d.company_tva || ""}`, 50, 96)

  doc.fontSize(28).fillColor(ACCENT).font("Helvetica-Bold")
    .text("FACTURE", 350, 45, { width: 200, align: "right" })
  doc.fontSize(10).fillColor(TEXT_PRIMARY).font("Helvetica")
    .text(`N: ${d.invoice_number || ""}`, 350, 82, { width: 200, align: "right" })
    .text(`Date: ${d.invoice_date || new Date().toLocaleDateString("fr-FR")}`, 350, 96, { width: 200, align: "right" })
    .text(`Echeance: ${d.due_date || ""}`, 350, 110, { width: 200, align: "right" })

  // Separator
  doc.moveTo(50, 140).lineTo(545, 140).strokeColor(LIGHT_GRAY).stroke()

  // Client
  doc.fontSize(9).fillColor(TEXT_SECONDARY).font("Helvetica-Bold")
    .text("FACTURER A :", 50, 160)
  doc.fontSize(12).fillColor(TEXT_PRIMARY).font("Helvetica-Bold")
    .text(d.client_name || "[Nom du client]", 50, 178)
  doc.fontSize(10).fillColor(TEXT_SECONDARY).font("Helvetica")
    .text(d.client_address || "[Adresse du client]", 50, 196)
  if (d.client_siret) {
    doc.text(`SIRET: ${d.client_siret}`, 50, 210)
  }

  // Table header
  const tableTop = 250
  doc.fontSize(9).fillColor(TEXT_SECONDARY).font("Helvetica-Bold")
  doc.rect(50, tableTop, 495, 24).fill("#F3F4F6")
  doc.fillColor(TEXT_PRIMARY)
    .text("DESCRIPTION", 60, tableTop + 8)
    .text("QTE", 320, tableTop + 8, { width: 50, align: "right" })
    .text("PRIX UNIT.", 380, tableTop + 8, { width: 70, align: "right" })
    .text("MONTANT HT", 460, tableTop + 8, { width: 75, align: "right" })

  // Items
  let y = tableTop + 30
  doc.fontSize(10).font("Helvetica").fillColor(TEXT_PRIMARY)
  if (items.length > 0) {
    for (const item of items) {
      doc.text(item.description, 60, y, { width: 250 })
        .text(String(item.quantity), 320, y, { width: 50, align: "right" })
        .text(`${item.unit_price.toFixed(2)} EUR`, 380, y, { width: 70, align: "right" })
        .text(`${item.amount.toFixed(2)} EUR`, 460, y, { width: 75, align: "right" })
      y += 22
      doc.moveTo(50, y - 4).lineTo(545, y - 4).strokeColor(LIGHT_GRAY).stroke()
    }
  } else {
    doc.fillColor(TEXT_SECONDARY).font("Helvetica-Oblique")
      .text("[Ajouter les lignes de facturation]", 60, y, { width: 485, align: "center" })
    y += 30
  }

  // Totals
  y += 20
  doc.fontSize(10).fillColor(TEXT_PRIMARY).font("Helvetica")
    .text("Total HT", 380, y, { width: 80, align: "right" })
    .text(`${(d.total_ht ?? 0).toFixed(2)} EUR`, 460, y, { width: 75, align: "right" })
  y += 16
  doc.text(`TVA (${d.tva_rate ?? 20}%)`, 380, y, { width: 80, align: "right" })
    .text(`${(d.tva_amount ?? 0).toFixed(2)} EUR`, 460, y, { width: 75, align: "right" })
  y += 20
  doc.moveTo(380, y - 4).lineTo(545, y - 4).strokeColor(TEXT_PRIMARY).stroke()
  doc.fontSize(13).font("Helvetica-Bold").fillColor(ACCENT)
    .text("Total TTC", 380, y + 4, { width: 80, align: "right" })
    .text(`${(d.total_ttc ?? 0).toFixed(2)} EUR`, 460, y + 4, { width: 75, align: "right" })

  // Footer
  const footerY = 700
  doc.fontSize(9).fillColor(TEXT_SECONDARY).font("Helvetica")
    .text(`Conditions : ${d.payment_terms || "A 30 jours"}  -  Mode : ${d.payment_method || "Virement bancaire"}`, 50, footerY, { width: 495 })
  if (d.iban) {
    doc.text(`IBAN : ${d.iban}`, 50, footerY + 14)
  }
  doc.fontSize(7).text(
    "En cas de retard de paiement, une penalite de 3 fois le taux d'interet legal sera appliquee, ainsi qu'une indemnite forfaitaire de 40 EUR pour frais de recouvrement (art. L.441-10 du Code de commerce).",
    50, footerY + 35, { width: 495 }
  )

  doc.end()
  return doc
}

// Ecrit une suite de spans inline sur une meme ligne (gras/italique/code).
function writeInlineSpans(doc: PDFDocumentInstance, spans: InlineSpan[], size: number, indent = 50) {
  const width = 545 - indent
  spans.forEach((s, idx) => {
    const font = s.code ? "Courier" : s.bold && s.italic ? "Helvetica-BoldOblique" : s.bold ? "Helvetica-Bold" : s.italic ? "Helvetica-Oblique" : "Helvetica"
    doc.font(font).fontSize(size).fillColor(s.code ? "#B91C1C" : TEXT_PRIMARY)
    doc.text(s.text, { continued: idx < spans.length - 1, width })
  })
}

function buildReportPdf(req: DocumentRequest): PDFDocumentInstance {
  const doc = new PDFDocument({ size: "A4", margin: 50 })

  // Titre + filet
  doc.fontSize(24).fillColor(ACCENT).font("Helvetica-Bold").text(req.title || "Document")
  doc.fontSize(10).fillColor(TEXT_SECONDARY).font("Helvetica")
    .text(req.data?.period ? `Periode : ${req.data.period}` : `Date : ${new Date().toLocaleDateString("fr-FR")}`)
  doc.moveDown(0.4)
  doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor(LIGHT_GRAY).stroke()
  doc.moveDown(0.8)

  if (req.content) {
    for (const block of parseMarkdown(req.content)) {
      switch (block.type) {
        case "heading": {
          const size = block.level === 1 ? 16 : block.level === 2 ? 13 : 11.5
          doc.moveDown(0.5).font("Helvetica-Bold").fontSize(size).fillColor(block.level <= 2 ? ACCENT : TEXT_PRIMARY)
          doc.text(block.spans.map((s) => s.text).join(""))
          doc.moveDown(0.2)
          break
        }
        case "paragraph":
          writeInlineSpans(doc, block.spans, 11)
          doc.moveDown(0.3)
          break
        case "bullet":
          doc.font("Helvetica").fontSize(11).fillColor(TEXT_PRIMARY)
            .text(`${"   ".repeat(block.level)}•  ${block.spans.map((s) => s.text).join("")}`, { indent: 0 })
          break
        case "ordered":
          doc.font("Helvetica").fontSize(11).fillColor(TEXT_PRIMARY)
            .text(`${"   ".repeat(block.level)}${block.index}.  ${block.spans.map((s) => s.text).join("")}`)
          break
        case "quote":
          doc.font("Helvetica-Oblique").fontSize(11).fillColor(TEXT_SECONDARY)
            .text(`   ${block.spans.map((s) => s.text).join("")}`, { indent: 10 })
          doc.moveDown(0.2)
          break
        case "divider":
          doc.moveDown(0.3)
          doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor(LIGHT_GRAY).stroke()
          doc.moveDown(0.4)
          break
        case "table": {
          const cols = block.headers.length || 1
          const colW = 495 / cols
          const startX = 50
          // En-tete
          let ty = doc.y + 4
          doc.rect(startX, ty, 495, 20).fill("#F3F4F6")
          doc.fillColor(TEXT_PRIMARY).font("Helvetica-Bold").fontSize(9)
          block.headers.forEach((cell, c) => {
            doc.text(cell.map((s) => s.text).join(""), startX + 6 + c * colW, ty + 6, { width: colW - 12 })
          })
          ty += 20
          // Lignes
          doc.font("Helvetica").fontSize(9.5).fillColor(TEXT_PRIMARY)
          for (const row of block.rows) {
            row.forEach((cell, c) => {
              doc.text(cell.map((s) => s.text).join(""), startX + 6 + c * colW, ty + 5, { width: colW - 12 })
            })
            ty += 20
            doc.moveTo(startX, ty).lineTo(startX + 495, ty).strokeColor(LIGHT_GRAY).stroke()
          }
          doc.y = ty + 6
          doc.x = 50
          break
        }
      }
    }
  }

  if (req.recommendations && req.recommendations.length > 0) {
    doc.moveDown(1).fontSize(14).fillColor(ACCENT).font("Helvetica-Bold").text("Recommandations")
    doc.fontSize(11).font("Helvetica").fillColor(TEXT_PRIMARY)
    for (const rec of req.recommendations) doc.text(`•  ${rec}`)
  }

  if (req.alerts && req.alerts.length > 0) {
    doc.moveDown(0.8).fontSize(14).fillColor("#D97706").font("Helvetica-Bold").text("Points d'attention")
    doc.fontSize(11).font("Helvetica").fillColor("#92400E")
    for (const a of req.alerts) doc.text(`[${a.level}]  ${a.message}`)
  }

  doc.end()
  return doc
}

export async function generatePdf(req: DocumentRequest): Promise<GeneratedDocument> {
  let doc: PDFDocumentInstance
  let filename: string

  switch (req.type) {
    case "invoice":
      doc = buildInvoicePdf(req)
      filename = `facture-${req.data?.invoice_number || Date.now()}.pdf`
      break
    default:
      doc = buildReportPdf(req)
      filename = `${req.type}-${req.data?.period || Date.now()}.pdf`
  }

  const buffer = await streamToBuffer(doc as unknown as NodeJS.ReadableStream)

  return {
    filename,
    buffer,
    mimeType: FORMAT_MIME.pdf,
    format: "pdf",
  }
}

/**
 * Convert a docx/xlsx/pptx buffer to a PDF buffer using LibreOffice headless.
 * Used to generate inline PDF previews for Office formats.
 */
export async function convertToPdfWithLibreOffice(
  inputBuffer: Buffer,
  inputExtension: "docx" | "xlsx" | "pptx"
): Promise<Buffer> {
  const dir = await mkdtemp(path.join(tmpdir(), "omnia-convert-"))
  const inputPath = path.join(dir, `input.${inputExtension}`)
  const outputPath = path.join(dir, "input.pdf")

  try {
    await writeFile(inputPath, inputBuffer)

    await execFileAsync(
      "libreoffice",
      ["--headless", "--convert-to", "pdf", "--outdir", dir, inputPath],
      { timeout: 60000 }
    )

    const pdfBuffer = await readFile(outputPath)
    return pdfBuffer
  } finally {
    await rm(dir, { recursive: true, force: true }).catch(() => {})
  }
}
