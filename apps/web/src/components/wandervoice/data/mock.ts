// ── Mock data for the connected prototype ────────────────────────────────
// All focused on Wat Phra Kaew (Temple of the Emerald Buddha), Bangkok
// Real data sourced from Google Maps Places API & OSM Overpass

// Build a photo URL routed through the Next.js proxy (avoids CORS)
export function gmapsPhoto(photoReference: string, maxWidth = 800): string {
  return `/api/maps/photo?ref=${encodeURIComponent(photoReference)}&maxwidth=${maxWidth}`
}

// ── Real photo references from Places API (Wat Phra Kaew, place_id: ChIJ5Wl37g6Z4jARiP4itarBPDQ) ──
const WAT_PHRA_KAEW_PHOTOS = [
  'Ab43m-u2p9SqlwNWll8YpN0s_KNNcFTScf1-BxM6pa8TLm0ic4tOTtqQGt8BEFba_DUa6eQ-PGGhycx0cHRFGPvJv50xdyK0MdfdMB3zaxnnKoBH5w5RGgV5lS5_A7bwn0n6hNO3SNRbYaTSS04B5K3iGDX9CxVOUh63Obk8FUVMkw4snC2dPo8XWG_0heEyuyVrtirq0Ykg4iNp6ln3Qd-E-UR1XaAEP6Krn9FO-5kR7i-HnS2jTWux6mmeAi35alEaBk0qkyTI94yFhl4nTLO6thjbvpwanpKe1rkk8eGLgQzYgNdZh_HU5L8t_hxdjaslwuR19eySpwLFyWfhWDi9JYxS8JD_ruBwNh129SNptrGuZ7tSIoz9UQ_trmjSDm6v3TZth-lBuzCG8CExZJtZlYqZX7lMTLo_8qf6g0RhCL-fLw',
  'Ab43m-vBI0R4BR8lfUaRpwVFGNF2IGla8gRXBXIcv8yamOFtNXB5s2817aGdsmWwbgxKDZuEDU2zEEP2tOWCtgk9DK2qbrb6K5ho7RrYU0szGPIKsOP5-x0vytIm18uoSL8AK5ry_vcSrQxaK1VbNowBHXBkDKypXd4wu_vI6HSGkNKuIZTXok8TdeS3oHH0OTu5TzKM1xxqfp1xHSNhjmKxhsyD5LWeS3XWrh-Hx6FdTWccVGHpwmNJBFRCLcLkFyDXUr9yM9CkUJapAwUGeAl-KERALsYlxR7w_lEkt0MQnjDi6oME9bHOyVPvfM5Bq5jofb-rz13e7qFdc2eqL_0KuGCBc6iDYmRuRtBlqWm_vauCgYEuDbqqbHZSVo8egn6sofGV-nyHsJqqgYSMdYZcAALpSZ0-Dwcez6TULT3ZUyQR9fdh',
  'Ab43m-tR2wkDjtbfH-gk_01d2j1NX4HIBKivsoXJX2GxULn7F1n00VwQc5i50svVXomA1q_uVsxtFvqKt6nHw3F6hcbttOn40drGjZf-s75wwFKIK12WHBhFH7H72nFECNJFINxwAaQZXXzw02Gus6wOIkvwpFrtFXzKVS465gCUBSns0GiJot32oLBWCJ5wOzeW8mWsNiyeJbLNCLLrdZWFFz6aa3VDGixbU4zI7zJtfZmJ1lOgcsltNeO8Rg2gIQKBVaToka3L0uU23eiqINQYckUjAmh1-KrQ5GAcx-QMo5eqGBBJsU2qLjUR6yXNj0AvnoQdkorYkLi_G7LGxDaVvY4WQfwTQDt_YXOOzxe0TV5DF2EZ9_wwpm_HnlHWgqrCNUC1PUmFtHiYTbSoqeRxWwe25dXEjtVR6oVzbULE4WJHIQ',
  'Ab43m-uNOzfjkPRuW-KdIqnEdpXqTfINHuWDArf-LZmDAbqW_nt1EbQc7mq8rfLjPjxEmuwYScRoiGocec19wVxLTFq0ufcO5RY8T1IZMdw3e7eDV_-K52mr_YvdMCvApzZk5TciCE7EnuCS5zigCDU4OW1JNEOm_N54kM7cOS1yUFLfn_3W6RXRpi7f3XAkczN6A7NYlUDAxEpZ_zW7KZRq2ZjyOhh8RgEdunQdEP7MryDRK-HYNa6R-Ltz2Zw9x1zZKebWnHNIAB8f3NTgFSonapLsVZrTfsHgvgx5cnyI_GQ0MwqTu2kCwpsUz0WyWFX-JiCXThNfNYSoQTSgrSsZWFzVaqG9zIceXDzC7C9JAIKA57-ej1wqtZoioH98kZ7MfNxT74_RhZ8GRxgrSHf8YhdyDvwOUyOKE5wBTQeGTaMWBA',
  'Ab43m-se3xYpRfn-_6r3KNyZj55dFd1h-MtO6XNu4NB1m3A9d8uZCNXWjgtbaQfEVlJlm99vYBb9kL4B6d7tFszWLR_eZm-X8_fcdoi0z724zhSejhFOsbOpq6BDGCs1tHOgORCHYcRNf61Xfu84IZ3lWMxhfzXMphoq2BdBoamo64Qd3Mt736fVU1wYM1ycGCOko5GcB5BaAmyyPsy-Pz85bgYFxyAcVNl2f-JB6gFJ7ooLv8LKV9fzmUDFTtu23QBH_gGL7rpTW__jmlUP1GzYZ66-juYE5zxt7Bnvm5WeznEKXWKHRyOlop1_VPNyw79fAezP5bwO_luFKC5Jyg4gfd5SW-oLlfo2IqzoUhgucNckBcxzi9E5Ez6sugEjZRJ_rmO9IiQ3Sl3wkhDg6y4pl6iqloeaeqR0_DZQZUzmtVsqLogA',
  'Ab43m-uFg6T78A5caKdQmxyNBtcXXjQ7gBmHkqwnL9SUk90N0g-l6C7Lp5rDFUuEFwCIlO-w_4UuDKSmjUsTjQ36gwzP2K-fmi7cyqquyU9b-ho-9KlyJbKcftACU-VlL6rNqJffLAdAEaI7R0qENwBLYb8n0pIKCyz6-41Nz4Rg0BIHuiLYcT-5AQBzJ6NVG3KMfgTsC2TInhYbVgICRQ_4BzGslOB8eEOEIua7GFAmRZ3GVGiW4ORRDDqGy3PMrhuRBz7CEAErUl0t3v1E7HBvC8225KJoG-aWdG3tRgzQMZwBKV4_XAEcjOcWQz-esjzJcBWsreZxRaCy1xdjXmheMHAPdrVMVDK2x1O-KBgyG2WsmgZQIJZKe_CrtOL--lTf9RltJAIFEwAXN415sBRTZWy42TMQo6zB7qy5lWqOX70rXc9u',
  'Ab43m-v9grF3T-2e2x7kEWYR-EZQZi_s9IteQbSOUOdt_KvCbWXvEQIKHhIUSy4eND__r78HJe2-oclBXnMYHLvggbynbIULWR7NOfjHTQ5BoLJuPwXrmFDajcVacZw-GzsxxXSZFtI8k82k1nAUMX6STzLTRKBeKGKc8-V7JdJKT-1yjNc-XWAcmLDFPzRgwHJQSlj_ETvfL0yvx8JUZz3Xy7r8YHj0RC0V0GrhA0IG4MdcH64Al7yRqzwxxmY54-HZDOP5Uvsc0Ar7BEM7yXvo5mRAXmJNan13KEnija6vBNCZos-6Le1eriUy6_Ghmby5J9vvz1eZC1-x-zEXD97Gf-C48siV2tcFUf7zul7LdofF5bpgp8IISLEF1Rnc3UeqDmsvjCEDukNnZ3ZK_JWaqWN9TuErN6hSB1cw1fmcABNcjCRZ',
  'Ab43m-ubb6n7SkYmeWn439spYDqXE9jych7Nehhrc47Cy1KiZazJnGrxR9xyevwy05p3OAo-B8lYy8PfxW_RrMOOAfcLHCjwNVB5Sjv2NhgFDNm7AFaOVw9SKFkUKJ3ShcEMmbsbfSg2rMQxMyQVEakXGXVlW-iArdir9rWjRn75WZXE0GR9FgaOg1HJSNUM1VPEPnov2ZSedyRcvAOvM3hwYVZhhl95ZGStmt09jurUUB68ds_a2-NLSb_ThyLpdDNdHjqnv349BsEjoBPGP4sD-tpnKc_l7TL7mZu2Pkq0K-SFnBKy4nr2mUXjIqcYxW6yQpQ4zL6IQJXEtH7Pqcqlrji5taLrAOWO3L1aZlTH3koiYq2AsIrJmjWWX2wZrZA-Pnwue5h2_yVZxNKtQLRQdOVIOctypmuagJe5g-yNRhKhsQj2',
  'Ab43m-vLzQH7K16CtAyTAlqEcHrxNfcdwPx_bUTIXlv9cbVAI7qTTeyRDyRAtzXhvKLDF_6hq8foT9na9hYNsglDdKn5LnuCZoZQKSz-_fHBXL0rB6tf1tRT_4OeLSYmPb8dFuJzDUtwlFG-GdJrZyv4oNYmiVVzs11edoi-hTmXK_-qsSrj2Wq_CdE3HB7YM4Rh70mxPnTTyOytZ7w2GXsuYzF-XJ2mUyo7MveL28nb5kIA9gUb2-1LFZWl5oFwAQr0MjOnGiVw0GYgdGWcCTwmQk37-w_XvKzxE5Or2AASaJwwUAzI5WrS2EW1GhZ4jovVeV547p9mQAA5TaF3JYK2ZukFEUgdhi7YJp5aR0BLLTtIWlB7E6nozCluXdc-fuhiJK5uF3U0KJK9vcP7qQ2ceb40tPiAMVSYIkRLvYfo1dJVEw',
  'Ab43m-tSurPyHc7ssYgJ9EuRlIiarjrjudhLQ5QlI00vW61_xwjvL48muWD5uiXEzriSF0iS6cganSkNapSucn4mNlCb5QrJ_pchgx-YL7k2i6zrfib0mVPD6HGFYCWQZC9hH884VEn8anEA4N4nzpYkwaCa2cwgQfDCfc9Hr-iqrbKl6qj6KDKExTz2oXmqGfLs772fNJ45qn2OI3homm1zj7FtdVDXMswWQ94yVDFhs0R0MOWiC8mpVmJLK31mshoEzN2d_JLjYLnwgBwSOAadzw_5gfdOEy4-vCbu0RjVrY3CTQoVceCitdC7UoPfZPRS1U_UAZltv-0sXLsMahfhEkto6vg-KwhtYcma7k4VN2GDmqOG3MwTHfNL8rZSu4_3-ktrc0IL5rydynuDzQEKm2a3SYGuB1P0vwUOQybsXbeeJA',
]

