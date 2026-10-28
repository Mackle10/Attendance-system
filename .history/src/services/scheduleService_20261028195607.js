import {
collection,
getDocs,
addDoc,
doc,
updateDoc,
serverTimestamp,
} from 'firebase/firestore';


import { db } from '@services/firebase';

const SHIFTS_COLLECTION = 'shifts';

export const scheduleService = {
// Retrieve all saved shifts
async getAll() {
const snapshot = await getDocs(
collection(db, SHIFTS_COLLECTION)
);

return snapshot.docs.map((document) => ({
  id: document.id,
  ...document.data(),
}));

},

// Save a new shift
async create(shiftData) {
const docRef = await addDoc(
collection(db, SHIFTS_COLLECTION),
{
name: shiftData.name.trim(),
startTime: shiftData.startTime,
endTime: shiftData.endTime,
workingDays: shiftData.workingDays,
createdAt: serverTimestamp(),
}
);

return {
  id: docRef.id,
  ...shiftData,
};

},
// Update an existing shift
async update(shiftId, shiftData) {
const shiftRef = doc(db, SHIFTS_COLLECTION, shiftId);

const updatedData = {
  name: shiftData.name.trim(),
  startTime: shiftData.startTime,
  endTime: shiftData.endTime,
  workingDays: shiftData.workingDays,
  updatedAt: serverTimestamp(),
};

await updateDoc(shiftRef, updatedData);

return {
  id: shiftId,
  ...shiftData,
};

},

};
