import { useState } from 'react'
import type { ReactNode } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined'
import ApartmentOutlinedIcon from '@mui/icons-material/ApartmentOutlined'
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined'
import StepLayout from './StepLayout'
import { colors } from '../theme'
import type { FormData, StepFormProps } from '../types'
import { isValidCPF, maskCPF } from '../utils/cpf'

interface FieldBlockProps {
  label: string
  icon: ReactNode
  value: string
  placeholder: string
  error?: string
  onChange: (value: string) => void
}

function FieldBlock({ label, icon, value, placeholder, error, onChange }: FieldBlockProps) {
  return (
    <Box sx={{ width: '100%', mb: 2.5 }}>
      <Typography
        sx={{
          color: colors.navy,
          fontWeight: 700,
          fontSize: 13,
          letterSpacing: '0.04em',
          mb: 0.75,
        }}
      >
        {label}
      </Typography>
      <TextField
        fullWidth
        value={value}
        placeholder={placeholder}
        error={Boolean(error)}
        helperText={error}
        onChange={(e) => onChange(e.target.value)}
        slotProps={{
          input: {
            startAdornment: <InputAdornment position="start">{icon}</InputAdornment>,
          },
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            bgcolor: '#FFFFFF',
            borderRadius: 2,
            boxShadow: '0 4px 14px rgba(11,42,74,0.08)',
            '& fieldset': { borderColor: '#E2E8F0' },
          },
          '& input::placeholder': { fontSize: 13, letterSpacing: '0.03em' },
        }}
      />
    </Box>
  )
}

export default function StepForm({ onNext }: StepFormProps) {
  const [nome, setNome] = useState('')
  const [cpf, setCpf] = useState('')
  const [empresa, setEmpresa] = useState('')
  const [cargo, setCargo] = useState('')
  const [errors, setErrors] = useState<Partial<FormData>>({})

  const handleSubmit = () => {
    const next: Partial<FormData> = {}
    if (!nome.trim()) next.nome = 'Informe seu nome completo.'
    if (!isValidCPF(cpf)) next.cpf = 'Informe um CPF válido.'
    if (!empresa.trim()) next.empresa = 'Informe a empresa.'
    if (!cargo.trim()) next.cargo = 'Informe o cargo.'
    setErrors(next)
    if (Object.keys(next).length === 0) {
      onNext({ nome, cpf, empresa, cargo })
    }
  }

  return (
    <StepLayout
      maxWidth={460}
      bg="/assets/bg-light.png"
      sx={{ backgroundColor: '#FFFFFF' }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          width: '100%',
          justifyContent: 'center',
        }}
      >

        <Box
          component="img"
          src="/assets/logo-vivatech-degrade.png"
          alt="Viva Tech"
          loading="eager"
          fetchPriority="high"
          sx={{ width: { xs: 182, sm: 58 }, mb: 3 }}
        />
      </Box>
      <Typography
        sx={{ color: colors.navy, fontWeight: 600, fontSize: { xs: 15, sm: 16 }, mb: 1.5 }}
      >
        Simule a Viva Cash na sua operação
      </Typography>
      <Typography
        sx={{ color: 'text.secondary', fontSize: { xs: 14, sm: 15 }, lineHeight: 1.55, mb: 3.5 }}
      >
        Preencha os dados abaixo e veja na prática como a antecipação de remuneração variável funcionaria para os seus colaboradores.
      </Typography>

      <FieldBlock
        label="NOME COMPLETO:"
        icon={
          <Box component="img" src="/assets/icon-person.png" alt="" sx={{ width: 18, height: 18 }} />
        }
        value={nome}
        placeholder="Fabiano Costa de Oliveira"
        error={errors.nome}
        onChange={(v) => setNome(v)}
      />
      <FieldBlock
        label="CPF:"
        icon={<BadgeOutlinedIcon sx={{ color: colors.navy }} />}
        value={cpf}
        placeholder="000.000.000-00"
        error={errors.cpf}
        onChange={(v) => setCpf(maskCPF(v))}
      />
      <FieldBlock
        label="EMPRESA:"
        icon={<ApartmentOutlinedIcon sx={{ color: colors.navy }} />}
        value={empresa}
        placeholder="ACME CORPORATION LTDA"
        error={errors.empresa}
        onChange={(v) => setEmpresa(v)}
      />
      <FieldBlock
        label="CARGO:"
        icon={<WorkOutlineOutlinedIcon sx={{ color: colors.navy }} />}
        value={cargo}
        placeholder="Diretor Financeiro"
        error={errors.cargo}
        onChange={(v) => setCargo(v)}
      />

      <Button
        onClick={handleSubmit}
        variant="contained"
        color="primary"
        size="large"
        sx={{ mt: 1, py: 1.1, alignSelf: 'center' }}
      >
        Enviar Dados
      </Button>
    </StepLayout>
  )
}