// Get a real Google Maps photo URL by index (cycles through available photos)
export function watPhraKaewPhoto(index = 0, maxWidth = 800): string {
  const ref = WAT_PHRA_KAEW_PHOTOS[index % WAT_PHRA_KAEW_PHOTOS.length]
  return gmapsPhoto(ref, maxWidth)
}

// ── Walk suggestions ────────────────────────────────────────────────────────
export const MOCK_WALK_SUGGESTIONS = [
  {
    id: 'wat-phra-kaew',
    title: 'Emerald Buddha Walk',
    subtitle: 'Bangkok · Grand Palace Complex',
    distance: '0.8km',
    gems: 12,
    duration: '~45 min',
  },
  {
    id: 'wat-pho',
    title: 'Wat Pho Discovery',
    subtitle: 'Reclining Buddha · 400m away',
    distance: '1.2km',
    gems: 6,
    duration: '~30 min',
  },
]

// ── Voice Q&A — suggested questions ────────────────────────────────────────
export const MOCK_SUGGESTED_QUESTIONS = [
  'Why is the Buddha emerald?',
  'Who built the golden stupa?',
  'What do the giant demons guard?',
  'Can I take photos inside?',
  'Why does the Buddha wear clothes?',
]

// ── AI responses keyed by question ─────────────────────────────────────────
export const MOCK_AI_RESPONSES: Record<string, { text: string; audioSecs: number }> = {
  'Why is the Buddha emerald?': {
    text: 'Actually, the Emerald Buddha is made of green jade, not emerald. It was discovered in 1434 in Chiang Rai, hidden inside a plaster stupa that was struck by lightning, revealing the green stone within.',
    audioSecs: 52,
  },
  'Who built the golden stupa?': {
    text: 'Phra Sri Rattana Chedi was built by King Rama IV in the mid-19th century. It is covered in thousands of golden tiles imported from Italy and houses a sacred relic of the Buddha.',
    audioSecs: 44,
  },
  'What do the giant demons guard?': {
    text: 'The Yaksha (demons) guard the entrances to protect the temple from evil spirits. There are six pairs in total, each representing a character from the Ramakien, the Thai national epic.',
    audioSecs: 48,
  },
  'Can I take photos inside?': {
    text: 'Photography is strictly forbidden inside the main Chapel of the Emerald Buddha as a sign of respect. However, you are free to take as many photos as you like of the stunning exterior and the terrace.',
    audioSecs: 41,
  },
  'Why does the Buddha wear clothes?': {
    text: 'The Emerald Buddha has three sets of golden costumes for the Summer, Rainy, and Winter seasons. The King of Thailand personally changes the robes three times a year to bring good luck to the nation.',
    audioSecs: 38,
  },
  default: {
    text: 'Wat Phra Kaew, or the Temple of the Emerald Buddha, is the most sacred site in Thailand. Established in 1782, it serves as the spiritual heart of the kingdom and the Chakri Dynasty.',
    audioSecs: 38,
  },
}

