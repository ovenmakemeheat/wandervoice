// Speech synthesis is handled client-side via the Web Speech API.
// This route is intentionally unused — kept as a placeholder.
import { NextResponse } from 'next/server'

export async function POST() {
  return NextResponse.json({ error: 'Use Web Speech API on the client' }, { status: 410 })
}
