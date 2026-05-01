'use client'

import { useState } from 'react'
import { colors, borders } from '../tokens'
import { NavBar, NAV_HEIGHT } from '../primitives/nav-bar'
import { ToggleSwitch } from '../primitives/toggle-switch'
import { DiamondMarker, HeartIcon } from '../icons'
import { useAppContext } from '../context/app-context'

const TAB_LABELS = ['History', 'Saved', '⚙']

function HistoryTab({ dark }: { dark: boolean }) {
  const cardBg = dark ? 'rgba(245,247,242,0.04)' : 'white'
  const border = dark ? borders.borderD : borders.border
  const textPrimary = dark ? colors.mist : colors.leaf

  return (
    <div style={{ padding: '16px 14px' }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: colors.teal, marginBottom: 16 }}>
        Today · 1.2km · 4 gems
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ padding: '14px', background: cardBg, borderRadius: 12, border: border }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <DiamondMarker size={14} color={colors.teal} style={{ marginTop: 2 }} />
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: textPrimary }}>Hàng Bạc</div>
              <div style={{ fontSize: 11, color: colors.bark, margin: '2px 0 6px' }}>Story · 9:44</div>
              <div style={{ fontSize: 13, color: textPrimary, lineHeight: 1.5 }}>
                "The silversmiths arrived here in 1428..."
              </div>
            </div>
          </div>
        </div>

        <div style={{ padding: '14px', background: cardBg, borderRadius: 12, border: border }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <DiamondMarker size={14} color={colors.teal} style={{ marginTop: 2 }} />
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: textPrimary }}>Old City Gate</div>
              <div style={{ fontSize: 11, color: colors.bark, margin: '2px 0 6px' }}>History · 10:12</div>
              <div style={{ fontSize: 13, color: textPrimary, lineHeight: 1.5 }}>
                "One of the original 21 gates of Thang Long..."
              </div>
            </div>
          </div>
        </div>

        <button style={{ padding: '10px', background: dark ? 'rgba(245,247,242,0.06)' : colors.mistBg, border: border, borderRadius: 8, fontSize: 12, color: colors.bark, cursor: 'pointer' }}>
          + 2 more gems
        </button>
      </div>
    </div>
  )
}

function SavedTab({ dark }: { dark: boolean }) {
  const cardBg = dark ? 'rgba(245,247,242,0.04)' : 'white'
  const border = dark ? borders.borderD : borders.border
  const textPrimary = dark ? colors.mist : colors.leaf

  return (
    <div style={{ padding: '16px 14px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ padding: '14px', background: cardBg, borderRadius: 12, border: border, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <DiamondMarker size={14} color={colors.teal} />
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: textPrimary }}>Bach Ma Temple</div>
              <div style={{ fontSize: 11, color: colors.bark, marginTop: 2 }}>Saved 3 days ago</div>
            </div>
          </div>
          <HeartIcon size={20} color={colors.teal} />
        </div>

        <div style={{ padding: '14px', background: cardBg, borderRadius: 12, border: border, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <DiamondMarker size={14} color={colors.teal} />
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: textPrimary }}>Silk Lantern Workshop</div>
              <div style={{ fontSize: 11, color: colors.bark, marginTop: 2 }}>Saved 1 week ago</div>
            </div>
          </div>
          <HeartIcon size={20} color={colors.teal} />
        </div>
      </div>
    </div>
  )
}

function SettingsSection({ title, children, dark }: { title: string; children: React.ReactNode; dark: boolean }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: colors.bark, letterSpacing: 1, marginBottom: 8, padding: '0 14px' }}>
        {title}
      </div>
      <div style={{ background: dark ? 'rgba(245,247,242,0.03)' : 'white', borderTop: dark ? borders.borderD : borders.border, borderBottom: dark ? borders.borderD : borders.border }}>
        {children}
      </div>
    </div>
  )
}

