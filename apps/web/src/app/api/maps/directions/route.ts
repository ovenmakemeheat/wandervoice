import { NextRequest, NextResponse } from 'next/server'

const GMAPS_KEY = process.env.GMAPS_API_KEY!

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const origin = searchParams.get('origin')
  const destination = searchParams.get('destination')
  const mode = searchParams.get('mode') ?? 'walking'

  if (!origin || !destination) {
    return NextResponse.json({ error: 'origin and destination required' }, { status: 400 })
  }

  const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&mode=${mode}&key=${GMAPS_KEY}`
  const res = await fetch(url)
  const data = await res.json()
  return NextResponse.json(data)
}
