'use client'

import { createContext, useContext, useReducer, useCallback, type ReactNode } from 'react'

// ── Types ─────────────────────────────────────────────────────────────────

export type NarrativeMode = 'story' | 'facts' | 'secrets'

export type ThemeMode = 'light' | 'dark'

export type NarratorPhase = 'idle' | 'generating-text' | 'generating-audio' | 'playing'

export interface POI {
  lat: number
  lng: number
  name: string
  description?: string
  imageUrl?: string
  type?: string
  address?: string
  tags?: Record<string, string>
  distance?: number // in meters
}

export type ScreenName =
  | 'splash'
  | 'sign-in'
  | 'perms'
  | 'onboarding-name'
  | 'onboarding-style'
  | 'onboarding-setup'
  | 'home'
  | 'smart-walk'
  | 'voice-ask'
  | 'voice-listen'
  | 'voice-chat'
  | 'profile'
  | 'sub-place-selection'

export interface ChatMessage {
  id: string
  role: 'user' | 'ai'
  text: string
  audioSecs?: number
  timestamp: number
}

export interface NarrativeHistoryEntry {
  id: string
  time: string        // display time e.g. "9:44"
  place: string
  mode: string        // 'Story' | 'Facts' | 'Secrets'
  snippet: string     // first ~80 chars of narrative text
  fullText: string
  audioUrl?: string   // object URL for replay
  timestamp: number
}

interface AppState {
  screen: ScreenName
  screenHistory: ScreenName[]
  // direction used for slide animation
  direction: 'forward' | 'back'

  // User
  userName: string
  onboardingDone: boolean

  // Preferences
  narrativeMode: NarrativeMode
  autoAudio: boolean
  leadingCues: boolean
  theme: ThemeMode

  // Narrator config
  voiceId: string
  voiceStability: number
  voiceSimilarity: number
  voiceStyle: number
  voiceSpeed: number
  customInstruction: string

  // Walk session (simulated)
  walkActive: boolean
  gemsCollected: number
  distanceKm: number
  nearestPOI: POI | null
  nearbyPOIs: POI[]

  // Auto narrator
  autoNarrate: boolean
  narratorPhase: NarratorPhase
  currentNarrativeText: string
  narrativeHistory: NarrativeHistoryEntry[]

  // Voice / Chat
  chatHistory: ChatMessage[]
  pendingQuestion: string
}

// ── Actions ───────────────────────────────────────────────────────────────

type Action =
  | { type: 'NAVIGATE'; to: ScreenName }
  | { type: 'GO_BACK' }
  | { type: 'SET_USER_NAME'; name: string }
  | { type: 'SET_ONBOARDING_DONE' }
  | { type: 'SET_NARRATIVE_MODE'; mode: NarrativeMode }
  | { type: 'SET_AUTO_AUDIO'; value: boolean }
  | { type: 'SET_LEADING_CUES'; value: boolean }
  | { type: 'SET_THEME'; mode: ThemeMode }
  | { type: 'SET_VOICE_ID'; voiceId: string }
  | { type: 'SET_VOICE_STABILITY'; value: number }
  | { type: 'SET_VOICE_SIMILARITY'; value: number }
  | { type: 'SET_VOICE_STYLE'; value: number }
  | { type: 'SET_VOICE_SPEED'; value: number }
  | { type: 'SET_CUSTOM_INSTRUCTION'; text: string }
  | { type: 'SET_AUTO_NARRATE'; value: boolean }
  | { type: 'SET_NARRATOR_PHASE'; phase: NarratorPhase }
  | { type: 'SET_CURRENT_NARRATIVE_TEXT'; text: string }
  | { type: 'ADD_NARRATIVE_HISTORY'; entry: NarrativeHistoryEntry }
  | { type: 'ADD_MESSAGE'; message: ChatMessage }
  | { type: 'SET_PENDING_QUESTION'; question: string }
  | { type: 'CLEAR_PENDING_QUESTION' }
  | { type: 'SET_WALK_ACTIVE'; value: boolean }
  | { type: 'SET_NEAREST_POI'; poi: POI | null }
  | { type: 'SET_NEARBY_POIS'; pois: POI[] }
  | { type: 'ADD_GEM' }