// ── Saved POIs ──────────────────────────────────────────────────────────────
export const MOCK_SAVED_POIS = [
  { id: 'golden-chedi', name: 'Phra Sri Rattana Chedi', savedDaysAgo: 2, mode: 'story' as const },
  { id: 'ramakien-murals', name: 'Ramakien Gallery', savedDaysAgo: 5, mode: 'facts' as const },
]

// ── History items (chat log) ────────────────────────────────────────────────
export const MOCK_HISTORY_ITEMS = [
  {
    id: 'h1',
    time: '14:20',
    place: 'Phra Ubosot',
    mode: 'story' as const,
    snippet: '"The Emerald Buddha was revealed by lightning in 1434…"',
  },
  {
    id: 'h2',
    time: '14:45',
    place: 'Phra Mondop',
    mode: 'story' as const,
    snippet: '"This library houses the sacred Tripitaka scriptures…"',
  },
  {
    id: 'h3',
    time: '15:10',
    place: 'Angkor Wat Model',
    mode: 'facts' as const,
    snippet: '"A detailed scale model built during King Rama IV\'s reign…"',
  },
  {
    id: 'h4',
    time: '15:30',
    place: 'Prasat Phra Debidorn',
    mode: 'secrets' as const,
    snippet: '"The Royal Pantheon houses life-sized statues of kings…"',
  },
]

