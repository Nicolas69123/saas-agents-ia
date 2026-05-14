import PptxGenJS from "pptxgenjs"
import type { DocumentRequest, GeneratedDocument, SlideContent } from "./types"
import { FORMAT_MIME } from "./types"
import { findImageBuffer } from "./pexels-service"

interface Theme {
  name: string
  bgPrimary: string
  bgSecondary: string
  accent: string
  accentDark: string
  textPrimary: string
  textSecondary: string
  textOnAccent: string
  fontFace: string
  fontFaceBold: string
}

const THEMES: Record<string, Theme> = {
  business: {
    name: "business",
    bgPrimary: "FFFFFF",
    bgSecondary: "F8F9FA",
    accent: "4F46E5",
    accentDark: "3730A3",
    textPrimary: "111827",
    textSecondary: "6B7280",
    textOnAccent: "FFFFFF",
    fontFace: "Calibri",
    fontFaceBold: "Calibri",
  },
  marketing: {
    name: "marketing",
    bgPrimary: "FFFFFF",
    bgSecondary: "FDF4FF",
    accent: "DB2777",
    accentDark: "BE185D",
    textPrimary: "111827",
    textSecondary: "6B7280",
    textOnAccent: "FFFFFF",
    fontFace: "Calibri",
    fontFaceBold: "Calibri",
  },
  finance: {
    name: "finance",
    bgPrimary: "FFFFFF",
    bgSecondary: "F0FDF4",
    accent: "059669",
    accentDark: "047857",
    textPrimary: "111827",
    textSecondary: "6B7280",
    textOnAccent: "FFFFFF",
    fontFace: "Calibri",
    fontFaceBold: "Calibri",
  },
  dark: {
    name: "dark",
    bgPrimary: "111827",
    bgSecondary: "1F2937",
    accent: "60A5FA",
    accentDark: "3B82F6",
    textPrimary: "F9FAFB",
    textSecondary: "9CA3AF",
    textOnAccent: "111827",
    fontFace: "Calibri",
    fontFaceBold: "Calibri",
  },
}

function getTheme(name?: string): Theme {
  if (name && THEMES[name]) return THEMES[name]
  return THEMES.business
}

// ----- Slide builders -----

function addAccentBar(slide: PptxGenJS.Slide, theme: Theme) {
  slide.addShape("rect", {
    x: 0,
    y: 0,
    w: 13.33,
    h: 0.08,
    fill: { color: theme.accent },
    line: { color: theme.accent, width: 0 },
  })
}

function addPageFooter(slide: PptxGenJS.Slide, theme: Theme, pageNum: number, total: number, companyName?: string) {
  slide.addText(companyName || "OmnIA", {
    x: 0.5,
    y: 7.2,
    w: 6,
    h: 0.3,
    fontSize: 9,
    color: theme.textSecondary,
    fontFace: theme.fontFace,
  })
  slide.addText(`${pageNum} / ${total}`, {
    x: 12.3,
    y: 7.2,
    w: 0.8,
    h: 0.3,
    fontSize: 9,
    color: theme.textSecondary,
    fontFace: theme.fontFace,
    align: "right",
  })
}

async function addTitleSlide(
  pres: PptxGenJS,
  theme: Theme,
  title: string,
  subtitle?: string,
  imageBuffer?: Buffer
) {
  const slide = pres.addSlide()

  // Full-height image on the right side, gradient overlay
  if (imageBuffer) {
    slide.background = { color: theme.bgPrimary }

    slide.addImage({
      data: `data:image/jpeg;base64,${imageBuffer.toString("base64")}`,
      x: 6.67,
      y: 0,
      w: 6.66,
      h: 7.5,
      sizing: { type: "cover", w: 6.66, h: 7.5 },
    })

    // Dark gradient overlay on left of image for text readability
    slide.addShape("rect", {
      x: 6.67,
      y: 0,
      w: 1,
      h: 7.5,
      fill: { color: theme.bgPrimary, transparency: 30 },
      line: { color: theme.bgPrimary, width: 0 },
    })

    // Left content area
    slide.addShape("rect", {
      x: 0,
      y: 0,
      w: 6.67,
      h: 7.5,
      fill: { color: theme.bgSecondary },
      line: { color: theme.bgSecondary, width: 0 },
    })
  } else {
    slide.background = { color: theme.bgSecondary }
  }

  // Decorative accent stripe
  slide.addShape("rect", {
    x: 0.7,
    y: 2.3,
    w: 0.08,
    h: 2,
    fill: { color: theme.accent },
    line: { color: theme.accent, width: 0 },
  })

  slide.addText(title, {
    x: 1,
    y: 2.3,
    w: imageBuffer ? 5.5 : 11,
    h: 2,
    fontSize: 44,
    bold: true,
    color: theme.textPrimary,
    fontFace: theme.fontFaceBold,
    valign: "middle",
  })

  if (subtitle) {
    slide.addText(subtitle, {
      x: 1,
      y: 4.4,
      w: imageBuffer ? 5.5 : 11,
      h: 0.8,
      fontSize: 18,
      color: theme.textSecondary,
      fontFace: theme.fontFace,
    })
  }

  slide.addText("OmnIA", {
    x: 1,
    y: 6.8,
    w: 4,
    h: 0.3,
    fontSize: 10,
    color: theme.accent,
    fontFace: theme.fontFace,
    bold: true,
  })
}

