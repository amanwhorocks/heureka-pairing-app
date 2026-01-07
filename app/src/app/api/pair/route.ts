import { NextResponse } from 'next/server'
import { parseLine, analyzeName } from '../../../lib/heuristics'
import type { Row } from '../../../lib/types'

export async function POST(request: Request) {
  const body = await request.json()
  const lines: string[] = Array.isArray(body?.lines) ? body.lines : []

  const rows: Row[] = lines.map((l) => {
    const parsed = parseLine(l)
    const analysis = analyzeName(parsed.name)

    return {
      id: parsed.id,
      originalName: parsed.name,
      suggestedHeurekaCategory: analysis.category,
      suggestedNamePattern: analysis.pattern,
      correctedName: analysis.correctedName,
      source: analysis.source
    }
  })

  return NextResponse.json({ rows })
}