// ── Reducer ───────────────────────────────────────────────────────────────

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'NAVIGATE':
      return {
        ...state,
        screen: action.to,
        screenHistory: [...state.screenHistory, state.screen],
        direction: 'forward',
      }
    case 'GO_BACK': {
      const prev = state.screenHistory[state.screenHistory.length - 1]
      if (!prev) return state
      return {
        ...state,
        screen: prev,
        screenHistory: state.screenHistory.slice(0, -1),
        direction: 'back',
      }
    }
    case 'SET_USER_NAME':
      return { ...state, userName: action.name }
    case 'SET_ONBOARDING_DONE':
      return { ...state, onboardingDone: true }
    case 'SET_NARRATIVE_MODE':
      return { ...state, narrativeMode: action.mode }
    case 'SET_AUTO_AUDIO':
      return { ...state, autoAudio: action.value }
    case 'SET_LEADING_CUES':
      return { ...state, leadingCues: action.value }
    case 'SET_THEME':
      return { ...state, theme: action.mode }
    case 'SET_VOICE_ID':
      return { ...state, voiceId: action.voiceId }
    case 'SET_VOICE_STABILITY':
      return { ...state, voiceStability: action.value }
    case 'SET_VOICE_SIMILARITY':
      return { ...state, voiceSimilarity: action.value }
    case 'SET_VOICE_STYLE':
      return { ...state, voiceStyle: action.value }
    case 'SET_VOICE_SPEED':
      return { ...state, voiceSpeed: action.value }
    case 'SET_CUSTOM_INSTRUCTION':
      return { ...state, customInstruction: action.text }
    case 'SET_AUTO_NARRATE':
      return { ...state, autoNarrate: action.value }
    case 'SET_NARRATOR_PHASE':
      return { ...state, narratorPhase: action.phase }
    case 'SET_CURRENT_NARRATIVE_TEXT':
      return { ...state, currentNarrativeText: action.text }
    case 'ADD_NARRATIVE_HISTORY':
      return { ...state, narrativeHistory: [action.entry, ...state.narrativeHistory] }
    case 'ADD_MESSAGE':
      return { ...state, chatHistory: [...state.chatHistory, action.message] }
    case 'SET_PENDING_QUESTION':
      return { ...state, pendingQuestion: action.question }
    case 'CLEAR_PENDING_QUESTION':
      return { ...state, pendingQuestion: '' }
    case 'SET_WALK_ACTIVE':
      return { ...state, walkActive: action.value }
    case 'SET_NEAREST_POI':
      return { ...state, nearestPOI: action.poi }
    case 'SET_NEARBY_POIS':
      return { ...state, nearbyPOIs: action.pois }
    case 'ADD_GEM':
      return { ...state, gemsCollected: state.gemsCollected + 1 }
    default:
      return state
  }
}

// ── Initial state ─────────────────────────────────────────────────────────

const INITIAL_STATE: AppState = {
  screen: 'splash',
  screenHistory: [],
  direction: 'forward',
  userName: 'Elena',
  onboardingDone: false,
  narrativeMode: 'story',
  autoAudio: true,
  leadingCues: true,
  theme: 'dark',
  voiceId: 'EXAVITQu4vr4xnSDxMaL', // ElevenLabs "Sarah" — warm, clear
  voiceStability: 0.5,
  voiceSimilarity: 0.75,
  voiceStyle: 0.3,
  voiceSpeed: 1.0,
  customInstruction: '',
  autoNarrate: false,
  narratorPhase: 'idle' as NarratorPhase,
  currentNarrativeText: '',
  narrativeHistory: [],
  walkActive: false,
  gemsCollected: 4,
  distanceKm: 1.2,
  nearestPOI: {
    lat: 13.7515,
    lng: 100.4927,
    name: 'Wat Phra Kaew, Bangkok',
    imageUrl: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=300&q=80'
  },
  nearbyPOIs: [],
  chatHistory: [],
  pendingQuestion: '',
}

// ── Context ───────────────────────────────────────────────────────────────

interface AppContextValue extends AppState {
  navigate: (to: ScreenName) => void
  goBack: () => void
  setUserName: (name: string) => void
  setOnboardingDone: () => void
  setNarrativeMode: (mode: NarrativeMode) => void
  setAutoAudio: (value: boolean) => void
  setLeadingCues: (value: boolean) => void
  setTheme: (mode: ThemeMode) => void
  setVoiceId: (voiceId: string) => void
  setVoiceStability: (value: number) => void
  setVoiceSimilarity: (value: number) => void
  setVoiceStyle: (value: number) => void
  setVoiceSpeed: (value: number) => void
  setCustomInstruction: (text: string) => void
  setAutoNarrate: (value: boolean) => void
  setNarratorPhase: (phase: NarratorPhase) => void
  setCurrentNarrativeText: (text: string) => void
  addNarrativeHistory: (entry: NarrativeHistoryEntry) => void
  addMessage: (message: ChatMessage) => void
  setPendingQuestion: (question: string) => void
  clearPendingQuestion: () => void
  setWalkActive: (value: boolean) => void
  setNearestPOI: (poi: POI | null) => void
  setNearbyPOIs: (pois: POI[]) => void
  addGem: () => void
}

