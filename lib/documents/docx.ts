import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, BorderStyle, AlignmentType, HeadingLevel } from "docx"
import type { DocumentRequest, GeneratedDocument } from "./types"
import { FORMAT_MIME } from "./types"

function buildInvoiceDoc(invoice: DocumentRequest): Document {
  const d = invoice.data || {}
  const items = d.items || []

  const noBorder = { style: BorderStyle.NONE }

  const headerRows = [
    new TableRow({
      children: [
        new TableCell({
          width: { size: 50, type: WidthType.PERCENTAGE },
          borders: { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder },
          children: [
            new Paragraph({ children: [new TextRun({ text: d.company_name || "[Votre entreprise]", bold: true, size: 28 })] }),
            new Paragraph({ children: [new TextRun({ text: d.company_address || "[Adresse]", size: 20, color: "666666" })] }),
            new Paragraph({ children: [new TextRun({ text: `SIRET: ${d.company_siret || "[A completer]"}`, size: 18, color: "888888" })] }),
            new Paragraph({ children: [new TextRun({ text: `TVA: ${d.company_tva || "[A completer]"}`, size: 18, color: "888888" })] }),
          ],
        }),
        new TableCell({
          width: { size: 50, type: WidthType.PERCENTAGE },
          borders: { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder },
          children: [
            new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: "FACTURE", bold: true, size: 40, color: "4F46E5" })] }),
            new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: `N: ${d.invoice_number || "[Numero]"}`, size: 20 })] }),
            new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: `Date: ${d.invoice_date || new Date().toLocaleDateString("fr-FR")}`, size: 20 })] }),
            new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: `Echeance: ${d.due_date || "[A definir]"}`, size: 20 })] }),
          ],
        }),
      ],
    }),
  ]

  const clientSection = [
    new Paragraph({ spacing: { before: 400 }, children: [new TextRun({ text: "FACTURER A :", bold: true, size: 20, color: "888888" })] }),
    new Paragraph({ children: [new TextRun({ text: d.client_name || "[Nom du client]", bold: true, size: 24 })] }),
    new Paragraph({ children: [new TextRun({ text: d.client_address || "[Adresse du client]", size: 20, color: "666666" })] }),
    ...(d.client_siret ? [new Paragraph({ children: [new TextRun({ text: `SIRET: ${d.client_siret}`, size: 18, color: "888888" })] })] : []),
  ]

  const tableHeaderRow = new TableRow({
    tableHeader: true,
    children: ["Description", "Qte", "Prix unit. HT", "Montant HT"].map((text, i) =>
      new TableCell({
        width: { size: i === 0 ? 50 : 16, type: WidthType.PERCENTAGE },
        shading: { fill: "F3F4F6" },
        children: [new Paragraph({
          alignment: i > 0 ? AlignmentType.RIGHT : AlignmentType.LEFT,
          children: [new TextRun({ text, bold: true, size: 18, color: "374151" })],
        })],
      })
    ),
  })

  const itemRows = items.length > 0
    ? items.map(item => new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: item.description, size: 20 })] })] }),
          new TableCell({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: String(item.quantity), size: 20 })] })] }),
          new TableCell({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: `${item.unit_price.toFixed(2)} EUR`, size: 20 })] })] }),
          new TableCell({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: `${item.amount.toFixed(2)} EUR`, size: 20 })] })] }),
        ],
      }))
    : [new TableRow({
        children: [
          new TableCell({ columnSpan: 4, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "[Ajouter les lignes de facturation]", size: 20, color: "999999", italics: true })] })] }),
        ],
      })]

  const totalsSection = [
    new Paragraph({ spacing: { before: 300 }, alignment: AlignmentType.RIGHT, children: [new TextRun({ text: `Total HT : ${(d.total_ht ?? 0).toFixed(2)} EUR`, size: 22 })] }),
    new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: `TVA (${d.tva_rate ?? 20}%) : ${(d.tva_amount ?? 0).toFixed(2)} EUR`, size: 22 })] }),
    new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: `Total TTC : ${(d.total_ttc ?? 0).toFixed(2)} EUR`, bold: true, size: 28 })] }),
  ]

  const footerSection = [
    new Paragraph({ spacing: { before: 600 }, children: [new TextRun({ text: `Conditions de paiement : ${d.payment_terms || "A 30 jours"}`, size: 18, color: "888888" })] }),
    new Paragraph({ children: [new TextRun({ text: `Mode de paiement : ${d.payment_method || "Virement bancaire"}`, size: 18, color: "888888" })] }),
    ...(d.iban ? [new Paragraph({ children: [new TextRun({ text: `IBAN : ${d.iban}`, size: 18, color: "888888" })] })] : []),
    new Paragraph({ spacing: { before: 300 }, children: [new TextRun({ text: "En cas de retard de paiement, une penalite de 3 fois le taux d'interet legal sera appliquee, ainsi qu'une indemnite forfaitaire de 40 EUR pour frais de recouvrement (art. L.441-10 du Code de commerce).", size: 14, color: "AAAAAA" })] }),
  ]

  return new Document({
    sections: [{
      children: [
        new Table({ rows: headerRows, width: { size: 100, type: WidthType.PERCENTAGE } }),
        ...clientSection,
        new Paragraph({ spacing: { before: 400 }, text: "" }),
        new Table({ rows: [tableHeaderRow, ...itemRows], width: { size: 100, type: WidthType.PERCENTAGE } }),
        ...totalsSection,
        ...footerSection,
      ],
    }],
  })
}

