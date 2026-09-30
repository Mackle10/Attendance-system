import { useAuth } from '@hooks/useAuth'
import { useTheme } from '@hooks/useTheme'
import { getInitials } from '@utils/formatters'
import { APP_NAME } from '@utils/constants'
import styles from './Navbar.module.css'

/**
 * Navbar – top bar shown on all authenticated pages.
 * Contains: page breadcrumb area, theme toggle, notifications, user menu.
 * TODO: Add notification dropdown, user profile dropdown.
 */
export default function Navbar() {
  const { user, logout } = useAuth()
  const { isDark, toggleTheme } = useTheme()

  return (
    <header className={styles.navbar} role="banner">
      {/* ── Left: App name / breadcrumb placeholder ─── */}
      <div className={styles.left}>
        <span className={styles.appLabel}>{APP_NAME}</span>
      </div>

      {/* ── Right: Controls ───────────────────────────── */}
      <div className={styles.right}>
        {/* Theme Toggle */}
        <button
          id="theme-toggle-btn"
          className={styles.iconBtn}
          onClick={toggleTheme}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          title={isDark ? 'Light mode' : 'Dark mode'}
        >
          {isDark ? '☀️' : '🌙'}
        </button>

        {/* Notifications placeholder */}
        <button
          id="notifications-btn"
          className={styles.iconBtn}
          aria-label="Notifications"
          title="Notifications"
        >
          🔔
        </button>

        {/* User Avatar / Menu */}
        <div className={styles.userMenu}>
          <div className={styles.avatar} aria-label={`Logged in as ${user?.name}`}>
            {user?.avatar
              ? <img src={user.avatar} alt={user.name} className={styles.avatarImg} />
              : <span>{getInitials(user?.name ?? 'User')}</span>
            }
          </div>
          <div className={styles.userInfo}>
            <span className={styles.userName}>{user?.name ?? 'User'}</span>
            <span className={styles.userRole}>{user?.role ?? 'Employee'}</span>
          </div>
          <button
            id="logout-btn"
            className={styles.logoutBtn}
            onClick={logout}
            aria-label="Log out"
            title="Log out"
          >
            ↩
          </button>
        </div>
      </div>
    </header>
  )
}
