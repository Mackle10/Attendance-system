
import {
  collection,
  getDocs,
  doc,
  getDoc,
} from 'firebase/firestore';

import { db } from '@services/firebase';

export const employeeService = {
  async getAll() {
    const snapshot = await getDocs(collection(db, 'employees'));

    return snapshot.docs.map((document) => ({
      id: document.id,
      ...document.data(),
    }));
  },

  async getById(employeeId) {
    const employeeRef = doc(db, 'employees', employeeId);
    const snapshot = await getDoc(employeeRef);

    if (!snapshot.exists()) {
      return null;
    }

    return {
      id: snapshot.id,
      ...snapshot.data(),
    };
  },
};