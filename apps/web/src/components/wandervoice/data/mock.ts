// ── Mock data for the connected prototype ────────────────────────────────

export const MOCK_WALK_SUGGESTIONS = [
  {
    id: 'old-quarter',
    title: 'Old Quarter Walk',
    subtitle: 'Hanoi · 36 streets',
    distance: '2.1km',
    gems: 8,
    duration: '~55 min',
  },
  {
    id: 'hoan-kiem',
    title: 'Hoan Kiem Loop',
    subtitle: 'Lake & legend',
    distance: '1.4km',
    gems: 5,
    duration: '~35 min',
  },
]

export const MOCK_SUGGESTED_QUESTIONS = [
  'What was sold here 100 years ago?',
  'Who lives above these shophouses?',
  'Is the guild still active?',
  'What happened here during the war?',
  'Why is the street called Silver Street?',
]

export const MOCK_AI_RESPONSES: Record<string, { text: string; audioSecs: number }> = {
  'What was sold here 100 years ago?': {
    text: 'Hàng Bạc means Silver Street — craftsmen from Châu Khê village set up workshops here in the 15th century, forging coins and jewelry for the royal court. By the early 1900s the street also hosted money changers and gold traders from across the delta.',
    audioSecs: 52,
  },
  'Who lives above these shophouses?': {
    text: 'The upper floors are still family homes. Three or four generations often share the narrow tube houses — grandparents on the top floor, the working family in the middle, and the shop below. Some families have lived in the same building for over two hundred years.',
    audioSecs: 44,
  },
  'Is the guild still active?': {
    text: 'Loosely, yes. The Châu Khê guild association disbanded after reunification in 1975, but several families still trace their craft lineage back to the original village. A handful of workshops on this street still do hand-engraving, though most now sell mass-produced jewelry.',
    audioSecs: 48,
  },
  'What happened here during the war?': {
    text: 'During the American war, much of the Old Quarter was evacuated. Hàng Bạc was relatively spared from bombing — the French-era buildings were sturdily built and the street was mostly residential. Some silversmiths moved their tools underground and kept working.',
    audioSecs: 41,
  },
  'Why is the street called Silver Street?': {
    text: "Hàng means 'goods' or 'trade street' in Vietnamese — most of Hanoi's 36 streets are named after what was sold there. Bạc means silver. The name dates to the Lê dynasty, when the royal mint operated nearby and silversmiths clustered here to serve it.",
    audioSecs: 38,
  },
  'Who built this street?': {
    text: 'Silversmiths from Châu Khê village, established 1428 under the Lê dynasty guild system. The Lê emperors organised Hanoi\'s craftsmen into trade guilds, each assigned a street. Châu Khê silversmiths were among the most prestigious, serving the royal treasury.',
    audioSecs: 46,
  },
  default: {
    text: "That's a fascinating aspect of Hàng Bạc. The street has layered history going back six centuries — from royal guild workshops to French colonial trade, through wartime and reunification, to the mix of heritage craft and tourism you see today.",
    audioSecs: 38,
  },
}

export const MOCK_SAVED_POIS = [
  { id: 'bach-ma', name: 'Bach Ma Temple', savedDaysAgo: 3, mode: 'story' as const },
  { id: 'silk-lantern', name: 'Silk Lantern Workshop', savedDaysAgo: 1, mode: 'facts' as const },
]

export const MOCK_HISTORY_ITEMS = [
  {
    id: 'h1',
    time: '9:44',
    place: 'Hàng Bạc Silver St.',
    mode: 'story' as const,
    snippet: '"The silversmiths of Châu Khê arrived in 1428…"',
  },
  {
    id: 'h2',
    time: '10:02',
    place: 'Bach Ma Temple',
    mode: 'story' as const,
    snippet: '"Built to honour the white horse that guided…"',
  },
  {
    id: 'h3',
    time: '10:18',
    place: 'Hàng Đào Silk St.',
    mode: 'facts' as const,
    snippet: '"Established as a dye market in the 13th century…"',
  },
  {
    id: 'h4',
    time: '10:33',
    place: 'Đồng Xuân Market',
    mode: 'secrets' as const,
    snippet: '"The market\'s iron roof was imported from France…"',
  },
]
