import { NextRequest, NextResponse } from 'next/server'
import { searchPlace } from '../search/route'

const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY!

const SYSTEM_PROMPTS: Record<string, string> = {
  story: `You are WanderVoice, an evocative audio guide. Narrate the given place as a rich, immersive story — weave history, sensory detail, and human drama. Speak in second person ("As you stand here…"). 3–4 sentences max. No bullet points.`,
  facts: `You are WanderVoice, a precise audio guide. Give the most fascinating verifiable facts about the place — dates, dimensions, records, surprising statistics. Be crisp and authoritative. 3–4 sentences max.`,
  secrets: `You are WanderVoice, an insider audio guide. Reveal hidden stories, local legends, architectural secrets, or things most tourists never notice about this place. Be conspiratorial and intriguing. 3–4 sentences max.`,
}

// ── Tool definition ────────────────────────────────────────────────────────

const SEARCH_TOOL = {
  type: 'function' as const,
  function: {
    name: 'search_place',
    description: 'Search Wikipedia and the web for verified facts, history, and details about a place. Always call this before generating the narration to ground it in real knowledge.',
    parameters: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'The place name to search for, e.g. "Wat Phra Kaew Bangkok"',
        },
      },
      required: ['query'],
    },
  },
}

// ── Agentic narration loop ─────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const { poiName, poiType, poiAddress, poiTags, mode, customInstruction } = await req.json()

  const tagSummary = poiTags
    ? Object.entries(poiTags as Record<string, string>)
        .filter(([k]) => !k.startsWith('source') && !k.startsWith('tiger'))
        .slice(0, 15)
        .map(([k, v]) => `${k}: ${v}`)
        .join(', ')
    : ''

  const userPrompt = [
    `Place: ${poiName}`,
    poiType ? `Type: ${poiType}` : '',
    poiAddress ? `Address: ${poiAddress}` : '',
    tagSummary ? `OSM data: ${tagSummary}` : '',
    customInstruction ? `Extra instruction: ${customInstruction}` : '',
  ]
    .filter(Boolean)
    .join('\n')

  const messages: { role: string; content: string; tool_call_id?: string; name?: string }[] = [
    { role: 'system', content: SYSTEM_PROMPTS[mode] ?? SYSTEM_PROMPTS.story },
    { role: 'user', content: userPrompt },
  ]

  // ── Round 1: let the LLM decide whether to call search_place ──────────────
  const round1 = await callLLM(messages, [SEARCH_TOOL])
  if (!round1.ok) {
    const err = await round1.text()
    return NextResponse.json({ error: err }, { status: round1.status })
  }

  const round1Data = await round1.json()
  const choice1 = round1Data.choices?.[0]
  const assistantMsg = choice1?.message

  // ── If the model called search_place, execute it and continue ─────────────
  if (assistantMsg?.tool_calls?.length > 0) {
    const toolCall = assistantMsg.tool_calls[0]
    let searchResult = ''

    if (toolCall.function.name === 'search_place') {
      try {
        const args = JSON.parse(toolCall.function.arguments)
        const { context } = await searchPlace(args.query)
        searchResult = context || 'No information found.'
      } catch {
        searchResult = 'Search failed.'
      }
    }

    // Append tool result and ask for the final narrative
    messages.push({
      role: 'assistant',
      content: assistantMsg.content ?? '',
      ...assistantMsg,
    } as any)
    messages.push({
      role: 'tool',
      tool_call_id: toolCall.id,
      name: toolCall.function.name,
      content: searchResult,
    } as any)

    const round2 = await callLLM(messages, []) // no tools — force plain text response
    if (!round2.ok) {
      const err = await round2.text()
      return NextResponse.json({ error: err }, { status: round2.status })
    }

    const round2Data = await round2.json()
    const text = round2Data.choices?.[0]?.message?.content ?? ''
    return NextResponse.json({ text, grounded: true })
  }

  // ── No tool call — model generated directly ───────────────────────────────
  const text = assistantMsg?.content ?? ''
  return NextResponse.json({ text, grounded: false })
}

// ── Shared LLM caller ──────────────────────────────────────────────────────

function callLLM(messages: object[], tools: object[]) {
  return fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${OPENROUTER_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://wandervoice.app',
      'X-Title': 'WanderVoice',
    },
    body: JSON.stringify({
      model: 'google/gemini-2.5-flash',
      messages,
      tools: tools.length > 0 ? tools : undefined,
      tool_choice: tools.length > 0 ? 'auto' : undefined,
      max_tokens: 300,
      temperature: 0.8,
    }),
  })
}
