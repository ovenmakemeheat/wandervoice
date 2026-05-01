// Voice listing is handled client-side via window.speechSynthesis.getVoices().
// This route is intentionally unused — kept as a placeholder.
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ error: 'Use Web Speech API on the client' }, { status: 410 })
}
