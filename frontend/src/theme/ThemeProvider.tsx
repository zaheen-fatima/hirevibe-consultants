import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { CssBaseline, ThemeProvider as MuiThemeProvider } from '@mui/material';
import { buildTheme } from './theme';

type ThemeMode = 'light' | 'dark';
type ThemeContextValue = { mode: ThemeMode; toggleMode: () => void; setMode: (mode: ThemeMode) => void };

const STORAGE_KEY = 'hirevibe.theme.mode';
const ThemeContext = createContext<ThemeContextValue | null>(null);

function readMode(): ThemeMode {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'dark' ? 'dark' : 'light';
  } catch {
    return 'dark';
  }
}

export function AppThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>(readMode);
  const theme = useMemo(() => buildTheme(mode), [mode]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, mode);
    document.documentElement.dataset.theme = mode;
  }, [mode]);

  const value = useMemo(
    () => ({ mode, setMode, toggleMode: () => setMode((value) => (value === 'dark' ? 'light' : 'dark')) }),
    [mode],
  );

  return (
    <ThemeContext.Provider value={value}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}

export function useAppTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useAppTheme must be used inside AppThemeProvider');
  return context;
}
