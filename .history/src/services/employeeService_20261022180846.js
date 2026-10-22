
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@services/firebase';

export const employeeService = {
  async getAll() {
    const employeesRef = collection(db, 'employees');
    const snapshot = await getDocs(employeesRef);

    return snapshot.docs.map((document) => ({
      id: document.id,
      ...document.data(),
    }));
  },
};