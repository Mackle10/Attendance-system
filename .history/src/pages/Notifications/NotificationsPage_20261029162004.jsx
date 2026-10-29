import { useEffect, useState } from 'react'
import { Bell, CheckCheck, Clock } from 'lucide-react'
import styles from './NotificationsPage.module.css'
import { notificationService } from '@services/notificationService'
import { useAuth } from '@hooks/useAuth'

export default function NotificationsPage() {
      const handleMarkAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(
        (notification) => !notification.isRead
      )

      await Promise.all(
        unreadNotifications.map((notification) =>
          notificationService.markAsRead(notification.id)
        )
      )

      setNotifications((previousNotifications) =>
        previousNotifications.map((notification) => ({
          ...notification,
          isRead: true,
        }))
      )
    } catch (error) {
      console.error('Failed to mark notifications as read:', error)
      setError('Unable to mark notifications as read. Please try again.')
    }
  }
const { user } = useAuth()

const [notifications, setNotifications] = useState([])
const [loading, setLoading] = useState(true)
const [error, setError] = useState('')

useEffect(() => {
let isMounted = true

async function loadNotifications() {
  try {
    setLoading(true)
    setError('')

    const data =
      user?.role === 'admin'
        ? await notificationService.getAll()
        : user?.uid
          ? await notificationService.getByUser(user.uid)
          : []

    if (isMounted) {
      setNotifications(data)
    }
  } catch (err) {
    console.error('Failed to load notifications:', err)

    if (isMounted) {
      setError('Unable to load notifications. Please try again.')
    }
  } finally {
    if (isMounted) {
      setLoading(false)
    }
  }
}

loadNotifications()

return () => {
  isMounted = false
}

}, [user])

const unreadCount = notifications.filter(
(notification) => !notification.isRead
).length

const totalCount = notifications.length

return ( <div className={styles.page}> <div className={styles.header}> <div> <h1>Notifications</h1> <p>
Stay updated on important HR activities and employee requests. </p> </div>

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
        <h2>{loading ? '...' : totalCount}</h2>
      </div>
    </div>

    <div className={styles.summaryCard}>
      <Clock size={22} />
      <div>
        <span>Unread Notifications</span>
        <h2>{loading ? '...' : unreadCount}</h2>
      </div>
    </div>
  </div>

  <div className={styles.notificationsCard}>
    <div className={styles.cardHeader}>
      <h2>All Notifications</h2>
      <span>Recent activity and updates</span>
    </div>

    {loading ? (
      <div className={styles.emptyState}>
        <p>Loading notifications...</p>
      </div>
    ) : error ? (
      <div className={styles.emptyState}>
        <p>{error}</p>
      </div>
    ) : notifications.length === 0 ? (
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
    ) : (
      <div className={styles.notificationList}>
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={styles.notificationItem}
          >
            <div className={styles.notificationIcon}>
              <Bell size={20} />
            </div>

            <div className={styles.notificationContent}>
              <h3>{notification.title}</h3>
              <p>{notification.message}</p>
              <span>
                {notification.isRead ? 'Read' : 'Unread'}
              </span>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
</div>

)
}
