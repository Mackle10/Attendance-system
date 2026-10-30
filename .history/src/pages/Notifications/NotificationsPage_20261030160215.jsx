import { useEffect, useState } from 'react'
import { Bell, CheckCheck, Clock } from 'lucide-react'
import { employeeService } from '../../services/employeeService.js'
import styles from './NotificationsPage.module.css'
import { notificationService } from '../../services/notificationService.js'
import { useAuth } from '@hooks/useAuth'

export default function NotificationsPage() {
const { user } = useAuth()

const [notifications, setNotifications] = useState([])
const [employees, setEmployees] = useState([])
const [loadingEmployees, setLoadingEmployees] = useState(false)
const [loading, setLoading] = useState(true)
const [error, setError] = useState('')
const [showCreateForm, setShowCreateForm] = useState(false)
const [newTitle, setNewTitle] = useState('')
const [newMessage, setNewMessage] = useState('')
const [recipientId, setRecipientId] = useState('')
const [saving, setSaving] = useState(false)
const [successMessage, setSuccessMessage] = useState('')
useEffect(() => {
  if (user?.role !== 'admin' || !showCreateForm) {
    return
  }

  async function loadEmployees() {
    try {
      setLoadingEmployees(true)

      const data = await employeeService.getAll()
      setEmployees(data)
    } catch (err) {
      console.error('Failed to load employees:', err)
      setError('Unable to load employees. Please try again.')
    } finally {
      setLoadingEmployees(false)
    }
  }

  loadEmployees()
}, [user, showCreateForm])

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

async function handleMarkAllAsRead() {
try {
setError('')

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
} catch (err) {
  console.error('Failed to mark notifications as read:', err)
  setError('Unable to mark notifications as read. Please try again.')
}

}

return ( <div className={styles.page}> <div className={styles.header}>
  <div>
    <h1>Notifications</h1>
    <p>
      Stay updated on important HR activities and employee requests.
    </p>
  </div>

  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
    {user?.role === 'admin' && (
      <button
        type="button"
        className={styles.markAllButton}
        onClick={() => {
          setShowCreateForm((previous) => !previous)
          setSuccessMessage('')
          setError('')
        }}
      >
        + Create Notification
      </button>
    )}

<button
  type="button"
  className={styles.markAllButton}
  onClick={handleMarkAllAsRead}
  disabled={loading || unreadCount === 0}
>
  <CheckCheck size={18} />
  Mark all as read
</button>

  </div>
</div>


{showCreateForm && user?.role === 'admin' && (

  <div className={styles.notificationsCard} style={{ marginBottom: '24px' }}>
    <div className={styles.cardHeader}>
      <h2>Create Notification</h2>
      <span>Send an update to an employee</span>
    </div>

<form
  onSubmit={(event) => {
    event.preventDefault()
    // We'll connect the form to Firestore in the next step.
  }}
  style={{ padding: '24px' }}
>
  <div style={{ marginBottom: '16px' }}>
    <label htmlFor="notificationTitle">Notification Title</label>
    <input
      id="notificationTitle"
      type="text"
      value={newTitle}
      onChange={(event) => setNewTitle(event.target.value)}
      placeholder="e.g. Staff Meeting Reminder"
      required
      style={{
        display: 'block',
        width: '100%',
        padding: '12px',
        marginTop: '8px',
        boxSizing: 'border-box',
      }}
    />
  </div>

  <div style={{ marginBottom: '16px' }}>
    <label htmlFor="notificationMessage">Message</label>
    <textarea
      id="notificationMessage"
      value={newMessage}
      onChange={(event) => setNewMessage(event.target.value)}
      placeholder="Write your notification here..."
      required
      rows={4}
      style={{
        display: 'block',
        width: '100%',
        padding: '12px',
        marginTop: '8px',
        boxSizing: 'border-box',
        resize: 'vertical',
      }}
    />
  </div>

  <div style={{ marginBottom: '20px' }}>
    <label htmlFor="notificationRecipient">Recipient</label>
    <select
  id="notificationRecipient"
  value={recipientId}
  onChange={(event) => setRecipientId(event.target.value)}
  required
  style={{
    display: 'block',
    width: '100%',
    padding: '12px',
    marginTop: '8px',
  }}
>
  <option value="">
    {loadingEmployees ? 'Loading employees...' : 'Select an employee'}
  </option>

  {employees.map((employee) => (
    <option key={employee.id} value={employee.id}>
      {employee.firstName} {employee.lastName}
    </option>
  ))}
</select>
  </div>

  {successMessage && (
    <p style={{ color: 'green' }}>{successMessage}</p>
  )}

  {error && <p role="alert">{error}</p>}

  <button
    type="submit"
    className={styles.markAllButton}
    disabled={saving}
  >
    {saving ? 'Sending...' : 'Send Notification'}
  </button>
</form>

  </div>
)}

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
