import {
collection,
addDoc,
getDocs,
doc,
query,
where,
orderBy,
updateDoc,
deleteDoc,
serverTimestamp,
} from 'firebase/firestore'


import { db } from '@services/firebase'

const NOTIFICATIONS_COLLECTION = 'notifications'

const notificationService = {
// Retrieve notifications for a specific user
async getByUser(userId) {
const notificationsRef = collection(
db,
NOTIFICATIONS_COLLECTION
)

const notificationsQuery = query(
  notificationsRef,
  where('userId', '==', userId),
  orderBy('createdAt', 'desc')
)

const snapshot = await getDocs(notificationsQuery)

return snapshot.docs.map((document) => ({
  id: document.id,
  ...document.data(),
}))

},

// Retrieve all notifications (for administrators)
async getAll() {
const notificationsRef = collection(
db,
NOTIFICATIONS_COLLECTION
)

const notificationsQuery = query(
  notificationsRef,
  orderBy('createdAt', 'desc')
)

const snapshot = await getDocs(notificationsQuery)

return snapshot.docs.map((document) => ({
  id: document.id,
  ...document.data(),
}))

},

// Create a notification
async create(notificationData) {
const notificationRef = await addDoc(
collection(db, NOTIFICATIONS_COLLECTION),
{
userId: notificationData.userId || null,
title: notificationData.title,
message: notificationData.message,
type: notificationData.type || 'info',
isRead: false,
createdAt: serverTimestamp(),
}
)

return {
  id: notificationRef.id,
  ...notificationData,
  isRead: false,
}

},

// Mark one notification as read
async markAsRead(notificationId) {
await updateDoc(
doc(db, NOTIFICATIONS_COLLECTION, notificationId),
{
isRead: true,
updatedAt: serverTimestamp(),
}
)
},

// Mark all notifications for a user as read
async markAllAsRead(userId) {
const notifications = await this.getByUser(userId)

const unreadNotifications = notifications.filter(
  (notification) => !notification.isRead
)

await Promise.all(
  unreadNotifications.map((notification) =>
    this.markAsRead(notification.id)
  )
)

},

// Delete one notification
async delete(notificationId) {
await deleteDoc(
doc(db, NOTIFICATIONS_COLLECTION, notificationId)
)
},
}
export { notificationService }