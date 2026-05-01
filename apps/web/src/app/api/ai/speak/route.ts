import { NextRequest, NextResponse } from 'next/server'

const ELEVENLABS_KEY = process.env.ELEVENLABS_API_KEY!

export async function POST(req: NextRequest) {
  const { text, voiceId, stability, similarityBoost, style, speed } = await req.json()

  if (!text || !voiceId) {
    return NextResponse.json({ error: 'text and voiceId required' }, { status: 400 })
  }

  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: 'POST',
    headers: {
      'xi-api-key': ELEVENLABS_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text,
      model_id: 'eleven_multilingual_v2',
      voice_settings: {
        stability: stability ?? 0.5,
        similarity_boost: similarityBoost ?? 0.75,
        style: style ?? 0.3,
        use_speaker_boost: true,
        speed: speed ?? 1.0,
      },
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    return NextResponse.json({ error: err }, { status: res.status })
  }

  const audio = await res.arrayBuffer()
  return new NextResponse(audio, {
    headers: {
      'Content-Type': 'audio/mpeg',
      'Cache-Control': 'no-store',
    },
  })
}
