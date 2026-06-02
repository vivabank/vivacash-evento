import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import StepLayout from './StepLayout'
import { colors } from '../theme'
import type { StepProps } from '../types'

export default function StepHero({ onNext }: StepProps) {
  return (
    <StepLayout
      bg="/assets/bg-hero-blue.png"
      sx={{ backgroundColor: colors.blue }}
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
          src="/assets/logo-white-vivatech.png"
          alt="Viva Tech"
          loading="eager"
          fetchPriority="high"
          sx={{ width: { xs: 182, sm: 58 }, mb: 3 }}
        />
      </Box>
      <Typography
        component="h1"
        sx={{
          fontWeight: 700,
          lineHeight: 1.15,
          fontSize: { xs: 16, sm: 38 },
          mb: 2.5,
        }}
      >
        <Box component="span" sx={{ color: '#FFFFFF' }}>
         Sua equipe performa mais quando entende o que ganha
        </Box>
      </Typography>

      <Box
        sx={{
          width: 90,
          height: 2,
          bgcolor: 'rgba(255,255,255,0.35)',
          mb: 3.5,
        }}
      />

      <Typography

        sx={{
          color: 'rgba(255,255,255,0.88)',
          fontWeight: 300,
          fontSize: { xs: 17, sm: 16 },
          lineHeight: 1.6,
          mb: 2.5,
        }}
      >
        A <b>Viva Tech</b> é uma plataforma de gestão de remuneração variável que conecta desempenho, transparência e engajamento. Com ela, sua empresa configura regras, acompanha resultados e garante que cada colaborador entenda exatamente como sua remuneração é calculada, em tempo real. 
      </Typography>

      <Typography
        component="h1"
        sx={{
          fontWeight: 700,
          lineHeight: 1.15,
          fontSize: { xs: 16, sm: 38 },
          mb: 2.5,
        }}
      >
        <Box component="span" sx={{ color: '#FFFFFF' }}>
          Agora, o desempenho vira liquidez para o colaborador
        </Box>
      </Typography>
      <Box
        sx={{
          width: 90,
          height: 2,
          bgcolor: 'rgba(255,255,255,0.35)',
          mb: 3.5,
        }}
      />
      <Typography
        sx={{
          color: 'rgba(255,255,255,0.88)',
          fontWeight: 300,
          fontSize: { xs: 17, sm: 16 },
          lineHeight: 1.6,
          mb: 2.5,
        }}
      >
        A <b>Viva Cash</b> é o braço financeiro da Viva Tech. Com ela, seus colaboradores podem antecipar a remuneração variável que já conquistaram, sem burocracia e sem custo para a empresa. É um benefício real, disponível dentro da mesma plataforma que sua equipe já usa todos os dias.
      </Typography>
      <Button
        onClick={onNext}
        variant="outlined"
        size="large"
        sx={{
          mt: 1.5,
          color: '#FFFFFF',
          borderColor: 'rgba(255,255,255,0.7)',
          borderRadius: 999,
          py: 1.1,
          '&:hover': {
            borderColor: '#FFFFFF',
            bgcolor: 'rgba(255,255,255,0.12)',
          },
        }}
      >
        Experimentar
      </Button>
    </StepLayout>
  )
}
