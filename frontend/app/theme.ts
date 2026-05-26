'use client'

import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#209dd7' },
    secondary: { main: '#753991' },
    warning: { main: '#ecad0a' },
    background: {
      default: '#010f20',
      paper: '#032147',
    },
    text: {
      secondary: '#888888',
    },
  },
  typography: {
    fontFamily: 'inherit',
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
      },
    },
  },
})