const AppContext = createContext<AppContextValue | null>(null)

export function useAppContext(): AppContextValue {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useAppContext must be used inside <AppProvider>')
  return ctx
}

// ── Provider ──────────────────────────────────────────────────────────────

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE)

  const navigate = useCallback((to: ScreenName) => dispatch({ type: 'NAVIGATE', to }), [])
  const goBack = useCallback(() => dispatch({ type: 'GO_BACK' }), [])
  const setUserName = useCallback((name: string) => dispatch({ type: 'SET_USER_NAME', name }), [])
  const setOnboardingDone = useCallback(() => dispatch({ type: 'SET_ONBOARDING_DONE' }), [])
  const setNarrativeMode = useCallback((mode: NarrativeMode) => dispatch({ type: 'SET_NARRATIVE_MODE', mode }), [])
  const setAutoAudio = useCallback((value: boolean) => dispatch({ type: 'SET_AUTO_AUDIO', value }), [])
  const setLeadingCues = useCallback((value: boolean) => dispatch({ type: 'SET_LEADING_CUES', value }), [])
  const setTheme = useCallback((mode: ThemeMode) => dispatch({ type: 'SET_THEME', mode }), [])
  const setVoiceId = useCallback((voiceId: string) => dispatch({ type: 'SET_VOICE_ID', voiceId }), [])
  const setVoiceStability = useCallback((value: number) => dispatch({ type: 'SET_VOICE_STABILITY', value }), [])
  const setVoiceSimilarity = useCallback((value: number) => dispatch({ type: 'SET_VOICE_SIMILARITY', value }), [])
  const setVoiceStyle = useCallback((value: number) => dispatch({ type: 'SET_VOICE_STYLE', value }), [])
  const setVoiceSpeed = useCallback((value: number) => dispatch({ type: 'SET_VOICE_SPEED', value }), [])
  const setCustomInstruction = useCallback((text: string) => dispatch({ type: 'SET_CUSTOM_INSTRUCTION', text }), [])
  const setAutoNarrate = useCallback((value: boolean) => dispatch({ type: 'SET_AUTO_NARRATE', value }), [])
  const setNarratorPhase = useCallback((phase: NarratorPhase) => dispatch({ type: 'SET_NARRATOR_PHASE', phase }), [])
  const setCurrentNarrativeText = useCallback((text: string) => dispatch({ type: 'SET_CURRENT_NARRATIVE_TEXT', text }), [])
  const addNarrativeHistory = useCallback((entry: NarrativeHistoryEntry) => dispatch({ type: 'ADD_NARRATIVE_HISTORY', entry }), [])
  const addMessage = useCallback((message: ChatMessage) => dispatch({ type: 'ADD_MESSAGE', message }), [])
  const setPendingQuestion = useCallback((question: string) => dispatch({ type: 'SET_PENDING_QUESTION', question }), [])
  const clearPendingQuestion = useCallback(() => dispatch({ type: 'CLEAR_PENDING_QUESTION' }), [])
  const setWalkActive = useCallback((value: boolean) => dispatch({ type: 'SET_WALK_ACTIVE', value }), [])
  const setNearestPOI = useCallback((poi: POI | null) => dispatch({ type: 'SET_NEAREST_POI', poi }), [])
  const setNearbyPOIs = useCallback((pois: POI[]) => dispatch({ type: 'SET_NEARBY_POIS', pois }), [])
  const addGem = useCallback(() => dispatch({ type: 'ADD_GEM' }), [])

  return (
    <AppContext.Provider
      value={{
        ...state,
        navigate,
        goBack,
        setUserName,
        setOnboardingDone,
        setNarrativeMode,
        setAutoAudio,
        setLeadingCues,
        setTheme,
        setVoiceId,
        setVoiceStability,
        setVoiceSimilarity,
        setVoiceStyle,
        setVoiceSpeed,
        setCustomInstruction,
        setAutoNarrate,
        setNarratorPhase,
        setCurrentNarrativeText,
        addNarrativeHistory,
        addMessage,
        setPendingQuestion,
        clearPendingQuestion,
        setWalkActive,
        setNearestPOI,
        setNearbyPOIs,
        addGem,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
