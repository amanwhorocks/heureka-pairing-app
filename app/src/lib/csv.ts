import type { Row } from './types'

export function exportRowsToCsv(rows: Row[]): string {
  const header = ['ID produktu','Původní název','Navržená kategorie Heureky','Doporučený vzor názvu','Opravený název produktu','Zdroj doplněných informací']
  const escape = (s: any) => {
    if (s == null) return ''
    const str = String(s)
    if (/[",\n]/.test(str)) return '"' + str.replace(/"/g, '""') + '"'
    return str
  }

  const lines = rows.map(r => [r.id||'', r.originalName, r.suggestedHeurekaCategory, r.suggestedNamePattern, r.correctedName, r.source].map(escape).join(','))
  return header.join(',') + '\n' + lines.join('\n')
}

export { type Row }
