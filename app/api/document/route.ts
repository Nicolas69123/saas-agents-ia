import { NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { existsSync } from "fs"
import path from "path"
import { generateDocx } from "@/lib/documents/docx"
import { generateXlsx } from "@/lib/documents/xlsx"
import { generatePptx } from "@/lib/documents/pptx"
import { generatePdf, convertToPdfWithLibreOffice } from "@/lib/documents/pdf"
import type { DocumentRequest, GeneratedDocument } from "@/lib/documents/types"

const DOCS_DIR = path.join(process.cwd(), "public", "documents")

const TYPE_TO_FORMAT: Record<string, "docx" | "xlsx" | "pptx" | "pdf"> = {
  invoice: "docx",
  monthly_report: "docx",
  quarterly_report: "docx",
  expense_analysis: "xlsx",
  balance_sheet: "xlsx",
  vat_check: "docx",
  presentation: "pptx",
  client_deck: "pptx",
  pitch_deck: "pptx",
  contract: "pdf",
  certificate: "pdf",
}

function resolveFormat(req: DocumentRequest): "docx" | "xlsx" | "pptx" | "pdf" {
  if (req.format) return req.format
  return TYPE_TO_FORMAT[req.type] || "docx"
}

async function generateForFormat(
  format: "docx" | "xlsx" | "pptx" | "pdf",
  req: DocumentRequest
): Promise<GeneratedDocument> {
  switch (format) {
    case "docx":
      return generateDocx(req)
    case "xlsx":
      return generateXlsx(req)
    case "pptx":
      return generatePptx(req)
    case "pdf":
      return generatePdf(req)
  }
}

async function tryGeneratePreviewPdf(doc: GeneratedDocument, safeBaseName: string) {
  if (doc.format === "pdf") {
    return { previewUrl: `/api/documents/${safeBaseName}`, previewFilename: safeBaseName }
  }

  try {
    const pdfBuffer = await convertToPdfWithLibreOffice(doc.buffer, doc.format)
    const previewFilename = safeBaseName.replace(/\.(docx|xlsx|pptx)$/, ".preview.pdf")
    await writeFile(path.join(DOCS_DIR, previewFilename), pdfBuffer)
    return {
      previewUrl: `/api/documents/${previewFilename}`,
      previewFilename,
    }
  } catch (err) {
    console.error("[DOCUMENT] LibreOffice preview failed:", err)
    return { previewUrl: null, previewFilename: null }
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: DocumentRequest = await request.json()

    if (!body.type) {
      return NextResponse.json({ error: "Type de document requis" }, { status: 400 })
    }

    const format = resolveFormat(body)
    const doc = await generateForFormat(format, body)

    if (!existsSync(DOCS_DIR)) {
      await mkdir(DOCS_DIR, { recursive: true })
    }

    const safeName = doc.filename.replace(/[^a-zA-Z0-9._-]/g, "_")
    await writeFile(path.join(DOCS_DIR, safeName), doc.buffer)

    const preview = await tryGeneratePreviewPdf(doc, safeName)

    return NextResponse.json({
      success: true,
      url: `/api/documents/${safeName}`,
      filename: safeName,
      size: doc.buffer.length,
      format: doc.format,
      mimeType: doc.mimeType,
      previewUrl: preview.previewUrl,
      previewFilename: preview.previewFilename,
    })
  } catch (error) {
    console.error("[DOCUMENT] Erreur generation:", error)
    return NextResponse.json({ error: "Erreur lors de la generation du document" }, { status: 500 })
  }
}
