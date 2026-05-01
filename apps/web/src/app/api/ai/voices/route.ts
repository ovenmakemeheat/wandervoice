import { NextResponse } from 'next/server'

const ELEVENLABS_KEY = process.env.ELEVENLABS_API_KEY!

export async function GET() {
  const res = await fetch('https://api.elevenlabs.io/v1/voices', {
    headers: { 'xi-api-key': ELEVENLABS_KEY },
  })
  const data = await res.json()
  // Return slim list: id, name, category, preview_url, labels
  const voices = (data.voices ?? []).map((v: any) => ({
    voice_id: v.voice_id,
    name: v.name,
    category: v.category,
    preview_url: v.preview_url,
    labels: v.labels,
  }))
  return NextResponse.json({ voices })
}
