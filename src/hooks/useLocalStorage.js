import { useState, useEffect } from 'react'

/**
 * useLocalStorage – syncs state with localStorage.
 * @param {string} key       - localStorage key
 * @param {*}      initialValue - default value if key doesn't exist
 * @returns {[value, setValue]}
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch {
      return initialValue
    }
  })

  // Listen for changes across tabs
  useEffect(() => {
    const handler = (e) => {
      if (e.key === key) {
        try {
          setStoredValue(e.newValue ? JSON.parse(e.newValue) : initialValue)
        } catch {
          setStoredValue(initialValue)
        }
      }
    }
    window.addEventListener('storage', handler)
    return () => window.removeEventListener('storage', handler)
  }, [key, initialValue])

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn(`useLocalStorage: failed to set "${key}"`, error)
    }
  }

  return [storedValue, setValue]
}