async function addContentSlide(
  pres: PptxGenJS,
  theme: Theme,
  slideData: SlideContent,
  imageBuffer: Buffer | undefined,
  pageNum: number,
  total: number,
  companyName?: string
) {
  const slide = pres.addSlide()
  slide.background = { color: theme.bgPrimary }
  addAccentBar(slide, theme)

  const hasImage = !!imageBuffer

  // Title
  slide.addText(slideData.title || "Slide", {
    x: 0.5,
    y: 0.4,
    w: hasImage ? 8.5 : 12.3,
    h: 0.8,
    fontSize: 28,
    bold: true,
    color: theme.textPrimary,
    fontFace: theme.fontFaceBold,
  })

  // Subtitle (small accent underline)
  slide.addShape("rect", {
    x: 0.5,
    y: 1.25,
    w: 0.6,
    h: 0.05,
    fill: { color: theme.accent },
    line: { color: theme.accent, width: 0 },
  })

  let nextY = 1.6

  if (slideData.body) {
    slide.addText(slideData.body, {
      x: 0.5,
      y: nextY,
      w: hasImage ? 8.5 : 12.3,
      h: 1.2,
      fontSize: 14,
      color: theme.textSecondary,
      fontFace: theme.fontFace,
      valign: "top",
    })
    nextY += 1.3
  }

  if (slideData.bullets && slideData.bullets.length > 0) {
    const bulletObjs = slideData.bullets.map((b) => ({
      text: b,
      options: {
        bullet: { code: "25CF" },
        fontSize: 15,
        color: theme.textPrimary,
        paraSpaceAfter: 12,
      },
    }))
    slide.addText(bulletObjs, {
      x: 0.6,
      y: nextY,
      w: hasImage ? 8.4 : 12.2,
      h: 5,
      fontFace: theme.fontFace,
      valign: "top",
    })
  }

  // Image on the right with rounded effect (decorative bg)
  if (imageBuffer) {
    slide.addShape("rect", {
      x: 9.3,
      y: 1.5,
      w: 3.7,
      h: 5,
      fill: { color: theme.bgSecondary },
      line: { color: theme.bgSecondary, width: 0 },
    })
    slide.addImage({
      data: `data:image/jpeg;base64,${imageBuffer.toString("base64")}`,
      x: 9.4,
      y: 1.6,
      w: 3.5,
      h: 4.8,
      sizing: { type: "cover", w: 3.5, h: 4.8 },
    })
  }

  addPageFooter(slide, theme, pageNum, total, companyName)
}

async function addBulletsOnlySlide(
  pres: PptxGenJS,
  theme: Theme,
  slideData: SlideContent,
  pageNum: number,
  total: number,
  companyName?: string
) {
  const slide = pres.addSlide()
  slide.background = { color: theme.bgPrimary }
  addAccentBar(slide, theme)

  slide.addText(slideData.title || "Slide", {
    x: 0.5,
    y: 0.5,
    w: 12.3,
    h: 0.9,
    fontSize: 32,
    bold: true,
    color: theme.textPrimary,
    fontFace: theme.fontFaceBold,
  })

  slide.addShape("rect", {
    x: 0.5,
    y: 1.45,
    w: 0.8,
    h: 0.06,
    fill: { color: theme.accent },
    line: { color: theme.accent, width: 0 },
  })

  if (slideData.bullets && slideData.bullets.length > 0) {
    const bulletObjs = slideData.bullets.map((b) => ({
      text: b,
      options: {
        bullet: { code: "25CF" },
        fontSize: 18,
        color: theme.textPrimary,
        paraSpaceAfter: 16,
      },
    }))
    slide.addText(bulletObjs, {
      x: 0.7,
      y: 1.9,
      w: 12,
      h: 5.5,
      fontFace: theme.fontFace,
      valign: "top",
    })
  }

  addPageFooter(slide, theme, pageNum, total, companyName)
}

