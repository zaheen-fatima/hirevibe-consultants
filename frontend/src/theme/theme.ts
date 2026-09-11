import { createTheme, type PaletteMode } from '@mui/material/styles';

const NAVY = '#102A43';
const NAVY_DARK = '#081522';
const GREEN = '#167A4B';
const GREEN_LIGHT = '#49B47A';
const WARM_ACCENT = '#B89A63';

export function buildTheme(mode: PaletteMode) {
  const dark = mode === 'dark';

  return createTheme({
    palette: {
      mode,
      primary: { main: dark ? GREEN_LIGHT : NAVY, contrastText: '#FFFFFF' },
      secondary: { main: dark ? '#8ED9AF' : GREEN },
      background: { default: dark ? '#06090D' : '#FAFAF8', paper: dark ? '#0D1117' : '#FFFFFF' },
      text: { primary: dark ? '#F4F4F0' : '#111827', secondary: dark ? '#AAB3BF' : '#5D6877' },
      divider: dark ? 'rgba(255,255,255,.10)' : 'rgba(16,42,67,.13)',
    },
    shape: { borderRadius: 16 },
    typography: {
      fontFamily: '"Manrope", "DM Sans", Inter, ui-sans-serif, system-ui, sans-serif',
      h1: { fontWeight: 500, letterSpacing: '-.045em' },
      h2: { fontWeight: 500, letterSpacing: '-.035em' },
      h3: { fontWeight: 500, letterSpacing: '-.025em' },
      h4: { fontWeight: 500, letterSpacing: '-.018em' },
      h5: { fontWeight: 500, letterSpacing: '-.012em' },
      h6: { fontWeight: 500, letterSpacing: '-.008em' },
      body1: { lineHeight: 1.75 },
      body2: { lineHeight: 1.7 },
      button: { textTransform: 'none', fontWeight: 500, letterSpacing: '0' },
    },
    components: {
      MuiCssBaseline: { styleOverrides: { html: { scrollBehavior: 'smooth' }, body: { margin: 0, minWidth: 320 }, '*': { boxSizing: 'border-box' }, '::selection': { backgroundColor: dark ? 'rgba(73,180,122,.25)' : 'rgba(22,122,75,.15)' } } },
      MuiButton: { defaultProps: { disableElevation: true } },
      MuiTextField: { defaultProps: { variant: 'outlined', size: 'small' } },
      MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
      MuiOutlinedInput: { styleOverrides: { root: { borderRadius: 12, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: dark ? GREEN_LIGHT : NAVY }, '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderWidth: 1, borderColor: dark ? GREEN_LIGHT : NAVY } } } },
      MuiChip: { styleOverrides: { root: { borderRadius: 999 } } },
    },
  });
}
