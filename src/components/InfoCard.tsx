import { Box, Card, Stack, Typography } from '@mui/material'

const InfoCard = ({ icon, label, value }: { icon: string; label: string; value: string }) => {
  return (
    <Card
      elevation={0}
      sx={{
        flex: 1,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: { xs: 2, sm: 2 },
        p: { xs: 2, sm: 2.5 },
        borderRadius: 2.5,
        bgcolor: '#FFFFFF',
        border: '1px solid rgba(15, 23, 42, 0.06)',
        boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04)',
        transition: 'transform 200ms ease, box-shadow 200ms ease, border-color 200ms ease',

        // No desktop: empilha vertical pra ter visual de "card" tradicional
        flexDirection: { xs: 'row', sm: 'column' },
        textAlign: { xs: 'left', sm: 'center' },

        '&:hover': {
          transform: 'translateY(-2px)',
          borderColor: 'rgba(15, 23, 42, 0.1)',
          boxShadow: '0 8px 20px rgba(15, 23, 42, 0.06)',
        },
      }}
    >
      {/* Badge do ícone */}
      <Box
        sx={{
          flexShrink: 0,
          width: { xs: 44, sm: 52 },
          height: { xs: 44, sm: 52 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
          bgcolor: 'rgba(20, 184, 166, 0.08)',
          mb: { xs: 0, sm: 1.5 },
        }}
      >
        <Box
          component="img"
          src={icon}
          alt=""
          sx={{
            width: { xs: 22, sm: 26 },
            height: { xs: 22, sm: 26 },
            objectFit: 'contain',
          }}
        />
      </Box>

      {/* Textos */}
      <Stack spacing={0.5} sx={{ minWidth: 0, flex: 1 }}>
        <Typography
          component="p"
          sx={{
            fontSize: '0.6875rem',
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'text.secondary',
            lineHeight: 1.2,
          }}
        >
          {label.replace(':', '')}
        </Typography>
        <Typography
          component="p"
          sx={{
            fontSize: { xs: '0.9375rem', sm: '1rem' },
            fontWeight: 700,
            lineHeight: 1.3,
            color: 'text.primary',
            letterSpacing: '-0.01em',
          }}
        >
          {value}
        </Typography>
      </Stack>
    </Card>
  )
}

export default InfoCard