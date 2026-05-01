'use client'

import { colors, borders } from '../tokens'
import { useAppContext } from '../context/app-context'

interface InfoTabProps {
  dark?: boolean
}

// ── Tag extraction helpers ────────────────────────────────────────────────

function tag(tags: Record<string, string> | undefined, ...keys: string[]): string | undefined {
  if (!tags) return undefined
  for (const k of keys) {
    if (tags[k]) return tags[k]
  }
  return undefined
}

function formatUrl(url: string): string {
  return url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')
}

function formatHours(raw: string): string {
  // "Mo-Fr 08:00-18:00; Sa 08:00-14:00" → keep as-is but trim
  return raw.trim()
}

// ── Row components ─────────────────────────────────────────────────────────

function Section({ title, dark, children }: { title: string; dark: boolean; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{
        fontSize: 9,
        fontWeight: 700,
        letterSpacing: 1.2,
        color: colors.bark,
        textTransform: 'uppercase',
        marginBottom: 8,
        paddingBottom: 4,
        borderBottom: `1px solid ${dark ? 'rgba(245,247,242,0.08)' : 'rgba(28,39,32,0.08)'}`,
      }}>
        {title}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {children}
      </div>
    </div>
  )
}

function Row({ label, value, dark, link }: { label: string; value: string; dark: boolean; link?: string }) {
  const textColor = dark ? colors.mist : colors.leaf
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
      <span style={{ fontSize: 11, color: colors.bark, flexShrink: 0, paddingTop: 1 }}>{label}</span>
      {link ? (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: 11,
            fontWeight: 500,
            color: colors.teal,
            textAlign: 'right',
            maxWidth: '65%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            textDecoration: 'none',
          }}
        >
          {value}
        </a>
      ) : (
        <span style={{
          fontSize: 11,
          fontWeight: 500,
          color: textColor,
          textAlign: 'right',
          maxWidth: '65%',
          lineHeight: 1.4,
        }}>
          {value}
        </span>
      )}
    </div>
  )
}

function Badge({ label, color, bg }: { label: string; color: string; bg: string }) {
  return (
    <span style={{
      display: 'inline-block',
      fontSize: 10,
      fontWeight: 600,
      color,
      background: bg,
      borderRadius: 6,
      padding: '3px 8px',
      marginRight: 4,
      marginBottom: 4,
    }}>
      {label}
    </span>
  )
}

// ── Main component ────────────────────────────────────────────────────────

