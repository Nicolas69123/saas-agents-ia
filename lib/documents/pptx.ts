import PptxGenJS from "pptxgenjs"
import type { DocumentRequest, GeneratedDocument } from "./types"
import { FORMAT_MIME } from "./types"

const ACCENT = "4F46E5"
const TEXT_PRIMARY = "111827"
const TEXT_SECONDARY = "6B7280"

function addTitleSlide(pres: PptxGenJS, title: string, subtitle?: string) {
  const slide = pres.addSlide()
  slide.background = { color: "FFFFFF" }

  slide.addShape(pres.ShapeType.rect, {
    x: 0, y: 0, w: 10, h: 0.15,
    fill: { color: ACCENT },
    line: { color: ACCENT },
  })

  slide.addText(title, {
    x: 0.5, y: 2.5, w: 9, h: 1.5,
    fontSize: 40, bold: true, color: TEXT_PRIMARY, fontFace: "Calibri",
  })

  if (subtitle) {
    slide.addText(subtitle, {
      x: 0.5, y: 4, w: 9, h: 0.8,
      fontSize: 18, color: TEXT_SECONDARY, fontFace: "Calibri",
    })
  }

  slide.addText("OmnIA", {
    x: 0.5, y: 6.8, w: 4, h: 0.3,
    fontSize: 10, color: TEXT_SECONDARY, fontFace: "Calibri",
  })
}

function addContentSlide(
  pres: PptxGenJS,
  title: string,
  body?: string,
  bullets?: string[]
) {
  const slide = pres.addSlide()
  slide.background = { color: "FFFFFF" }

  slide.addShape(pres.ShapeType.rect, {
    x: 0, y: 0, w: 10, h: 0.08,
    fill: { color: ACCENT },
    line: { color: ACCENT },
  })

  slide.addText(title, {
    x: 0.5, y: 0.4, w: 9, h: 0.8,
    fontSize: 28, bold: true, color: TEXT_PRIMARY, fontFace: "Calibri",
  })

  let nextY = 1.4

  if (body) {
    slide.addText(body, {
      x: 0.5, y: nextY, w: 9, h: 1,
      fontSize: 14, color: TEXT_SECONDARY, fontFace: "Calibri",
      valign: "top",
    })
    nextY += 1.2
  }

  if (bullets && bullets.length > 0) {
    const bulletText = bullets.map((b) => ({
      text: b,
      options: {
        bullet: { code: "25CF" },
        fontSize: 16,
        color: TEXT_PRIMARY,
        paraSpaceAfter: 8,
      },
    }))
    slide.addText(bulletText, {
      x: 0.6, y: nextY, w: 8.8, h: 5,
      fontFace: "Calibri",
      valign: "top",
    })
  }
}

export async function generatePptx(req: DocumentRequest): Promise<GeneratedDocument> {
  const pres = new PptxGenJS()
  pres.author = "OmnIA"
  pres.company = req.data?.company_name || "OmnIA"
  pres.title = req.title
  pres.layout = "LAYOUT_WIDE"

  addTitleSlide(pres, req.title, req.data?.period || new Date().toLocaleDateString("fr-FR"))

  const slides = req.data?.slides || []
  if (slides.length > 0) {
    for (const s of slides) {
      addContentSlide(pres, s.title || "Slide", s.body, s.bullets)
    }
  } else if (req.content) {
    const sections: { title: string; body: string }[] = []
    let currentTitle = req.title
    let currentBody: string[] = []

    for (const line of req.content.split("\n")) {
      if (line.startsWith("# ") || line.startsWith("## ")) {
        if (currentBody.length > 0) {
          sections.push({ title: currentTitle, body: currentBody.join("\n") })
        }
        currentTitle = line.replace(/^#+\s*/, "")
        currentBody = []
      } else if (line.trim()) {
        currentBody.push(line)
      }
    }
    if (currentBody.length > 0) {
      sections.push({ title: currentTitle, body: currentBody.join("\n") })
    }

    for (const s of sections) {
      const bullets = s.body.split("\n").filter(l => l.startsWith("- ")).map(l => l.replace(/^-\s*/, ""))
      const body = s.body.split("\n").filter(l => !l.startsWith("- ")).join("\n").trim()
      addContentSlide(pres, s.title, body || undefined, bullets.length > 0 ? bullets : undefined)
    }
  }

  if (req.recommendations && req.recommendations.length > 0) {
    addContentSlide(pres, "Recommandations", undefined, req.recommendations)
  }

  const buffer = (await pres.write({ outputType: "nodebuffer" })) as Buffer

  const filename = `${req.type || "presentation"}-${req.data?.period || Date.now()}.pptx`

  return {
    filename,
    buffer,
    mimeType: FORMAT_MIME.pptx,
    format: "pptx",
  }
}
