import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import styles from './AppShell.module.css'

/**
 * AppShell – main layout wrapper for authenticated pages.
 * Renders: Sidebar (left) + main area (Navbar on top + page content via <Outlet>)
 */
export default function AppShell() {
  return (
    <div className={styles.shell}>
      <Sidebar />
      <div className={styles.main}>
        <Navbar />
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
