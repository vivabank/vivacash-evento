import type { ReactNode } from 'react'
import Box from '@mui/material/Box'
import type { SxProps, Theme } from '@mui/material/styles'

interface StepLayoutProps {
  children: ReactNode
  /** Styles applied to the full-height outer section (background color, etc.) */
  sx?: SxProps<Theme>
  /** Optional background image path. Rendered as <img> behind content for higher quality scaling than background-image. */
  bg?: string
  /** Max width of the centered content column */
  maxWidth?: number
}

export default function StepLayout({ children, sx, bg, maxWidth = 680 }: StepLayoutProps) {
  return (
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: { xs: 3, sm: 5 },
        py: { xs: 6, sm: 8 },
        ...sx,
      }}
    >
      {bg && (
        <Box
          component="img"
          src={bg}
          alt=""
          aria-hidden
          sx={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            zIndex: 0,
            userSelect: 'none',
            pointerEvents: 'none',
          }}
        />
      )}
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          maxWidth,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        {children}
      </Box>
    </Box>
  )
}