export function InfoTab({ dark = false }: InfoTabProps) {
  const { nearestPOI, nearbyPOIs, setNearestPOI, theme } = useAppContext()
  const isDark = dark || theme === 'dark'
  const textPrimary = isDark ? colors.mist : colors.leaf
  const divider = isDark ? 'rgba(245,247,242,0.08)' : 'rgba(28,39,32,0.08)'

  if (!nearestPOI) {
    return (
      <div style={{ padding: '20px 14px', textAlign: 'center', color: colors.bark, fontSize: 13 }}>
        Loading landmark information…
      </div>
    )
  }

  const t = nearestPOI.tags ?? {}

  // ── Identity ──────────────────────────────────────────────────────────
  const nameLong = tag(t, 'name:en', 'name')
  const nameLocal = tag(t, 'name:vi', 'name:zh', 'name:fr', 'name:ja', 'name:ko')
  const altName = tag(t, 'alt_name', 'official_name', 'short_name')
  const poiType = nearestPOI.type
  const category = tag(t, 'tourism', 'historic', 'amenity', 'leisure', 'shop', 'craft')
  const heritage = tag(t, 'heritage', 'heritage:operator')
  const heritageRef = tag(t, 'ref:whc', 'heritage:ref')

  // ── Location ──────────────────────────────────────────────────────────
  const street = [tag(t, 'addr:housenumber'), tag(t, 'addr:street')].filter(Boolean).join(' ')
  const ward = tag(t, 'addr:suburb', 'addr:quarter', 'addr:ward')
  const district = tag(t, 'addr:district', 'addr:city_block')
  const city = tag(t, 'addr:city', 'addr:province')
  const postcode = tag(t, 'addr:postcode')
  const coordinates = `${nearestPOI.lat.toFixed(5)}, ${nearestPOI.lng.toFixed(5)}`

  // ── History & classification ──────────────────────────────────────────
  const startDate = tag(t, 'start_date')
  const historicPeriod = tag(t, 'historic:period')
  const historicCivil = tag(t, 'historic:civilization')
  const architect = tag(t, 'architect', 'designer')
  const builtBy = tag(t, 'built_by', 'commissioned_by')
  const operator = tag(t, 'operator', 'owner', 'managed_by')
  const religion = tag(t, 'religion')
  const denomination = tag(t, 'denomination')

  // ── Practical ─────────────────────────────────────────────────────────
  const openingHours = tag(t, 'opening_hours')
  const openingHoursDetails = tag(t, 'opening_hours:details', 'service_times')
  const fee = tag(t, 'fee')
  const charge = tag(t, 'charge')
  const phoneRaw = tag(t, 'phone', 'contact:phone')
  const email = tag(t, 'email', 'contact:email')
  const websiteRaw = tag(t, 'website', 'contact:website', 'url', 'contact:url')
  const wikipedia = tag(t, 'wikipedia', 'wikidata')
  const wikimapiaId = tag(t, 'wikimapia')

  // ── Accessibility & facilities ────────────────────────────────────────
  const wheelchair = tag(t, 'wheelchair')
  const toilets = tag(t, 'toilets', 'toilets:wheelchair')
  const internet = tag(t, 'internet_access', 'wifi')
  const parking = tag(t, 'parking')
  const elevator = tag(t, 'elevator')

  // ── Physical attributes ───────────────────────────────────────────────
  const height = tag(t, 'height', 'building:levels')
  const material = tag(t, 'building:material', 'material')
  const colour = tag(t, 'building:colour', 'colour')
  const roofShape = tag(t, 'roof:shape')
  const surface = tag(t, 'surface')
  const capacity = tag(t, 'capacity')

  // ── Description ───────────────────────────────────────────────────────
  const description = tag(t, 'description', 'description:en', 'note')

  // ── Badges ────────────────────────────────────────────────────────────
  const badges: { label: string; color: string; bg: string }[] = []
  if (fee === 'no') badges.push({ label: 'Free entry', color: colors.teal, bg: 'rgba(42,117,96,0.12)' })
  if (fee === 'yes') badges.push({ label: 'Paid entry', color: colors.gold, bg: 'rgba(232,168,80,0.12)' })
  if (wheelchair === 'yes') badges.push({ label: 'Accessible', color: colors.teal, bg: 'rgba(42,117,96,0.12)' })
  if (wheelchair === 'no') badges.push({ label: 'Not accessible', color: colors.bark, bg: 'rgba(28,39,32,0.08)' })
  if (heritage) badges.push({ label: `Heritage ${heritage}`, color: colors.gold, bg: 'rgba(232,168,80,0.12)' })
  if (internet === 'wlan' || internet === 'yes') badges.push({ label: 'Wi-Fi', color: colors.teal, bg: 'rgba(42,117,96,0.12)' })

  const formatDist = (m: number | undefined) => {
    if (m === undefined) return ''
    if (m < 1000) return `${Math.round(m)}m`
    return `${(m / 1000).toFixed(1)}km`
  }

  return (
    <div style={{ padding: '14px 14px 24px', display: 'flex', flexDirection: 'column' }}>

      {/* Hero: name + type */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: textPrimary, lineHeight: 1.2, marginBottom: 4 }}>
          {nameLong || nearestPOI.name}
        </div>
        {nameLocal && nameLocal !== nameLong && (
          <div style={{ fontSize: 13, color: colors.bark, marginBottom: 2 }}>{nameLocal}</div>
        )}
        {altName && (
          <div style={{ fontSize: 11, color: colors.bark, fontStyle: 'italic' }}>Also: {altName}</div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 }}>
          {poiType && (
            <span style={{ fontSize: 11, fontWeight: 600, color: colors.teal, textTransform: 'capitalize' }}>{poiType}</span>
          )}
          {category && category !== poiType && (
            <>
              <span style={{ color: colors.bark, fontSize: 11 }}>·</span>
              <span style={{ fontSize: 11, color: colors.bark, textTransform: 'capitalize' }}>{category}</span>
            </>
          )}
          <span style={{ color: colors.bark, fontSize: 11 }}>·</span>
          <span style={{ fontSize: 11, fontWeight: 600, color: colors.teal }}>{formatDist(nearestPOI.distance)}</span>
        </div>
      </div>

      {/* Badges */}
      {badges.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: 12 }}>
          {badges.map((b) => <Badge key={b.label} {...b} />)}
        </div>
      )}

      <div style={{ height: 1, background: divider, marginBottom: 14 }} />

      {/* Description */}
      {(description || nearestPOI.description) && (
        <div style={{ marginBottom: 16 }}>
          <p style={{ fontSize: 12, color: isDark ? 'rgba(245,247,242,0.75)' : 'rgba(28,39,32,0.7)', lineHeight: 1.65, margin: 0 }}>
            {description || nearestPOI.description}
          </p>
        </div>
      )}

      {/* History & identity */}
      {(startDate || historicPeriod || historicCivil || architect || builtBy || religion || denomination || heritageRef) && (
        <Section title="History" dark={isDark}>
          {startDate && <Row label="Established" value={startDate} dark={isDark} />}
          {historicPeriod && <Row label="Period" value={historicPeriod} dark={isDark} />}
          {historicCivil && <Row label="Civilization" value={historicCivil} dark={isDark} />}
          {architect && <Row label="Architect" value={architect} dark={isDark} />}
          {builtBy && <Row label="Built by" value={builtBy} dark={isDark} />}
          {religion && <Row label="Religion" value={religion.charAt(0).toUpperCase() + religion.slice(1)} dark={isDark} />}
          {denomination && <Row label="Denomination" value={denomination} dark={isDark} />}
          {heritageRef && <Row label="Heritage ref" value={heritageRef} dark={isDark} />}
        </Section>
      )}

      {/* Location */}
      {(street || ward || district || city || postcode) && (
        <Section title="Location" dark={isDark}>
          {street && <Row label="Address" value={street} dark={isDark} />}
          {ward && <Row label="Ward" value={ward} dark={isDark} />}
          {district && <Row label="District" value={district} dark={isDark} />}
          {city && <Row label="City" value={city} dark={isDark} />}
          {postcode && <Row label="Postcode" value={postcode} dark={isDark} />}
          <Row label="Coordinates" value={coordinates} dark={isDark} />
        </Section>
      )}

      {/* If no address fields, still show coordinates */}
      {!street && !ward && !district && !city && (
        <Section title="Location" dark={isDark}>
          {nearestPOI.address && <Row label="Address" value={nearestPOI.address} dark={isDark} />}
          <Row label="Coordinates" value={coordinates} dark={isDark} />
        </Section>
      )}

      {/* Practical info */}
      {(openingHours || fee || charge || operator || capacity) && (
        <Section title="Visit" dark={isDark}>
          {openingHours && <Row label="Hours" value={formatHours(openingHours)} dark={isDark} />}
          {openingHoursDetails && <Row label="Notes" value={openingHoursDetails} dark={isDark} />}
          {fee && fee !== 'yes' && fee !== 'no' && <Row label="Fee" value={fee} dark={isDark} />}
          {!fee && charge && <Row label="Charge" value={charge} dark={isDark} />}
          {operator && <Row label="Operator" value={operator} dark={isDark} />}
          {capacity && <Row label="Capacity" value={capacity} dark={isDark} />}
        </Section>
      )}

      {/* Contact & web */}
      {(phoneRaw || email || websiteRaw || wikipedia) && (
        <Section title="Contact" dark={isDark}>
          {phoneRaw && <Row label="Phone" value={phoneRaw} dark={isDark} link={`tel:${phoneRaw.replace(/\s/g, '')}`} />}
          {email && <Row label="Email" value={email} dark={isDark} link={`mailto:${email}`} />}
          {websiteRaw && (
            <Row label="Website" value={formatUrl(websiteRaw)} dark={isDark} link={websiteRaw.startsWith('http') ? websiteRaw : `https://${websiteRaw}`} />
          )}
          {wikipedia && (
            <Row label="Wikipedia" value={wikipedia} dark={isDark}
              link={wikipedia.startsWith('Q') ? `https://www.wikidata.org/wiki/${wikipedia}` : `https://en.wikipedia.org/wiki/${wikipedia.replace(/^[a-z]{2}:/, '')}`}
            />
          )}
        </Section>
      )}

      {/* Facilities & accessibility */}
      {(wheelchair || toilets || internet || parking || elevator) && (
        <Section title="Facilities" dark={isDark}>
          {wheelchair && <Row label="Wheelchair" value={wheelchair.charAt(0).toUpperCase() + wheelchair.slice(1)} dark={isDark} />}
          {toilets && <Row label="Toilets" value={toilets.charAt(0).toUpperCase() + toilets.slice(1)} dark={isDark} />}
          {internet && <Row label="Internet" value={internet === 'wlan' ? 'Wi-Fi' : internet.charAt(0).toUpperCase() + internet.slice(1)} dark={isDark} />}
          {parking && <Row label="Parking" value={parking} dark={isDark} />}
          {elevator && <Row label="Elevator" value={elevator.charAt(0).toUpperCase() + elevator.slice(1)} dark={isDark} />}
        </Section>
      )}

      {/* Physical */}
      {(height || material || colour || roofShape || surface) && (
        <Section title="Physical" dark={isDark}>
          {height && <Row label="Height / Floors" value={height} dark={isDark} />}
          {material && <Row label="Material" value={material} dark={isDark} />}
          {colour && <Row label="Colour" value={colour} dark={isDark} />}
          {roofShape && <Row label="Roof" value={roofShape} dark={isDark} />}
          {surface && <Row label="Surface" value={surface} dark={isDark} />}
        </Section>
      )}

      {/* Refine Location / Nearby Places */}
      {nearbyPOIs && nearbyPOIs.length > 0 && (
        <div style={{ marginTop: 12 }}>
          <Section title="Refine Location" dark={isDark}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
              {nearbyPOIs
                .filter(p => p.name !== nearestPOI.name)
                .slice(0, 5)
                .map((p, i) => (
                  <button
                    key={i}
                    onClick={() => setNearestPOI(p)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      padding: '10px 12px',
                      background: isDark ? 'rgba(245,247,242,0.03)' : 'rgba(28,39,32,0.03)',
                      border: `1px solid ${isDark ? 'rgba(245,247,242,0.08)' : 'rgba(28,39,32,0.08)'}`,
                      borderRadius: 10,
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = isDark ? 'rgba(245,247,242,0.06)' : 'rgba(28,39,32,0.06)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = isDark ? 'rgba(245,247,242,0.03)' : 'rgba(28,39,32,0.03)')}
                  >
                    <div style={{ fontSize: 12, fontWeight: 600, color: textPrimary }}>{p.name}</div>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginTop: 2 }}>
                      <span style={{ fontSize: 10, color: colors.teal, fontWeight: 500 }}>{p.type}</span>
                      <span style={{ color: colors.bark, fontSize: 10 }}>·</span>
                      <span style={{ fontSize: 10, fontWeight: 600, color: colors.teal }}>{formatDist(p.distance)}</span>
                      {p.address && (
                        <>
                          <span style={{ color: colors.bark, fontSize: 10 }}>·</span>
                          <span style={{ fontSize: 10, color: colors.bark, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.address}</span>
                        </>
                      )}
                    </div>
                  </button>
                ))}
            </div>
          </Section>
        </div>
      )}

    </div>
  )
}
