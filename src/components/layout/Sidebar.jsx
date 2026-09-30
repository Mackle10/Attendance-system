import { NavLink, useLocation } from 'react-router-dom'
import { NAV_ITEMS, APP_NAME } from '@utils/constants'
import styles from './Sidebar.module.css'

/**
 * Sidebar – main navigation panel.
 * TODO: Add collapse/expand functionality, role-based nav filtering.
 */
export default function Sidebar() {
  const location = useLocation()

  return (
    <aside className={styles.sidebar} aria-label="Main navigation">
      {/* ── Logo / Brand ─────────────────────────────────── */}
      <div className={styles.brand}>
        <div className={styles.brandIcon} aria-hidden="true">A</div>
        <span className={styles.brandName}>{APP_NAME}</span>
      </div>

      {/* ── Navigation ───────────────────────────────────── */}
      <nav className={styles.nav}>
        <ul className={styles.navList} role="list">
          {NAV_ITEMS.map(item => (
            <li key={item.id}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
                }
                aria-current={location.pathname.startsWith(item.path) ? 'page' : undefined}
              >
                <span className={styles.navIcon} aria-hidden="true">
                  {/* TODO: Replace with actual icon component (e.g. lucide-react) */}
                  {item.icon[0].toUpperCase()}
                </span>
                <span className={styles.navLabel}>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* ── Footer ───────────────────────────────────────── */}
      <div className={styles.sidebarFooter}>
        <span className={styles.version}>v1.0.0</span>
      </div>
    </aside>
  )
}
