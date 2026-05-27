import { createTheme } from '@mui/material/styles'

export const colors = {
  navy: '#0B2A4A',
  navyDark: '#071B30',
  teal: '#00B58C',
  tealDark: '#009B78',
  blue: '#1F6FE0',
  cyan: '#27CDEC',
}

const theme = createTheme({
  palette: {
    primary: { main: colors.navy, dark: colors.navyDark, contrastText: '#FFFFFF' },
    secondary: { main: colors.teal, dark: colors.tealDark, contrastText: '#FFFFFF' },
    text: { primary: colors.navy, secondary: '#42566B' },
  },
  typography: {
    fontFamily: '"Barlow", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    button: { fontWeight: 600, letterSpacing: '0.08em' },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { textTransform: 'uppercase', borderRadius: 8, paddingInline: 32 },
      },
    },
  },
})

export default theme
