
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@services/firebase';

export const employeeService = {
  async getAll() {
    const usersRef = collection(db, 'users');
    const snapshot = await getDocs(usersRef);

    return snapshot.docs.map((document) => ({
      id: document.id,
      ...document.data(),
    }));
  },
};