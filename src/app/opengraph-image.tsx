import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export const alt = 'Sequoia Enterprise Solutions — Fueling Growth & Expanding Possibilities'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  const logoData = await readFile(join(process.cwd(), 'public/logo-gold.png'))
  const logoSrc = `data:image/png;base64,${logoData.toString('base64')}`

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(145deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)',
          position: 'relative',
        }}
      >
        {/* Subtle gold accent line at top */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, transparent, #C5A55A, transparent)',
            display: 'flex',
          }}
        />

        {/* Logo */}
        <img
          src={logoSrc}
          width={280}
          height={70}
          alt=""
          style={{ marginBottom: '40px' }}
        />

        {/* Tagline */}
        <div
          style={{
            fontSize: 32,
            fontWeight: 600,
            color: '#ffffff',
            textAlign: 'center',
            lineHeight: 1.3,
            marginBottom: '24px',
            display: 'flex',
          }}
        >
          Fueling Growth &amp; Expanding Possibilities
        </div>

        {/* Service pills */}
        <div
          style={{
            display: 'flex',
            gap: '16px',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          {['Commercial Lending', 'Business Consulting', 'Wellness Programs', 'Clean Energy'].map(
            (label) => (
              <div
                key={label}
                style={{
                  fontSize: 16,
                  color: '#C5A55A',
                  border: '1px solid rgba(197, 165, 90, 0.3)',
                  borderRadius: '999px',
                  padding: '8px 20px',
                  display: 'flex',
                }}
              >
                {label}
              </div>
            )
          )}
        </div>

        {/* URL at bottom */}
        <div
          style={{
            position: 'absolute',
            bottom: '32px',
            fontSize: 16,
            color: 'rgba(255, 255, 255, 0.4)',
            display: 'flex',
          }}
        >
          seqsolution.com
        </div>

        {/* Subtle gold accent line at bottom */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, transparent, #C5A55A, transparent)',
            display: 'flex',
          }}
        />
      </div>
    ),
    { ...size }
  )
}