function SettingsRow({ label, control, dark, last = false }: { label: string; control: React.ReactNode; dark: boolean; last?: boolean }) {
  return (
    <div style={{ padding: '14px', borderBottom: last ? 'none' : (dark ? borders.borderD : borders.border), display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontSize: 14, color: dark ? colors.mist : colors.leaf }}>{label}</span>
      {control}
    </div>
  )
}

function SettingsTab() {
  const { autoAudio, setAutoAudio, leadingCues, setLeadingCues, narrativeMode, navigate, theme, setTheme } = useAppContext()
  const [autoPause, setAutoPause] = useState(true)
  const isDark = theme === 'dark'
  const modeLabel = narrativeMode.charAt(0).toUpperCase() + narrativeMode.slice(1)

  return (
    <div style={{ padding: '16px 0' }}>
      <SettingsSection title="APPEARANCE" dark={isDark}>
        <SettingsRow
          label="Night Mode"
          dark={isDark}
          control={<ToggleSwitch on={isDark} onToggle={() => setTheme(isDark ? 'light' : 'dark')} />}
          last
        />
      </SettingsSection>

      <SettingsSection title="NARRATIVE" dark={isDark}>
        <SettingsRow
          label="Default mode"
          dark={isDark}
          control={<span style={{ fontSize: 14, color: colors.teal, cursor: 'pointer' }}>{modeLabel} ›</span>}
          last
        />
      </SettingsSection>

      <SettingsSection title="WALKING" dark={isDark}>
        <SettingsRow
          label="Auto-audio"
          dark={isDark}
          control={<ToggleSwitch on={autoAudio} onToggle={() => setAutoAudio(!autoAudio)} />}
        />
        <SettingsRow
          label="Leading cues"
          dark={isDark}
          control={<ToggleSwitch on={leadingCues} onToggle={() => setLeadingCues(!leadingCues)} />}
          last
        />
      </SettingsSection>

      <SettingsSection title="AUDIO" dark={isDark}>
        <SettingsRow
          label="Auto-pause on call"
          dark={isDark}
          control={<ToggleSwitch on={autoPause} onToggle={() => setAutoPause(!autoPause)} />}
          last
        />
      </SettingsSection>

      <div style={{ padding: '0 14px', marginTop: 32 }}>
        <button
          onClick={() => navigate('splash')}
          style={{ padding: '14px', width: '100%', borderRadius: 12, background: 'rgba(231,76,60,0.1)', color: '#E74C3C', border: 'none', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
        >
          Sign out
        </button>
      </div>
    </div>
  )
}

const NAV_SCREENS = ['home', 'smart-walk', 'voice-ask', 'profile'] as const

export function ScreenProfile() {
  const { navigate, theme } = useAppContext()
  const [tab, setTab] = useState(0)
  const isDark = theme === 'dark'

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: isDark ? colors.leaf : colors.mist, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '14px 14px 0', borderBottom: isDark ? borders.borderD : borders.border, flexShrink: 0, background: isDark ? 'rgba(0,0,0,0.15)' : 'white' }}>
        <h1 style={{ fontSize: 18, fontWeight: 700, color: isDark ? colors.mist : colors.leaf, margin: '0 0 14px 0' }}>Profile</h1>

        {/* Tab row */}
        <div style={{ display: 'flex' }}>
          {TAB_LABELS.map((label, i) => (
            <div
              key={label}
              onClick={() => setTab(i)}
              style={{
                flex: 1,
                padding: '10px 0',
                textAlign: 'center',
                cursor: 'pointer',
                borderBottom: tab === i ? `2px solid ${colors.teal}` : '2px solid transparent',
              }}
            >
              <span style={{ fontSize: 13, fontWeight: tab === i ? 600 : 500, color: tab === i ? colors.teal : colors.bark }}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: NAV_HEIGHT }}>
        {tab === 0 && <HistoryTab dark={isDark} />}
        {tab === 1 && <SavedTab dark={isDark} />}
        {tab === 2 && <SettingsTab />}
      </div>

      <NavBar active={3} onNavigate={(t) => navigate(NAV_SCREENS[t])} />
    </div>
  )
}

