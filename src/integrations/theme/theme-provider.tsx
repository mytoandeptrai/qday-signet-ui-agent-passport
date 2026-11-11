import { useEffect, useState } from 'react';
import { type Theme, ThemeProviderContext } from './theme-context';
import { useSystemColorScheme } from './use-system-color-scheme';

/** Browser chrome colour per theme: the v5 ground colours (trellis-teal.900, neutral.50). */
const THEME_COLOR = { dark: '#06343a', light: '#f4f7f8' };
const THEME_TRANSITION_CLASS = 'theme-transition';
const THEME_TRANSITION_MS = 250;
let transitionTimer: number | undefined;

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

export function ThemeProvider({
  children,
  defaultTheme = 'light',
  storageKey = 'trellis-theme-v5',
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem(storageKey) as Theme) || defaultTheme);
  const systemColorScheme = useSystemColorScheme();

  useEffect(() => {
    const root = window.document.documentElement;

    const resolved = theme === 'system' ? systemColorScheme : theme;

    root.classList.remove('light', 'dark');
    root.classList.add(resolved);
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLOR[resolved]);
  }, [theme, systemColorScheme]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      const root = window.document.documentElement;
      root.classList.add(THEME_TRANSITION_CLASS);
      window.clearTimeout(transitionTimer);
      transitionTimer = window.setTimeout(() => root.classList.remove(THEME_TRANSITION_CLASS), THEME_TRANSITION_MS);

      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}
