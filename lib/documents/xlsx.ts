import ExcelJS from "exceljs"
import type { DocumentRequest, GeneratedDocument } from "./types"
import { FORMAT_MIME } from "./types"
import { parseMarkdown, spansToText } from "./markdown"

const ACCENT = "FF4F46E5"
const HEADER_BG = "FFF3F4F6"
const HEADER_TEXT = "FF374151"
const GRAY = "FF888888"

function applyHeaderRowStyle(row: ExcelJS.Row) {
  row.eachCell((cell) => {
    cell.font = { bold: true, size: 11, color: { argb: HEADER_TEXT } }
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: HEADER_BG } }
    cell.alignment = { vertical: "middle", horizontal: "left" }
    cell.border = {
      top: { style: "thin", color: { argb: "FFE5E7EB" } },
      bottom: { style: "thin", color: { argb: "FFE5E7EB" } },
    }
  })
}

function buildInvoiceSheet(workbook: ExcelJS.Workbook, req: DocumentRequest) {
  const d = req.data || {}
  const sheet = workbook.addWorksheet("Facture", {
    pageSetup: { orientation: "portrait", paperSize: 9 },
    views: [{ showGridLines: false }],
  })

  sheet.columns = [
    { width: 38 },
    { width: 12 },
    { width: 18 },
    { width: 18 },
  ]

  sheet.mergeCells("A1:B1")
  sheet.getCell("A1").value = d.company_name || "[Votre entreprise]"
  sheet.getCell("A1").font = { bold: true, size: 16 }

  sheet.mergeCells("A2:B2")
  sheet.getCell("A2").value = d.company_address || "[Adresse]"
  sheet.getCell("A2").font = { color: { argb: GRAY }, size: 10 }

  sheet.mergeCells("A3:B3")
  sheet.getCell("A3").value = `SIRET: ${d.company_siret || ""}  -  TVA: ${d.company_tva || ""}`
  sheet.getCell("A3").font = { color: { argb: GRAY }, size: 9 }

  sheet.mergeCells("C1:D1")
  sheet.getCell("C1").value = "FACTURE"
  sheet.getCell("C1").font = { bold: true, size: 22, color: { argb: ACCENT } }
  sheet.getCell("C1").alignment = { horizontal: "right" }

  sheet.getCell("C2").value = "N:"
  sheet.getCell("C2").alignment = { horizontal: "right" }
  sheet.getCell("D2").value = d.invoice_number || ""

  sheet.getCell("C3").value = "Date:"
  sheet.getCell("C3").alignment = { horizontal: "right" }
  sheet.getCell("D3").value = d.invoice_date || new Date().toLocaleDateString("fr-FR")

  sheet.getCell("C4").value = "Echeance:"
  sheet.getCell("C4").alignment = { horizontal: "right" }
  sheet.getCell("D4").value = d.due_date || ""

  sheet.getCell("A6").value = "FACTURER A :"
  sheet.getCell("A6").font = { bold: true, color: { argb: GRAY }, size: 10 }

  sheet.mergeCells("A7:D7")
  sheet.getCell("A7").value = d.client_name || "[Nom du client]"
  sheet.getCell("A7").font = { bold: true, size: 12 }

  sheet.mergeCells("A8:D8")
  sheet.getCell("A8").value = d.client_address || "[Adresse]"
  sheet.getCell("A8").font = { color: { argb: GRAY }, size: 10 }

  const tableStartRow = 11
  const headers = ["Description", "Quantite", "Prix unit. HT", "Montant HT"]
  const headerRow = sheet.getRow(tableStartRow)
  headers.forEach((h, i) => {
    headerRow.getCell(i + 1).value = h
  })
  applyHeaderRowStyle(headerRow)

  const items = d.items || []
  let lastDataRow = tableStartRow
  if (items.length > 0) {
    items.forEach((item, idx) => {
      const row = sheet.getRow(tableStartRow + 1 + idx)
      row.getCell(1).value = item.description
      row.getCell(2).value = item.quantity
      row.getCell(3).value = item.unit_price
      row.getCell(3).numFmt = "#,##0.00 [$EUR];-#,##0.00 [$EUR]"
      row.getCell(4).value = { formula: `B${row.number}*C${row.number}` }
      row.getCell(4).numFmt = "#,##0.00 [$EUR];-#,##0.00 [$EUR]"
      lastDataRow = row.number
    })
  } else {
    sheet.getRow(tableStartRow + 1).getCell(1).value = "[Ajouter une ligne]"
    sheet.getRow(tableStartRow + 1).getCell(1).font = { italic: true, color: { argb: GRAY } }
    lastDataRow = tableStartRow + 1
  }

  const totalRow = lastDataRow + 2
  sheet.getCell(`C${totalRow}`).value = "Total HT"
  sheet.getCell(`C${totalRow}`).alignment = { horizontal: "right" }
  sheet.getCell(`D${totalRow}`).value = items.length > 0
    ? { formula: `SUM(D${tableStartRow + 1}:D${lastDataRow})` }
    : (d.total_ht ?? 0)
  sheet.getCell(`D${totalRow}`).numFmt = "#,##0.00 [$EUR];-#,##0.00 [$EUR]"

  sheet.getCell(`C${totalRow + 1}`).value = `TVA (${d.tva_rate ?? 20}%)`
  sheet.getCell(`C${totalRow + 1}`).alignment = { horizontal: "right" }
  sheet.getCell(`D${totalRow + 1}`).value = { formula: `D${totalRow}*${(d.tva_rate ?? 20) / 100}` }
  sheet.getCell(`D${totalRow + 1}`).numFmt = "#,##0.00 [$EUR];-#,##0.00 [$EUR]"

  sheet.getCell(`C${totalRow + 2}`).value = "Total TTC"
  sheet.getCell(`C${totalRow + 2}`).alignment = { horizontal: "right" }
  sheet.getCell(`C${totalRow + 2}`).font = { bold: true }
  sheet.getCell(`D${totalRow + 2}`).value = { formula: `D${totalRow}+D${totalRow + 1}` }
  sheet.getCell(`D${totalRow + 2}`).numFmt = "#,##0.00 [$EUR];-#,##0.00 [$EUR]"
  sheet.getCell(`D${totalRow + 2}`).font = { bold: true, size: 14, color: { argb: ACCENT } }
}

