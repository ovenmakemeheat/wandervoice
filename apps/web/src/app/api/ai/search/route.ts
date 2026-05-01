import { NextRequest, NextResponse } from 'next/server'

export interface SearchResult {
  title: string
  summary: string
  url: string
  source: 'wikipedia' | 'tavily'
}

// ── Route handler ──────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const { query } = await req.json()
  if (!query) return NextResponse.json({ error: 'query required' }, { status: 400 })

  try {
    const result = await searchPlace(query)
    return NextResponse.json(result)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

// ── Combined search — runs Wikipedia + Tavily in parallel ──────────────────
// Returns merged context string ready to inject into the LLM prompt.

export async function searchPlace(query: string): Promise<{ context: string; sources: SearchResult[] }> {
  const [wiki, tavily] = await Promise.allSettled([
    searchWikipedia(query),
    searchTavily(query),
  ])

  const sources: SearchResult[] = []

  if (wiki.status === 'fulfilled' && wiki.value) sources.push(wiki.value)
  if (tavily.status === 'fulfilled' && tavily.value.length > 0) sources.push(...tavily.value)

  const context = sources
    .map(s => `[${s.source === 'wikipedia' ? 'Wikipedia' : 'Web'} — ${s.title}]\n${s.summary}`)
    .join('\n\n')

  return { context: context.slice(0, 2500), sources }
}

// ── Wikipedia ──────────────────────────────────────────────────────────────

export async function searchWikipedia(query: string): Promise<SearchResult | null> {
  // Step 1: find best article title
  const searchUrl = new URL('https://en.wikipedia.org/w/api.php')
  searchUrl.searchParams.set('action', 'query')
  searchUrl.searchParams.set('list', 'search')
  searchUrl.searchParams.set('srsearch', query)
  searchUrl.searchParams.set('srlimit', '1')
  searchUrl.searchParams.set('format', 'json')
  searchUrl.searchParams.set('origin', '*')

  const searchRes = await fetch(searchUrl.toString(), {
    headers: { 'User-Agent': 'WanderVoice/1.0 (https://wandervoice.app)' },
    next: { revalidate: 3600 },
  })
  const searchData = await searchRes.json()
  const hit = searchData?.query?.search?.[0]
  if (!hit) return null

  // Step 2: fetch plain-text intro
  const extractUrl = new URL('https://en.wikipedia.org/w/api.php')
  extractUrl.searchParams.set('action', 'query')
  extractUrl.searchParams.set('prop', 'extracts')
  extractUrl.searchParams.set('exintro', '1')
  extractUrl.searchParams.set('explaintext', '1')
  extractUrl.searchParams.set('exsentences', '8')
  extractUrl.searchParams.set('titles', hit.title)
  extractUrl.searchParams.set('format', 'json')
  extractUrl.searchParams.set('origin', '*')

  const extractRes = await fetch(extractUrl.toString(), {
    headers: { 'User-Agent': 'WanderVoice/1.0 (https://wandervoice.app)' },
    next: { revalidate: 3600 },
  })
  const extractData = await extractRes.json()
  const pages = extractData?.query?.pages ?? {}
  const page = Object.values(pages)[0] as any
  const summary = (page?.extract ?? '').slice(0, 1000)

  return {
    title: hit.title,
    summary,
    url: `https://en.wikipedia.org/wiki/${encodeURIComponent(hit.title)}`,
    source: 'wikipedia',
  }
}

// ── Tavily ─────────────────────────────────────────────────────────────────

async function searchTavily(query: string): Promise<SearchResult[]> {
  const key = process.env.TAVILY_API_KEY
  if (!key) return []

  const res = await fetch('https://api.tavily.com/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      api_key: key,
      query: `${query} history facts travel guide`,
      search_depth: 'basic',
      max_results: 3,
      include_answer: true,
      include_raw_content: false,
    }),
    next: { revalidate: 3600 },
  })

  if (!res.ok) return []
  const data = await res.json()

  const results: SearchResult[] = []

  // Tavily's synthesized answer is the most useful single chunk
  if (data.answer) {
    results.push({
      title: `${query} — Web Summary`,
      summary: data.answer.slice(0, 800),
      url: data.results?.[0]?.url ?? '',
      source: 'tavily',
    })
  }

  // Top individual results as supplementary snippets
  for (const r of (data.results ?? []).slice(0, 2)) {
    if (r.content) {
      results.push({
        title: r.title ?? query,
        summary: r.content.slice(0, 400),
        url: r.url ?? '',
        source: 'tavily',
      })
    }
  }

  return results
}
