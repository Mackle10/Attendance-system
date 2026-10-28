import {
collection,
getDocs,
addDoc,
query,
where,
serverTimestamp,
deleteDoc,
doc,
updateDoc,
} from 'firebase/firestore'

import { db } from '@services/firebase'

const ASSIGNMENTS_COLLECTION = 'shiftAssignments'

export const shiftAssignmentService = {
// Retrieve all employee shift assignments
async getAll() {
const snapshot = await getDocs(
collection(db, ASSIGNMENTS_COLLECTION)
)

return snapshot.docs.map((document) => ({
  id: document.id,
  ...document.data(),
}))

},

// Check whether an employee is already assigned to a shift
async findByEmployeeAndShift(employeeId, shiftId) {
const assignmentsRef = collection(db, ASSIGNMENTS_COLLECTION)

const assignmentsQuery = query(
  assignmentsRef,
  where('employeeId', '==', employeeId),
  where('shiftId', '==', shiftId)
)

const snapshot = await getDocs(assignmentsQuery)

return snapshot.docs.map((document) => ({
  id: document.id,
  ...document.data(),
}))

},

// Create an employee shift assignment
async create(assignmentData) {
const existingAssignments = await this.findByEmployeeAndShift(
assignmentData.employeeId,
assignmentData.shiftId
)


if (existingAssignments.length > 0) {
  throw new Error('This employee is already assigned to this shift.')
}

const docRef = await addDoc(
  collection(db, ASSIGNMENTS_COLLECTION),
  {
    employeeId: assignmentData.employeeId,
    employeeName: assignmentData.employeeName,
    employeeNumber: assignmentData.employeeNumber,
    shiftId: assignmentData.shiftId,
    shiftName: assignmentData.shiftName,
    createdAt: serverTimestamp(),
  }
)

return {
  id: docRef.id,
  ...assignmentData,
}

},

// Update an employee's shift assignment
async update(assignmentId, assignmentData) {
const existingAssignment = await this.findByEmployeeAndShift(
assignmentData.employeeId,
assignmentData.shiftId
)

if (existingAssignment && existingAssignment.id !== assignmentId) {
throw new Error(
'This employee is already assigned to this shift.'
)
}

await updateDoc(
doc(db, ASSIGNMENTS_COLLECTION, assignmentId),
{
employeeId: assignmentData.employeeId,
employeeName: assignmentData.employeeName,
employeeNumber: assignmentData.employeeNumber,
shiftId: assignmentData.shiftId,
shiftName: assignmentData.shiftName,
updatedAt: serverTimestamp(),
}
)

return {
id: assignmentId,
...assignmentData,
}
},

// Remove an employee shift assignment
async remove(assignmentId) {
await deleteDoc(
doc(db, ASSIGNMENTS_COLLECTION, assignmentId)
)
},
// Update the name of a shift in all employee assignments
async updateShiftName(shiftId, shiftName) {
  const assignments = await this.getAll()

  const matchingAssignments = assignments.filter(
    (assignment) => assignment.shiftId === shiftId
  )

  await Promise.all(
    matchingAssignments.map((assignment) =>
      updateDoc(
        doc(db, ASSIGNMENTS_COLLECTION, assignment.id),
        {
          shiftName,
          updatedAt: serverTimestamp(),
        }
      )
    )
  )
},
}
