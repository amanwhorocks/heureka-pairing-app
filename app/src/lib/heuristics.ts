import type { Row } from './types'

export function parseLine(line: string): { id?: string; name: string } {
  const parts = line.split('|').map(p => p.trim())
  if (parts.length >= 2 && /^\d+$/.test(parts[0])) {
    return { id: parts[0], name: parts.slice(1).join(' | ') }
  }
  return { name: line.trim() }
}

export function analyzeName(name: string) {
  const lower = name.toLowerCase()
  let category = 'Ostatní'
  let pattern = 'Název produktu'
  let correctedName = name.trim()
  let source = 'heuristika'

  if (/telefon|mobil|iphone|samsung|xiaomi/.test(lower)) {
    category = 'Elektronika / Mobilní telefony'
    pattern = 'Značka Model (varianty)'
  } else if (/boty|tenisky|sandále|polobotky/.test(lower)) {
    category = 'Móda / Obuv'
    pattern = 'Značka Typ Velikost'
  } else if (/tričko|košile|svetr|mikina/.test(lower)) {
    category = 'Móda / Oblečení'
    pattern = 'Značka Typ Velikost / Barva'
  } else if (/usb|kábel|sluchátka|nabíječka/.test(lower)) {
    category = 'Díly a příslušenství'
    pattern = 'Značka Typ'
  }

  // Simple normalization: remove extra spaces, unify whitespace
  correctedName = correctedName.replace(/\s+/g, ' ')

  return { category, pattern, correctedName, source }
}

// Placeholder for potential LLM or web lookups
export async function enrichWithLLM(name: string) {
  // TODO: call LLM to predict category / normalized name
  return null
}

export async function enrichOnline(name: string) {
  // TODO: implement online heuristics (e.g., scrape Heureka) for better mapping
  return null
}
