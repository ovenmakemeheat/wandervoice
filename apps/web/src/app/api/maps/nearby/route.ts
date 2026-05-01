import { NextRequest, NextResponse } from 'next/server'

const GMAPS_KEY = process.env.GMAPS_API_KEY!

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const lat = searchParams.get('lat')
  const lng = searchParams.get('lng')
  const radius = searchParams.get('radius') ?? '800'
  const type = searchParams.get('type') ?? 'tourist_attraction'

  if (!lat || !lng) {
    return NextResponse.json({ error: 'lat and lng required' }, { status: 400 })
  }

  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=${type}&key=${GMAPS_KEY}`
  const res = await fetch(url)
  const data = await res.json()
  return NextResponse.json(data)
}
