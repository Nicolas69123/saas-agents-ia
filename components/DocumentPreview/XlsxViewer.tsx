'use client'

import { useEffect, useState } from 'react'
import { Workbook } from '@fortune-sheet/react'
import type { Sheet, CellWithRowAndCol } from '@fortune-sheet/core'
import ExcelJS from 'exceljs'
import '@fortune-sheet/react/dist/index.css'

interface XlsxViewerProps {
  url: string
  height?: number | string
  readonly?: boolean
}

interface CellData {
  v?: string | number | boolean | null
  m?: string
  bg?: string
  fc?: string
  ff?: string
  fs?: number
  bl?: number
  it?: number
  ht?: number
  vt?: number
  mc?: { r: number; c: number; rs: number; cs: number }
}

function argbToHex(argb?: string): string | undefined {
  if (!argb) return undefined
  if (argb.length === 8) return `#${argb.slice(2)}`
  if (argb.length === 6) return `#${argb}`
  return undefined
}

async function xlsxToFortuneSheet(buffer: ArrayBuffer): Promise<Sheet[]> {
  const wb = new ExcelJS.Workbook()
  await wb.xlsx.load(buffer)

  const sheets: Sheet[] = []

  wb.eachSheet((worksheet, sheetIndex) => {
    const celldata: CellWithRowAndCol[] = []
    const merges: { r: number; c: number; rs: number; cs: number }[] = []

    if (worksheet.model.merges) {
      for (const range of worksheet.model.merges) {
        const [start, end] = range.split(':')
        const startMatch = start.match(/^([A-Z]+)(\d+)$/)
        const endMatch = end.match(/^([A-Z]+)(\d+)$/)
        if (!startMatch || !endMatch) continue

        const colToNum = (col: string) =>
          col.split('').reduce((acc, ch) => acc * 26 + (ch.charCodeAt(0) - 64), 0) - 1

        const r1 = parseInt(startMatch[2]) - 1
        const c1 = colToNum(startMatch[1])
        const r2 = parseInt(endMatch[2]) - 1
        const c2 = colToNum(endMatch[1])

        merges.push({ r: r1, c: c1, rs: r2 - r1 + 1, cs: c2 - c1 + 1 })
      }
    }

    worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      row.eachCell({ includeEmpty: false }, (cell, colNumber) => {
        const r = rowNumber - 1
        const c = colNumber - 1

        const cellData: CellData = {}

        const value = cell.value
        if (value === null || value === undefined) {
          cellData.v = null
        } else if (typeof value === 'object' && 'result' in value) {
          cellData.v = (value as { result: string | number | boolean }).result
          cellData.m = String(cellData.v ?? '')
        } else if (typeof value === 'object' && 'text' in value) {
          cellData.v = (value as { text: string }).text
          cellData.m = String(cellData.v ?? '')
        } else if (value instanceof Date) {
          cellData.v = value.toLocaleDateString('fr-FR')
          cellData.m = cellData.v
        } else if (typeof value === 'object' && 'richText' in value) {
          cellData.v = (value as { richText: { text: string }[] }).richText.map(r => r.text).join('')
          cellData.m = String(cellData.v)
        } else {
          cellData.v = value as string | number | boolean
          cellData.m = String(cellData.v ?? '')
        }

        if (cell.font) {
          if (cell.font.bold) cellData.bl = 1
          if (cell.font.italic) cellData.it = 1
          if (cell.font.size) cellData.fs = cell.font.size
          if (cell.font.name) cellData.ff = cell.font.name
          if (cell.font.color && 'argb' in cell.font.color) {
            cellData.fc = argbToHex(cell.font.color.argb)
          }
        }

        if (cell.fill && cell.fill.type === 'pattern' && 'fgColor' in cell.fill) {
          const fg = cell.fill.fgColor
          if (fg && 'argb' in fg) {
            cellData.bg = argbToHex(fg.argb)
          }
        }

        if (cell.alignment) {
          if (cell.alignment.horizontal === 'center') cellData.ht = 0
          else if (cell.alignment.horizontal === 'right') cellData.ht = 2
          else cellData.ht = 1

          if (cell.alignment.vertical === 'top') cellData.vt = 1
          else if (cell.alignment.vertical === 'bottom') cellData.vt = 2
          else cellData.vt = 0
        }

        celldata.push({ r, c, v: cellData as unknown as Parameters<typeof celldata.push>[0]['v'] })
      })
    })

    const columnWidths: Record<number, number> = {}
    if (worksheet.columns) {
      worksheet.columns.forEach((col, idx) => {
        if (col.width) {
          columnWidths[idx] = Math.round(col.width * 7.5)
        }
      })
    }

    const config: Sheet['config'] = {}
    if (merges.length > 0) {
      const mergeMap: Record<string, { r: number; c: number; rs: number; cs: number }> = {}
      for (const m of merges) {
        mergeMap[`${m.r}_${m.c}`] = m
      }
      config.merge = mergeMap
    }
    if (Object.keys(columnWidths).length > 0) {
      config.columnlen = columnWidths
    }

    sheets.push({
      name: worksheet.name || `Feuille ${sheetIndex + 1}`,
      celldata,
      config,
      order: sheetIndex,
      status: sheetIndex === 0 ? 1 : 0,
      column: Math.max(worksheet.columnCount || 8, 8),
      row: Math.max(worksheet.rowCount || 30, 30),
    })
  })

  return sheets
}

