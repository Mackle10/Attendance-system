import {
collection,
getDocs,
doc,
getDoc,
addDoc,
updateDoc,
serverTimestamp,
} from 'firebase/firestore';

import { db } from '@services/firebase';

export const employeeService = {
// Retrieve all employees
async getAll() {
const snapshot = await getDocs(collection(db, 'employees'));

return snapshot.docs.map((document) => ({
  id: document.id,
  ...document.data(),
}));

},

// Retrieve one employee
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

// Create a new employee
async create(employeeData) {
const employeeRef = await addDoc(collection(db, 'employees'), {
...employeeData,
createdAt: serverTimestamp(),
});

return {
  id: employeeRef.id,
  ...employeeData,
};

},

// Update an existing employee
async update(employeeId, employeeData) {
const employeeRef = doc(db, 'employees', employeeId);

await updateDoc(employeeRef, {
  ...employeeData,
  updatedAt: serverTimestamp(),
});

return {
  id: employeeId,
  ...employeeData,
};

},
};