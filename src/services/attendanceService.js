import {
  collection,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { db } from '@services/firebase';

export const attendanceService = {
  async getDaily(date) {
    const attendanceRef = collection(db, 'attendance');
    const dailyQuery = query(
      attendanceRef,
      where('date', '==', date),
    );

    const snapshot = await getDocs(dailyQuery);

    return snapshot.docs.map((document) => ({
      id: document.id,
      ...document.data(),
    }));
  },
};