'use client'

import { useState } from 'react'
import { colors, borders } from '../tokens'
import { NavBar, NAV_HEIGHT } from '../primitives/nav-bar'
import { ToggleSwitch } from '../primitives/toggle-switch'
import { DiamondMarker, HeartIcon } from '../icons'

const TAB_LABELS = ['History', 'Saved', '⚙']

function HistoryTab() {
  return (
    <div style={{ padding: '16px 14px' }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: colors.teal, marginBottom: 16 }}>
        Today · 1.2km · 4 gems
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ padding: '14px', background: 'white', borderRadius: 12, border: borders.border }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <DiamondMarker size={14} color={colors.teal} style={{ marginTop: 2 }} />
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: colors.leaf }}>Hàng Bạc</div>
              <div style={{ fontSize: 11, color: colors.bark, margin: '2px 0 6px' }}>Story · 9:44</div>
              <div style={{ fontSize: 13, color: colors.leaf, lineHeight: 1.5 }}>
                "The silversmiths arrived here in 1428..."
              </div>
            </div>
          </div>
        </div>

        <div style={{ padding: '14px', background: 'white', borderRadius: 12, border: borders.border }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <DiamondMarker size={14} color={colors.teal} style={{ marginTop: 2 }} />
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: colors.leaf }}>Old City Gate</div>
              <div style={{ fontSize: 11, color: colors.bark, margin: '2px 0 6px' }}>History · 10:12</div>
              <div style={{ fontSize: 13, color: colors.leaf, lineHeight: 1.5 }}>
                "One of the original 21 gates of Thang Long..."
              </div>
            </div>
          </div>
        </div>

        <button style={{ padding: '10px', background: colors.mistBg, border: borders.border, borderRadius: 8, fontSize: 12, color: colors.bark, cursor: 'pointer' }}>
          + 2 more gems
        </button>
      </div>
    </div>
  )
}

function SavedTab() {
  return (
    <div style={{ padding: '16px 14px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ padding: '14px', background: 'white', borderRadius: 12, border: borders.border, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <DiamondMarker size={14} color={colors.teal} />
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: colors.leaf }}>Bach Ma Temple</div>
              <div style={{ fontSize: 11, color: colors.bark, marginTop: 2 }}>Saved 3 days ago</div>
            </div>
          </div>
          <HeartIcon size={20} color={colors.teal} />
        </div>

        <div style={{ padding: '14px', background: 'white', borderRadius: 12, border: borders.border, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <DiamondMarker size={14} color={colors.teal} />
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: colors.leaf }}>Silk Lantern Workshop</div>
              <div style={{ fontSize: 11, color: colors.bark, marginTop: 2 }}>Saved 1 week ago</div>
            </div>
          </div>
          <HeartIcon size={20} color={colors.teal} />
        </div>
      </div>
    </div>
  )
}

function SettingsSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: colors.bark, letterSpacing: 1, marginBottom: 8, padding: '0 14px' }}>
        {title}
      </div>
      <div style={{ background: 'white', borderTop: borders.border, borderBottom: borders.border }}>
        {children}
      </div>
    </div>
  )
}

function SettingsRow({ label, control }: { label: string; control: React.ReactNode }) {
  return (
    <div style={{ padding: '14px', borderBottom: borders.border, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontSize: 14, color: colors.leaf }}>{label}</span>
      {control}
    </div>
  )
}

function SettingsTab() {
  const [autoAudio, setAutoAudio] = useState(false)
  const [leadingCues, setLeadingCues] = useState(true)
  const [autoPause, setAutoPause] = useState(true)

  return (
    <div style={{ padding: '16px 0' }}>
      <SettingsSection title="NARRATIVE">
        <SettingsRow 
          label="Default mode" 
          control={<span style={{ fontSize: 14, color: colors.teal, cursor: 'pointer' }}>Story ›</span>} 
        />
      </SettingsSection>

      <SettingsSection title="WALKING">
        <SettingsRow 
          label="Auto-audio" 
          control={<ToggleSwitch on={autoAudio} onToggle={() => setAutoAudio(!autoAudio)} />} 
        />
        <SettingsRow 
          label="Leading cues" 
          control={<ToggleSwitch on={leadingCues} onToggle={() => setLeadingCues(!leadingCues)} />} 
        />
      </SettingsSection>

      <SettingsSection title="AUDIO">
        <SettingsRow 
          label="Auto-pause on call" 
          control={<ToggleSwitch on={autoPause} onToggle={() => setAutoPause(!autoPause)} />} 
        />
      </SettingsSection>

      <div style={{ padding: '0 14px', marginTop: 32 }}>
        <button style={{ padding: '14px', width: '100%', borderRadius: 12, background: 'rgba(231,76,60,0.1)', color: '#E74C3C', border: 'none', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
          Sign out
        </button>
      </div>
    </div>
  )
}

export function ScreenProfile() {
  const [tab, setTab] = useState(0)

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: colors.mist, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '14px 14px 0', borderBottom: borders.border, flexShrink: 0, background: 'white' }}>
        <h1 style={{ fontSize: 18, fontWeight: 700, color: colors.leaf, margin: '0 0 14px 0' }}>Profile</h1>
        
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
              <span
                style={{
                  fontSize: 13,
                  fontWeight: tab === i ? 600 : 500,
                  color: tab === i ? colors.teal : colors.bark,
                }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: NAV_HEIGHT }}>
        {tab === 0 && <HistoryTab />}
        {tab === 1 && <SavedTab />}
        {tab === 2 && <SettingsTab />}
      </div>

      <NavBar active={2} />
    </div>
  )
}
