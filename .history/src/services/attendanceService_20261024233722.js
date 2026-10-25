
import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore';

import { db } from '@services/firebase';

const attendanceCollection = collection(db, 'attendance');

export const attendanceService = {
  // Retrieve attendance records for a specific date.
  async getDaily(date) {
    const dailyQuery = query(
      attendanceCollection,
      where('date', '==', date),
    );

    const snapshot = await getDocs(dailyQuery);

    return snapshot.docs.map((document) => ({
      id: document.id,
      ...document.data(),
    }));
  },

  // Record an employee clock-in.
  async clockIn(employee) {
    const date = new Date().toLocaleDateString('en-CA', {
      timeZone: 'Africa/Kampala',
    });

    const existingRecords = await this.getDaily(date);

    const alreadyClockedIn = existingRecords.some(
      (record) => record.employeeId === employee.id,
    );

    if (alreadyClockedIn) {
      throw new Error('This employee already has an attendance record today.');
    }

    const now = new Date();

    const attendanceData = {
      employeeId: employee.id,
      employeeNumber: employee.employeeNumber || '',
      employeeName: employee.fullName || employee.name || '',
      department: employee.department || '',
      branch: employee.branch || '',
      date,
      clockIn: now.toISOString(),
      clockOut: null,
      status: 'Present',
      createdAt: serverTimestamp(),
    };

    const attendanceRef = await addDoc(
      attendanceCollection,
      attendanceData,
    );

    return {
      id: attendanceRef.id,
      ...attendanceData,
    };
  },

  // Record an employee clock-out.
  async clockOut(attendanceId) {
    const attendanceRef = doc(db, 'attendance', attendanceId);

    const now = new Date();

    await updateDoc(attendanceRef, {
      clockOut: now.toISOString(),
      updatedAt: serverTimestamp(),
    });

    return true;
  },
};