export default function XlsxViewer({ url, height = 600, readonly = true }: XlsxViewerProps) {
  const [sheets, setSheets] = useState<Sheet[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      try {
        setError(null)
        const response = await fetch(url)
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        const buffer = await response.arrayBuffer()
        if (cancelled) return

        const data = await xlsxToFortuneSheet(buffer)
        if (cancelled) return

        setSheets(data.length > 0 ? data : [{ name: 'Feuille 1', celldata: [], order: 0, status: 1, column: 12, row: 30 }])
      } catch (err) {
        if (!cancelled) {
          console.error('[XlsxViewer] Erreur:', err)
          setError(err instanceof Error ? err.message : 'Erreur de chargement')
        }
      }
    }

    load()
    return () => { cancelled = true }
  }, [url])

  if (error) {
    return (
      <div className="xlsx-error">
        <p>Impossible de charger le tableur</p>
        <span>{error}</span>
        <style jsx>{`
          .xlsx-error {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 8px;
            padding: 60px 20px;
            color: #d1d5db;
            text-align: center;
            background: #525659;
            height: 100%;
          }
          .xlsx-error span { font-size: 0.85rem; opacity: 0.7; }
        `}</style>
      </div>
    )
  }

  if (!sheets) {
    return (
      <div className="xlsx-loading">
        <div className="xlsx-spinner" />
        <span>Chargement du tableur...</span>
        <style jsx>{`
          .xlsx-loading {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 12px;
            padding: 60px 20px;
            color: #d1d5db;
            background: #525659;
            height: 100%;
          }
          .xlsx-spinner {
            width: 32px;
            height: 32px;
            border: 3px solid rgba(255, 255, 255, 0.2);
            border-top-color: white;
            border-radius: 50%;
            animation: xlsx-spin 0.8s linear infinite;
          }
          @keyframes xlsx-spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    )
  }

  return (
    <div className="xlsx-viewer-wrapper" style={{ height: typeof height === 'number' ? `${height}px` : height }}>
      <Workbook
        data={sheets}
        showToolbar={!readonly}
        showFormulaBar={false}
        showSheetTabs={true}
        allowEdit={!readonly}
        lang="fr"
      />
      <style jsx>{`
        .xlsx-viewer-wrapper {
          width: 100%;
          background: white;
          overflow: hidden;
        }
        .xlsx-viewer-wrapper :global(.fortune-container) {
          height: 100% !important;
        }
      `}</style>
    </div>
  )
}