// ── Sub-places within Wat Phra Kaew ────────────────────────────────────────
// Images use real Google Maps photo references (photos 0–9 above)
export const MOCK_SUB_PLACES = [
  {
    id: 'chapel',
    name: 'Emerald Buddha Chapel',
    area: 'Central complex',
    type: 'Royal Chapel',
    imageUrl: watPhraKaewPhoto(0),
    lat: 13.7515,
    lng: 100.4927,
  },
  {
    id: 'chedi',
    name: 'Phra Sri Rattana Chedi',
    area: 'Upper Terrace',
    type: 'Golden Stupa',
    imageUrl: watPhraKaewPhoto(1),
    lat: 13.7516,
    lng: 100.4928,
  },
  {
    id: 'pantheon',
    name: 'The Royal Pantheon',
    area: 'Upper Terrace',
    type: 'Monument',
    imageUrl: watPhraKaewPhoto(2),
    lat: 13.7517,
    lng: 100.4929,
  },
  {
    id: 'mondop',
    name: 'Phra Mondop (Library)',
    area: 'Upper Terrace',
    type: 'Scripture Library',
    imageUrl: watPhraKaewPhoto(3),
    lat: 13.7518,
    lng: 100.4930,
  },
  {
    id: 'murals',
    name: 'Ramakien Gallery',
    area: 'Outer cloister',
    type: 'Mural Gallery',
    imageUrl: watPhraKaewPhoto(4),
    lat: 13.7519,
    lng: 100.4931,
  },
  {
    id: 'angkor-model',
    name: 'Angkor Wat Scale Model',
    area: 'North Terrace',
    type: 'Historical Model',
    imageUrl: watPhraKaewPhoto(5),
    lat: 13.7520,
    lng: 100.4926,
  },
  {
    id: 'yaksha',
    name: 'Yaksha Guardian Statues',
    area: 'Entrance Gates',
    type: 'Guardian Statues',
    imageUrl: watPhraKaewPhoto(6),
    lat: 13.7514,
    lng: 100.4925,
  },
]