function buildExpenseAnalysisSheet(workbook: ExcelJS.Workbook, req: DocumentRequest) {
  const d = req.data || {}
  const sheet = workbook.addWorksheet("Analyse depenses", {
    views: [{ showGridLines: false }],
  })

  sheet.columns = [
    { header: "Categorie", key: "category", width: 28 },
    { header: "Description", key: "description", width: 38 },
    { header: "Date", key: "date", width: 14 },
    { header: "Montant HT", key: "amount", width: 16 },
    { header: "TVA", key: "vat", width: 12 },
  ]

  sheet.mergeCells("A1:E1")
  sheet.getCell("A1").value = req.title || "Analyse des depenses"
  sheet.getCell("A1").font = { bold: true, size: 16 }

  if (d.period) {
    sheet.mergeCells("A2:E2")
    sheet.getCell("A2").value = `Periode : ${d.period}`
    sheet.getCell("A2").font = { color: { argb: GRAY }, size: 10 }
  }

  const headerRow = sheet.getRow(4)
  headerRow.values = ["Categorie", "Description", "Date", "Montant HT", "TVA"]
  applyHeaderRowStyle(headerRow)

  const expenses = d.expenses || []
  let lastRow = 4
  expenses.forEach((exp, idx) => {
    const row = sheet.getRow(5 + idx)
    row.getCell(1).value = exp.category
    row.getCell(2).value = exp.description || ""
    row.getCell(3).value = exp.date || ""
    row.getCell(4).value = exp.amount
    row.getCell(4).numFmt = "#,##0.00 [$EUR]"
    row.getCell(5).value = exp.vat ?? 20
    row.getCell(5).numFmt = "0\"%\""
    lastRow = row.number
  })

  if (expenses.length > 0) {
    const totalRow = lastRow + 2
    sheet.getCell(`C${totalRow}`).value = "Total HT"
    sheet.getCell(`C${totalRow}`).alignment = { horizontal: "right" }
    sheet.getCell(`C${totalRow}`).font = { bold: true }
    sheet.getCell(`D${totalRow}`).value = { formula: `SUM(D5:D${lastRow})` }
    sheet.getCell(`D${totalRow}`).numFmt = "#,##0.00 [$EUR]"
    sheet.getCell(`D${totalRow}`).font = { bold: true, color: { argb: ACCENT } }
  }
}

