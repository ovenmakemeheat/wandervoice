import { NextRequest, NextResponse } from 'next/server'

const GMAPS_KEY = process.env.GMAPS_API_KEY!

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const ref = searchParams.get('ref')
  const maxwidth = searchParams.get('maxwidth') ?? '800'

  if (!ref) {
    return NextResponse.json({ error: 'ref required' }, { status: 400 })
  }

  // Google redirects to actual image — follow redirect and stream back
  const url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxwidth}&photo_reference=${ref}&key=${GMAPS_KEY}`
  const res = await fetch(url)
  const blob = await res.blob()
  return new NextResponse(blob, {
    headers: {
      'Content-Type': res.headers.get('Content-Type') ?? 'image/jpeg',
      'Cache-Control': 'public, max-age=86400',
    },
  })
}
