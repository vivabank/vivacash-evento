import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import StepLayout from './StepLayout'
import InfoCard from './InfoCard'
import { colors } from '../theme'
import type { StepProps } from '../types'
import { Stack } from '@mui/material'

const cards = [
  {
    icon: '/assets/icon-location.png',
    label: 'Estabelecimento',
    value: 'Cobrança Agora',
  },
  {
    icon: '/assets/icon-chart.png',
    label: 'Plano de Incentivo',
    value: 'Campanha de Recuperação de Carteira - Banco',
  },
  {
    icon: '/assets/icon-calendar.png',
    label: 'Mês de Referência:',
    value: 'Maio 2026',
  },
  {
    icon: '/assets/icon-calendar.png',
    label: 'Valor Conquistado:',
    value: 'R$ - Descubra na Viva cash',
  },
]

export default function StepResult({ onNext }: StepProps) {
  return (
    <StepLayout
      maxWidth={780}
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
        {/* <Typography
          component="h1"
          sx={{
            fontWeight: 700,
            lineHeight: 1.15,
            fontSize: { xs: 28, sm: 38 },
            color: '#000',
            mb: 2.5, ml: 1.5,
          }}
        >/</Typography> */}
        {/* <Box
          component="img"
          src="/assets/logo-cash-degrade.png"
          alt="Viva Cash"
          sx={{ width: { xs: 159, sm: 75 }, mb: 3 }}
        /> */}
      </Box>

      <Typography
        sx={{ color: colors.navy, fontWeight: 700, fontSize: { xs: 20, sm: 24 }, mb: 2.5 }}
      >
        Seu Resultado Disponível
      </Typography>

      <Typography
        sx={{ color: colors.navy, fontSize: { xs: 14.5, sm: 16 }, lineHeight: 1.55, mb: 1.5 }}
      >
        Para esta demonstração,{' '}
        <Box component="span" sx={{ fontWeight: 700 }}>
          imagine que você é um operador de cobrança.
        </Box>
      </Typography>
      <Typography
        sx={{
          color: 'text.secondary',
          fontSize: { xs: 14, sm: 15 },
          lineHeight: 1.55,
          mb: 4,
        }}
      >
        Durante o último mês, você superou suas metas de recuperação de carteira. Baseado no seu desempenho individual e nos resultados da operação, o sistema Viva Tech processou o seu bônus de performance.
      </Typography>

      <Typography
        sx={{
          color: 'text.secondary',
          fontSize: { xs: 16, sm: 15 },
          lineHeight: 1.55,
          mb: 1,
        }}
      >
        Demonstração
      </Typography>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={{ xs: 1.25, sm: 2.5 }}
        sx={{ width: '100%', mb: 4, alignItems: 'stretch' }}
      >
        {cards.map((card) => (
          <InfoCard key={card.label} {...card} />
        ))}
      </Stack>
      <Button
        onClick={onNext}
        variant="contained"
        color="primary"
        size="large"
        sx={{ py: 1.1 }}
      >
        CONTINUAR
      </Button>
    </StepLayout>
  )
}
