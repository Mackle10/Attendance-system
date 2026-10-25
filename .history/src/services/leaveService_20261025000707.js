import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';

import { db } from '@services/firebase';

const leaveCollection = collection(db, 'leaveRequests');

export const leaveService = {
  // Retrieve all leave requests
  async getRequests() {
    const snapshot = await getDocs(
      query(leaveCollection, orderBy('createdAt', 'desc'))
    );

    return snapshot.docs.map((document) => ({
      id: document.id,
      ...document.data(),
    }));
  },

  // Submit a new leave request
  async createRequest(data) {
    const requestData = {
      ...data,
      status: 'Pending',
      createdAt: serverTimestamp(),
    };

    const requestRef = await addDoc(leaveCollection, requestData);

    return {
      id: requestRef.id,
      ...requestData,
    };
  },

  // Approve a leave request
  async approve(id) {
    await updateDoc(doc(db, 'leaveRequests', id), {
      status: 'Approved',
      reviewedAt: serverTimestamp(),
    });

    return true;
  },

  // Reject a leave request
  async reject(id, reason = '') {
    await updateDoc(doc(db, 'leaveRequests', id), {
      status: 'Rejected',
      rejectionReason: reason,
      reviewedAt: serverTimestamp(),
    });

    return true;
  },
};

