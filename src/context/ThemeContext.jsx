/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';

const ThemeContext = createContext({
  theme: 'command-dark',
  toggleTheme: () => {},
  setTheme: () => {},
  isDark: true,
  isWarm: false
});

export const THEMES = {
  COMMAND_DARK: 'command-dark',
  TEXTBOOK_WARM: 'textbook-warm'
};

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState(() => {
    const saved = localStorage.getItem('tt_theme_preference');
    return saved === THEMES.TEXTBOOK_WARM ? THEMES.TEXTBOOK_WARM : THEMES.COMMAND_DARK;
  });

  useEffect(() => {
    localStorage.setItem('tt_theme_preference', theme);
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    if (theme === THEMES.TEXTBOOK_WARM) {
      root.classList.add('textbook-warm');
      root.classList.remove('command-dark');
      document.body.style.backgroundColor = '#fafaf9'; // stone-50
      document.body.style.color = '#1c1917'; // stone-900
    } else {
      root.classList.add('command-dark');
      root.classList.remove('textbook-warm');
      document.body.style.backgroundColor = '#09090b';
      document.body.style.color = '#f4f4f5';
    }
  }, [theme]);

  const toggleTheme = () => {
    setThemeState(prev => (prev === THEMES.COMMAND_DARK ? THEMES.TEXTBOOK_WARM : THEMES.COMMAND_DARK));
  };

  const isDark = theme === THEMES.COMMAND_DARK;
  const isWarm = theme === THEMES.TEXTBOOK_WARM;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme: setThemeState, isDark, isWarm }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

/**
 * Minimalist, high-end Theme Switcher Pill
 */
export const ThemeToggle = ({ className = '' }) => {
  const { toggleTheme, isDark } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      title={isDark ? "Switch to Textbook Warm (Scholastic Light)" : "Switch to Command Dark (Linear Dark)"}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-mono transition-all border cursor-pointer select-none ${
        isDark
          ? 'bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 border-zinc-700 hover:border-zinc-600'
          : 'bg-stone-100 hover:bg-stone-200 text-stone-800 border-stone-300 hover:border-stone-400'
      } ${className}`}
    >
      {isDark ? (
        <>
          <Moon className="w-3 h-3 text-zinc-400" />
          <span className="hidden sm:inline">Command Dark</span>
        </>
      ) : (
        <>
          <Sun className="w-3 h-3 text-amber-600" />
          <span className="hidden sm:inline">Textbook Warm</span>
        </>
      )}
    </button>
  );
};

export default ThemeContext;
