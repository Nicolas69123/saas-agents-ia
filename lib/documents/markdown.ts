// Parser markdown partage par tous les generateurs de documents (DOCX/PDF/XLSX).
// Transforme du markdown en une liste de blocs structures, et fournit un parseur
// inline (gras/italique/code) reutilisable. Volontairement simple et robuste :
// couvre les besoins reels des agents (titres, listes, tableaux, citations, separateurs).

export type InlineSpan = {
  text: string
  bold?: boolean
  italic?: boolean
  code?: boolean
}

export type MdBlock =
  | { type: 'heading'; level: 1 | 2 | 3; spans: InlineSpan[] }
  | { type: 'paragraph'; spans: InlineSpan[] }
  | { type: 'bullet'; level: number; spans: InlineSpan[] }
  | { type: 'ordered'; level: number; index: number; spans: InlineSpan[] }
  | { type: 'table'; headers: InlineSpan[][]; rows: InlineSpan[][][] }
  | { type: 'quote'; spans: InlineSpan[] }
  | { type: 'divider' }

// --- Inline : **gras**, *italique* / _italique_, `code` ---
export function parseInline(text: string): InlineSpan[] {
  const spans: InlineSpan[] = []
  // Tokenise sur **, *, _, ` en gardant les delimiteurs
  const re = /(\*\*[^*]+\*\*|\*[^*]+\*|_[^_]+_|`[^`]+`)/g
  let last = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) spans.push({ text: text.slice(last, m.index) })
    const tok = m[0]
    if (tok.startsWith('**')) spans.push({ text: tok.slice(2, -2), bold: true })
    else if (tok.startsWith('`')) spans.push({ text: tok.slice(1, -1), code: true })
    else if (tok.startsWith('*')) spans.push({ text: tok.slice(1, -1), italic: true })
    else if (tok.startsWith('_')) spans.push({ text: tok.slice(1, -1), italic: true })
    last = m.index + tok.length
  }
  if (last < text.length) spans.push({ text: text.slice(last) })
  return spans.length ? spans : [{ text }]
}

function splitTableRow(line: string): string[] {
  // | a | b | c |  -> ["a","b","c"]
  let s = line.trim()
  if (s.startsWith('|')) s = s.slice(1)
  if (s.endsWith('|')) s = s.slice(0, -1)
  return s.split('|').map((c) => c.trim())
}

function isTableSeparator(line: string): boolean {
  // | --- | :--: | ---: |
  return /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?\s*$/.test(line)
}

function indentLevel(line: string): number {
  const m = line.match(/^(\s*)/)
  if (!m) return 0
  return Math.floor(m[1].replace(/\t/g, '  ').length / 2)
}

// Certains agents produisent des tableaux "aplatis" sur une seule ligne :
//   | A | B | | --- | --- | | x | y | | z | w |
// On re-decoupe ces sequences en plusieurs lignes pour que le parser de tableau
// les reconnaisse. Heuristique : une ligne contenant 3+ "|" et la sequence " | | "
// (fin d'une ligne collee au debut de la suivante) est re-segmentee.
function normalizeFlatTables(md: string): string {
  return md
    .split('\n')
    .map((line) => {
      const pipes = (line.match(/\|/g) || []).length
      // Ne traiter que les lignes qui ressemblent a du tableau colle
      if (pipes < 5 || !line.includes('| |')) return line
      // Coupe a chaque frontiere "| |" -> "|\n|"
      return line.replace(/\|\s*\|/g, '|\n|')
    })
    .join('\n')
}

/** Transforme un texte markdown en blocs structures. */
export function parseMarkdown(md: string): MdBlock[] {
  const blocks: MdBlock[] = []
  const lines = normalizeFlatTables(md.replace(/\r\n/g, '\n')).split('\n')
  let i = 0

  while (i < lines.length) {
    const raw = lines[i]
    const line = raw.trim()

    // Ligne vide
    if (!line) { i++; continue }

    // Separateur ---
    if (/^(-{3,}|\*{3,}|_{3,})$/.test(line)) {
      blocks.push({ type: 'divider' })
      i++; continue
    }

    // Titres
    const h = line.match(/^(#{1,3})\s+(.*)$/)
    if (h) {
      const level = h[1].length as 1 | 2 | 3
      blocks.push({ type: 'heading', level, spans: parseInline(h[2]) })
      i++; continue
    }

    // Tableau : ligne courante + separateur juste apres
    if (line.includes('|') && i + 1 < lines.length && isTableSeparator(lines[i + 1])) {
      const headers = splitTableRow(line).map(parseInline)
      i += 2
      const rows: InlineSpan[][][] = []
      while (i < lines.length && lines[i].trim().includes('|') && lines[i].trim()) {
        rows.push(splitTableRow(lines[i]).map(parseInline))
        i++
      }
      blocks.push({ type: 'table', headers, rows })
      continue
    }

    // Citation
    if (line.startsWith('> ')) {
      blocks.push({ type: 'quote', spans: parseInline(line.slice(2)) })
      i++; continue
    }

    // Liste a puces : -, *, +
    const bullet = raw.match(/^\s*[-*+]\s+(.*)$/)
    if (bullet) {
      blocks.push({ type: 'bullet', level: indentLevel(raw), spans: parseInline(bullet[1]) })
      i++; continue
    }

    // Liste numerotee : 1. 2. ...
    const ordered = raw.match(/^\s*(\d+)[.)]\s+(.*)$/)
    if (ordered) {
      blocks.push({ type: 'ordered', level: indentLevel(raw), index: parseInt(ordered[1], 10), spans: parseInline(ordered[2]) })
      i++; continue
    }

    // Paragraphe (par defaut)
    blocks.push({ type: 'paragraph', spans: parseInline(line) })
    i++
  }

  return blocks
}

/** Texte brut d'une suite de spans (pour formats sans style inline, ex. cellules simples). */
export function spansToText(spans: InlineSpan[]): string {
  return spans.map((s) => s.text).join('')
}
