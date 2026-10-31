import {
  collection,
  addDoc,
  getDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore';

import { db } from '@services/firebase';

const INVITATIONS_COLLECTION = 'employeeInvitations';

export const invitationService = {
  // Create an invitation for an employee
  async create(employeeId, email) {
    const invitationRef = await addDoc(
      collection(db, INVITATIONS_COLLECTION),
      {
        employeeId,
        email: email.trim().toLowerCase(),
        status: 'Pending',
        createdAt: serverTimestamp(),
      },
    );

    return invitationRef.id;
  },

  // Retrieve one invitation by its unique ID
  async getById(invitationId) {
    const invitationRef = doc(
      db,
      INVITATIONS_COLLECTION,
      invitationId,
    );

    const snapshot = await getDoc(invitationRef);

    if (!snapshot.exists()) {
      return null;
    }

    return {
      id: snapshot.id,
      ...snapshot.data(),
    };
  },
};