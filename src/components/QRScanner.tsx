import { useCallback, useEffect, useRef, useState } from 'react'
import jsQR from 'jsqr'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { colors } from '../theme'

interface QRScannerProps {
  onCancel: () => void
  onCodeDetected: (code: string) => void
}

export default function QRScanner({ onCancel, onCodeDetected }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const scanningRef = useRef(true)
  const [cameraError, setCameraError] = useState<string | null>(null)

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
  }, [])

  const scanFrame = useCallback(
    (ctx: CanvasRenderingContext2D, video: HTMLVideoElement, canvas: HTMLCanvasElement) => {
      if (!scanningRef.current) return

      if (video.videoWidth === 0 || video.videoHeight === 0) {
        requestAnimationFrame(() => scanFrame(ctx, video, canvas))
        return
      }

      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert',
      })

      if (code) {
        scanningRef.current = false
        stopStream()
        onCodeDetected(code.data)
      } else {
        requestAnimationFrame(() => scanFrame(ctx, video, canvas))
      }
    },
    []
  )

  useEffect(() => {
    let cancelled = false
    scanningRef.current = true // reset para o double-invoke do StrictMode

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'environment' } })
      .then(async (stream) => {
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop())
          return
        }
        streamRef.current = stream
        const video = videoRef.current
        const canvas = canvasRef.current
        if (!video || !canvas) return

        video.srcObject = stream
        await video.play()

        if (!cancelled && scanningRef.current) {
          const ctx = canvas.getContext('2d')
          if (ctx) scanFrame(ctx, video, canvas)
        }
      })
      .catch(() => {
        if (!cancelled) setCameraError('Não foi possível acessar a câmera.')
      })

    return () => {
      cancelled = true
      scanningRef.current = false
      stopStream()
    }
  }, [scanFrame, stopStream])

  const handleCancel = () => {
    stopStream()
    onCancel()
  }

  return (
    <Box
      sx={{
        mt: 3,
        p: { xs: 3, sm: 4 },
        bgcolor: '#FFFFFF',
        borderRadius: 4,
        boxShadow: '0 18px 40px rgba(0,0,0,0.35)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
      }}
    >
      <Typography
        component="h2"
        sx={{ fontWeight: 700, fontSize: { xs: 18, sm: 22 }, color: colors.navy, mb: 0.5 }}
      >
        Escanear QR Code
      </Typography>
      <Typography sx={{ color: 'text.secondary', fontSize: 14, mb: 2.5 }}>
        Aponte a câmera para o QR Code
      </Typography>

      {cameraError ? (
        <Typography sx={{ color: 'error.main', mb: 2 }}>{cameraError}</Typography>
      ) : (
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            maxWidth: 320,
            borderRadius: 3,
            overflow: 'hidden',
            bgcolor: '#000',
            aspectRatio: '1 / 1',
            mb: 2.5,
          }}
        >
          <Box
            component="video"
            ref={videoRef}
            autoPlay
            playsInline
            sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
          <canvas ref={canvasRef} hidden />
          {/* scan frame overlay */}
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none',
            }}
          >
            <Box
              sx={{
                width: '60%',
                aspectRatio: '1 / 1',
                border: `3px solid ${colors.cyan}`,
                borderRadius: 2,
                boxShadow: `0 0 0 2000px rgba(0,0,0,0.45)`,
              }}
            />
          </Box>
        </Box>
      )}

      <Button variant="outlined" color="primary" onClick={handleCancel}>
        Cancelar
      </Button>
    </Box>
  )
}
