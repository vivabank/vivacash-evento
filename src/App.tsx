import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Fade from '@mui/material/Fade'
import StepHero from './components/StepHero'
import StepForm from './components/StepForm'
import StepResult from './components/StepResult'
import StepFinal from './components/StepFinal'
import type { FormData } from './types'

export default function App() {
  const [step, setStep] = useState(0)
  const [formData, setFormData] = useState<FormData | null>(null)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [step])

  const next = () => setStep((s) => Math.min(s + 1, 3))

  const screens = [
    <StepHero onNext={next} />,
    <StepForm onNext={(data) => { setFormData(data); next() }} />,
    <StepResult onNext={next} />,
    <StepFinal formData={formData} />,
  ]

  return (
    <Fade in key={step} timeout={400}>
      <Box>{screens[step]}</Box>
    </Fade>
  )
}