function buildGenericReportSheet(workbook: ExcelJS.Workbook, req: DocumentRequest) {
  const sheet = workbook.addWorksheet("Rapport", { views: [{ showGridLines: false }] })
  // Largeur de base ; les tableaux ajusteront jusqu'a 6 colonnes
  sheet.columns = [{ width: 42 }, { width: 24 }, { width: 24 }, { width: 24 }, { width: 24 }, { width: 24 }]

  sheet.getCell("A1").value = req.title || "Rapport"
  sheet.getCell("A1").font = { bold: true, size: 18, color: { argb: ACCENT } }

  let row = 3
  if (req.data?.period) {
    sheet.getCell(`A${row}`).value = `Periode : ${req.data.period}`
    sheet.getCell(`A${row}`).font = { color: { argb: GRAY }, size: 10 }
    row += 2
  }

  if (req.content) {
    for (const block of parseMarkdown(req.content)) {
      switch (block.type) {
        case "heading": {
          const cell = sheet.getCell(`A${row}`)
          cell.value = spansToText(block.spans)
          cell.font = { bold: true, size: block.level === 1 ? 14 : block.level === 2 ? 12 : 11, color: { argb: block.level <= 2 ? ACCENT : HEADER_TEXT } }
          row += 1
          break
        }
        case "paragraph": {
          const cell = sheet.getCell(`A${row}`)
          sheet.mergeCells(`A${row}:F${row}`)
          cell.value = spansToText(block.spans)
          cell.font = { size: 11 }
          cell.alignment = { wrapText: true, vertical: "top" }
          row += 1
          break
        }
        case "bullet":
        case "ordered": {
          const cell = sheet.getCell(`A${row}`)
          sheet.mergeCells(`A${row}:F${row}`)
          const prefix = block.type === "ordered" ? `${block.index}. ` : "- "
          cell.value = `${"   ".repeat(block.level)}${prefix}${spansToText(block.spans)}`
          cell.font = { size: 11 }
          cell.alignment = { wrapText: true, vertical: "top" }
          row += 1
          break
        }
        case "quote": {
          const cell = sheet.getCell(`A${row}`)
          sheet.mergeCells(`A${row}:F${row}`)
          cell.value = spansToText(block.spans)
          cell.font = { size: 11, italic: true, color: { argb: GRAY } }
          row += 1
          break
        }
        case "divider":
          row += 1
          break
        case "table": {
          // En-tete
          block.headers.forEach((h, c) => {
            const cell = sheet.getCell(row, c + 1)
            cell.value = spansToText(h)
            cell.font = { bold: true, size: 11, color: { argb: HEADER_TEXT } }
            cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: HEADER_BG } }
            cell.alignment = { vertical: "middle" }
          })
          row += 1
          // Lignes
          for (const r of block.rows) {
            r.forEach((cellSpans, c) => {
              const cell = sheet.getCell(row, c + 1)
              cell.value = spansToText(cellSpans)
              cell.font = { size: 11 }
              cell.alignment = { vertical: "top", wrapText: true }
            })
            row += 1
          }
          row += 1
          break
        }
      }
    }
  }

  // Recommandations
  if (req.recommendations && req.recommendations.length > 0) {
    row += 1
    const head = sheet.getCell(`A${row}`)
    head.value = "Recommandations"
    head.font = { bold: true, size: 12, color: { argb: ACCENT } }
    row += 1
    for (const rec of req.recommendations) {
      const cell = sheet.getCell(`A${row}`)
      sheet.mergeCells(`A${row}:F${row}`)
      cell.value = `- ${rec}`
      cell.font = { size: 11 }
      cell.alignment = { wrapText: true, vertical: "top" }
      row += 1
    }
  }
}

export async function generateXlsx(req: DocumentRequest): Promise<GeneratedDocument> {
  const workbook = new ExcelJS.Workbook()
  workbook.creator = "OmnIA"
  workbook.created = new Date()

  let filename: string

  switch (req.type) {
    case "invoice":
      buildInvoiceSheet(workbook, req)
      filename = `facture-${req.data?.invoice_number || Date.now()}.xlsx`
      break
    case "expense_analysis":
      buildExpenseAnalysisSheet(workbook, req)
      filename = `depenses-${req.data?.period || Date.now()}.xlsx`
      break
    default:
      buildGenericReportSheet(workbook, req)
      filename = `${req.type}-${req.data?.period || Date.now()}.xlsx`
  }

  const buffer = await workbook.xlsx.writeBuffer()

  return {
    filename,
    buffer: Buffer.from(buffer),
    mimeType: FORMAT_MIME.xlsx,
    format: "xlsx",
  }
}