async function addClosingSlide(
  pres: PptxGenJS,
  theme: Theme,
  title: string,
  contactInfo?: string
) {
  const slide = pres.addSlide()
  slide.background = { color: theme.accent }

  slide.addText(title, {
    x: 1,
    y: 3,
    w: 11.3,
    h: 1.5,
    fontSize: 56,
    bold: true,
    color: theme.textOnAccent,
    fontFace: theme.fontFaceBold,
    align: "center",
  })

  if (contactInfo) {
    slide.addText(contactInfo, {
      x: 1,
      y: 4.6,
      w: 11.3,
      h: 0.8,
      fontSize: 16,
      color: theme.textOnAccent,
      fontFace: theme.fontFace,
      align: "center",
    })
  }
}

// ----- Section parser for content with no explicit slides -----

function parseContentToSlides(content: string): SlideContent[] {
  const sections: SlideContent[] = []
  let currentTitle = ""
  let currentBody: string[] = []

  const flush = () => {
    if (!currentTitle && currentBody.length === 0) return
    const bullets = currentBody.filter((l) => l.startsWith("- ")).map((l) => l.replace(/^-\s*/, ""))
    const body = currentBody.filter((l) => !l.startsWith("- ")).join("\n").trim()
    sections.push({
      title: currentTitle || "Slide",
      body: body || undefined,
      bullets: bullets.length > 0 ? bullets : undefined,
    })
    currentTitle = ""
    currentBody = []
  }

  for (const line of content.split("\n")) {
    if (line.startsWith("# ") || line.startsWith("## ")) {
      flush()
      currentTitle = line.replace(/^#+\s*/, "")
    } else if (line.trim()) {
      currentBody.push(line)
    }
  }
  flush()

  return sections
}

// ----- Image query helper -----

async function fetchImageForSlide(slide: SlideContent): Promise<Buffer | undefined> {
  const query = slide.imageQuery
  if (!query) return undefined
  const result = await findImageBuffer(query)
  return result?.buffer
}

// ----- Main entry point -----

export async function generatePptx(req: DocumentRequest): Promise<GeneratedDocument> {
  const pres = new PptxGenJS()
  pres.author = "OmnIA"
  pres.company = req.data?.company_name || "OmnIA"
  pres.title = req.title
  pres.layout = "LAYOUT_WIDE"

  const themeName = req.data?.theme || (
    req.type === "client_deck" || req.type === "pitch_deck" ? "marketing"
    : req.type === "balance_sheet" ? "finance"
    : "business"
  )
  const theme = getTheme(themeName)

  // Resolve slides list
  let slides: SlideContent[] = req.data?.slides || []
  if (slides.length === 0 && req.content) {
    slides = parseContentToSlides(req.content)
  }

  const period = req.data?.period || new Date().toLocaleDateString("fr-FR")
  const totalSlides = 1 + slides.length + (req.recommendations && req.recommendations.length > 0 ? 1 : 0) + 1

  // 1. Title slide (with optional cover image)
  let coverImage: Buffer | undefined
  if (slides.length > 0 && slides[0].imageQuery) {
    coverImage = await fetchImageForSlide(slides[0])
  } else if (req.title) {
    const result = await findImageBuffer(req.title)
    coverImage = result?.buffer
  }
  await addTitleSlide(pres, theme, req.title, period, coverImage)

  // 2. Content slides
  for (let i = 0; i < slides.length; i++) {
    const s = slides[i]
    const imageBuffer = await fetchImageForSlide(s)
    const pageNum = i + 2

    if (s.bullets && s.bullets.length > 4 && !imageBuffer) {
      await addBulletsOnlySlide(pres, theme, s, pageNum, totalSlides, req.data?.company_name)
    } else {
      await addContentSlide(pres, theme, s, imageBuffer, pageNum, totalSlides, req.data?.company_name)
    }
  }

  // 3. Recommendations slide (if any)
  if (req.recommendations && req.recommendations.length > 0) {
    await addBulletsOnlySlide(
      pres,
      theme,
      { title: "Recommandations", bullets: req.recommendations },
      slides.length + 2,
      totalSlides,
      req.data?.company_name
    )
  }

  // 4. Closing slide
  const contact = req.data?.company_email || req.data?.company_phone || ""
  await addClosingSlide(pres, theme, "Merci", contact || undefined)

  const buffer = (await pres.write({ outputType: "nodebuffer" })) as Buffer
  const filename = `${req.type || "presentation"}-${(req.data?.period || "").replace(/\s+/g, "-") || Date.now()}.pptx`

  return {
    filename,
    buffer,
    mimeType: FORMAT_MIME.pptx,
    format: "pptx",
  }
}
