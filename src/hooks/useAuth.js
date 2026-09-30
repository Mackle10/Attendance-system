import { useContext } from 'react'
import { AuthContext } from '@context/AuthContext'

/**
 * useAuth – convenience hook to access AuthContext.
 * Must be used inside <AuthProvider>.
 *
 * @returns {{ user, token, isAuthenticated, isLoading, login, logout, updateUser }}
 */
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
