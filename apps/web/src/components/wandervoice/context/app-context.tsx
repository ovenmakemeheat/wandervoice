'use client'

import { createContext, useContext, useReducer, useCallback, type ReactNode } from 'react'

// ── Types ─────────────────────────────────────────────────────────────────

export type NarrativeMode = 'story' | 'facts' | 'secrets'

export type ThemeMode = 'light' | 'dark'

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

export interface ChatMessage {
  id: string
  role: 'user' | 'ai'
  text: string
  audioSecs?: number
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

  // Walk session (simulated)
  walkActive: boolean
  gemsCollected: number
  distanceKm: number

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
  | { type: 'ADD_MESSAGE'; message: ChatMessage }
  | { type: 'SET_PENDING_QUESTION'; question: string }
  | { type: 'CLEAR_PENDING_QUESTION' }
  | { type: 'SET_WALK_ACTIVE'; value: boolean }
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
    case 'ADD_MESSAGE':
      return { ...state, chatHistory: [...state.chatHistory, action.message] }
    case 'SET_PENDING_QUESTION':
      return { ...state, pendingQuestion: action.question }
    case 'CLEAR_PENDING_QUESTION':
      return { ...state, pendingQuestion: '' }
    case 'SET_WALK_ACTIVE':
      return { ...state, walkActive: action.value }
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
  userName: '',
  onboardingDone: false,
  narrativeMode: 'story',
  autoAudio: true,
  leadingCues: true,
  theme: 'dark',
  walkActive: false,
  gemsCollected: 4,
  distanceKm: 1.2,
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
  addMessage: (message: ChatMessage) => void
  setPendingQuestion: (question: string) => void
  clearPendingQuestion: () => void
  setWalkActive: (value: boolean) => void
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
  const addMessage = useCallback((message: ChatMessage) => dispatch({ type: 'ADD_MESSAGE', message }), [])
  const setPendingQuestion = useCallback((question: string) => dispatch({ type: 'SET_PENDING_QUESTION', question }), [])
  const clearPendingQuestion = useCallback(() => dispatch({ type: 'CLEAR_PENDING_QUESTION' }), [])
  const setWalkActive = useCallback((value: boolean) => dispatch({ type: 'SET_WALK_ACTIVE', value }), [])
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
        addMessage,
        setPendingQuestion,
        clearPendingQuestion,
        setWalkActive,
        addGem,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
