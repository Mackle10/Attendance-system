import { Bell, CheckCheck, Clock } from 'lucide-react'
import styles from './NotificationsPage.module.css'

export default function NotificationsPage() {
return ( <div className={styles.page}> <div className={styles.header}> <div> <h1>Notifications</h1> <p>Stay updated on important HR activities and employee requests.</p> </div>

    <button type="button" className={styles.markAllButton}>
      <CheckCheck size={18} />
      Mark all as read
    </button>
  </div>

  <div className={styles.summary}>
    <div className={styles.summaryCard}>
      <Bell size={22} />
      <div>
        <span>Total Notifications</span>
        <h2>0</h2>
      </div>
    </div>

    <div className={styles.summaryCard}>
      <Clock size={22} />
      <div>
        <span>Unread Notifications</span>
        <h2>0</h2>
      </div>
    </div>
  </div>

  <div className={styles.notificationsCard}>
    <div className={styles.cardHeader}>
      <h2>All Notifications</h2>
      <span>Recent activity and updates</span>
    </div>

    <div className={styles.emptyState}>
      <div className={styles.emptyIcon}>
        <Bell size={28} />
      </div>

      <h3>No notifications yet</h3>

      <p>
        When there are new HR updates, employee requests, or important
        reminders, they will appear here.
      </p>
    </div>
  </div>
</div>

)
}
