import { createTheme } from '@mui/material';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1E3A8A'
    },
    secondary: {
      main: '#D97706'
    },
    background: {
      default: '#F4F1EC',
      paper: '#FFFFFF'
    },
    text: {
      primary: '#141414',
      secondary: '#4B5563'
    }
  },
  typography: {
    fontFamily: '"Sora", system-ui, -apple-system, Segoe UI, sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 600 }
  },
  shape: {
    borderRadius: 14
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          border: '1px solid rgba(15, 23, 42, 0.06)'
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600
        }
      }
    }
  }
});