// ── City center (used as map fallback / GPS fallback) ────────────────────────
export const MOCK_CITY_CENTER = {
  lat: 13.7515,
  lng: 100.4927,
  name: 'Wat Phra Kaew, Bangkok',
}

// ── Real Google Maps place data for Wat Phra Kaew ────────────────────────────
// place_id: ChIJ5Wl37g6Z4jARiP4itarBPDQ
export const MOCK_WAT_PHRA_KAEW = {
  placeId: 'ChIJ5Wl37g6Z4jARiP4itarBPDQ',
  name: 'Wat Phra Kaew (Temple of the Emerald Buddha)',
  nameThai: 'วัดพระศรีรัตนศาสดาราม',
  lat: 13.7516435,
  lng: 100.4927041,
  rating: 4.7,
  userRatingsTotal: 42737,
  address: 'Na Phra Lan Road, Khwaeng Phra Borom Maha Ratchawang, Khet Phra Nakhon, Bangkok 10200',
  phone: undefined,
  website: 'https://www.royalgrandpalace.th',
  openingHours: 'Daily 08:30 – 15:30',
  fee: '500 THB (includes bottle of water)',
  wheelchair: 'yes',
  types: ['tourist_attraction', 'place_of_worship'],
  // All 10 real photo URLs
  photos: WAT_PHRA_KAEW_PHOTOS.map((ref, i) => watPhraKaewPhoto(i)),
  // Real visitor reviews from Google Maps
  reviews: [
    {
      author: 'Avinash Rajoria',
      rating: 5,
      text: 'Visiting Wat Phra Kaew was truly an unforgettable experience. The temple is absolutely breathtaking, with stunning architecture, intricate details, and a peaceful spiritual atmosphere.',
      relativeTime: '1 month ago',
    },
    {
      author: 'Marzella Arlt',
      rating: 5,
      text: 'An architectural masterpiece steeped in history. The entrance fee is 500 Baht and worth every penny. The Emerald Buddha is a small but deeply revered statue carved from a single block of jade. Its golden robes are changed three times a year by the King himself.',
      relativeTime: '1 month ago',
    },
    {
      author: 'F K',
      rating: 5,
      text: 'The sheer scale of the opulence hits you immediately. Every inch of the complex is a masterpiece of craftsmanship. Note: photos are forbidden inside the temple. Tip: buy elephant pants outside if you forget to cover your legs.',
      relativeTime: '1 month ago',
    },
    {
      author: 'Farwa Rizvi',
      rating: 5,
      text: 'A beautiful temple in the centre of the city. Multiple ticketing counters means no long lines. Bring water, a fan, and a hat — it is extremely hot during the day.',
      relativeTime: '2 months ago',
    },
    {
      author: 'Ye Linn Aung',
      rating: 5,
      text: 'Arrive as soon as it opens at 8:30 AM to beat the heat and crowds. Sitting quietly inside the main chapel provides genuine peace. A must-visit to connect with the soul of Bangkok.',
      relativeTime: '2 months ago',
    },
  ],
}
