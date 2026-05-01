import { NextRequest, NextResponse } from "next/server";

const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY!;

const SYSTEM_PROMPTS: Record<string, string> = {
  story: `You are WanderVoice, an evocative audio guide. Narrate the given place as a rich, immersive story — weave history, sensory detail, and human drama. Speak in second person ("As you stand here…"). 3–4 sentences max. No bullet points.`,
  facts: `You are WanderVoice, a precise audio guide. Give the most fascinating verifiable facts about the place — dates, dimensions, records, surprising statistics. Be crisp and authoritative. 3–4 sentences max.`,
  secrets: `You are WanderVoice, an insider audio guide. Reveal hidden stories, local legends, architectural secrets, or things most tourists never notice about this place. Be conspiratorial and intriguing. 3–4 sentences max.`,
};

export async function POST(req: NextRequest) {
  const { poiName, poiType, poiAddress, poiTags, mode, customInstruction } =
    await req.json();

  const tagSummary = poiTags
    ? Object.entries(poiTags as Record<string, string>)
        .filter(([k]) => !k.startsWith("source") && !k.startsWith("tiger"))
        .slice(0, 20)
        .map(([k, v]) => `${k}: ${v}`)
        .join(", ")
    : "";

  const userPrompt = [
    `Place: ${poiName}`,
    poiType ? `Type: ${poiType}` : "",
    poiAddress ? `Address: ${poiAddress}` : "",
    tagSummary ? `OSM data: ${tagSummary}` : "",
    customInstruction ? `Extra instruction: ${customInstruction}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENROUTER_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://wandervoice.app",
      "X-Title": "WanderVoice",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPTS[mode] ?? SYSTEM_PROMPTS.story,
        },
        { role: "user", content: userPrompt },
      ],
      max_tokens: 200,
      temperature: 0.8,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    return NextResponse.json({ error: err }, { status: res.status });
  }

  const data = await res.json();
  const text = data.choices?.[0]?.message?.content ?? "";
  return NextResponse.json({ text });
}
