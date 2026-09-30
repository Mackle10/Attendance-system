import { useContext } from 'react'
import { ThemeContext } from '@context/ThemeContext'

/**
 * useTheme – convenience hook to access ThemeContext.
 * Must be used inside <ThemeProvider>.
 *
 * @returns {{ theme, isDark, toggleTheme, setTheme }}
 */
export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