function buildReportDoc(report: DocumentRequest): Document {
  const sections: Paragraph[] = [
    new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun({ text: report.title || "Rapport", bold: true })] }),
    new Paragraph({ spacing: { before: 200 }, children: [new TextRun({ text: report.data?.period ? `Periode : ${report.data.period}` : `Date : ${new Date().toLocaleDateString("fr-FR")}`, color: "666666" })] }),
  ]

  if (report.content) {
    for (const line of report.content.split("\n")) {
      if (line.startsWith("# ")) {
        sections.push(new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun({ text: line.replace("# ", "") })] }))
      } else if (line.startsWith("## ")) {
        sections.push(new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: line.replace("## ", "") })] }))
      } else if (line.startsWith("- ")) {
        sections.push(new Paragraph({ bullet: { level: 0 }, children: [new TextRun({ text: line.replace("- ", "") })] }))
      } else if (line.trim()) {
        sections.push(new Paragraph({ children: [new TextRun({ text: line })] }))
      }
    }
  }

  if (report.recommendations && report.recommendations.length > 0) {
    sections.push(new Paragraph({ spacing: { before: 400 }, heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: "Recommandations" })] }))
    for (const rec of report.recommendations) {
      sections.push(new Paragraph({ bullet: { level: 0 }, children: [new TextRun({ text: rec })] }))
    }
  }

  return new Document({ sections: [{ children: sections }] })
}

export async function generateDocx(req: DocumentRequest): Promise<GeneratedDocument> {
  let doc: Document
  let filename: string

  switch (req.type) {
    case "invoice":
      doc = buildInvoiceDoc(req)
      filename = `facture-${req.data?.invoice_number || Date.now()}.docx`
      break
    case "monthly_report":
    case "quarterly_report":
    case "expense_analysis":
    case "balance_sheet":
    case "vat_check":
      doc = buildReportDoc(req)
      filename = `${req.type}-${req.data?.period || Date.now()}.docx`
      break
    default:
      doc = buildReportDoc(req)
      filename = `document-${Date.now()}.docx`
  }

  const buffer = await Packer.toBuffer(doc)

  return {
    filename,
    buffer,
    mimeType: FORMAT_MIME.docx,
    format: "docx",
  }
}
