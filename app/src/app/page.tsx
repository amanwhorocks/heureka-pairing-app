"use client"

import { useState } from "react"
import styles from "./page.module.css"
import { exportRowsToCsv, Row } from "../lib/csv"

export default function Home() {
  const [text, setText] = useState("")
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(false)

  async function processLines() {
    const lines = text.split(/^\s*$/m).join("\n").split(/\n/).map(l => l.trim()).filter(Boolean)
    setLoading(true)
    try {
      const res = await fetch('/api/pair', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lines })
      })
      const data = await res.json()
      setRows(data.rows || [])
    } catch (e) {
      console.error(e)
      setRows([])
    } finally {
      setLoading(false)
    }
  }

  function downloadCsv() {
    const csv = exportRowsToCsv(rows)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'pairing.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Heureka produktové párování</h1>

        <p>Vložte produkty (1 řádek = 1 produkt). Formát: "ID | Název" nebo jen "Název".</p>

        <textarea
          rows={10}
          style={{ width: '100%', fontFamily: 'monospace' }}
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder={'12345 | Čistič oken\nPouzdro na telefon - silikon'}
        />

        <div style={{ marginTop: 8 }}>
          <button onClick={processLines} disabled={loading}>Zpracovat produkty</button>
          <button onClick={downloadCsv} style={{ marginLeft: 8 }} disabled={rows.length===0}>Export CSV</button>
        </div>

        <div style={{ marginTop: 16 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>ID produktu</th>
                <th>Původní název</th>
                <th>Navržená kategorie Heureky</th>
                <th>Doporučený vzor názvu</th>
                <th>Opravený název produktu</th>
                <th>Zdroj doplněných informací</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} style={{ borderTop: '1px solid #ddd' }}>
                  <td>{r.id || ''}</td>
                  <td>{r.originalName}</td>
                  <td>{r.suggestedHeurekaCategory}</td>
                  <td>{r.suggestedNamePattern}</td>
                  <td>{r.correctedName}</td>
                  <td>{r.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}
