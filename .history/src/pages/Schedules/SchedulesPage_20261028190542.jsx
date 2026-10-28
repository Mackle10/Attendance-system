import styles from './SchedulesPage.module.css'
import { useEffect, useState } from 'react'
import { employeeService } from '@services/employeeService'
import { scheduleService } from '@services/scheduleService'
import { shiftAssignmentService } from '@services/shiftAssignmentService'
export default function SchedulesPage() {
  const [employees, setEmployees] = useState([])
const [loadingEmployees, setLoadingEmployees] = useState(true)
const [employeeError, setEmployeeError] = useState('')
const [shifts, setShifts] = useState([])
const [loadingShifts, setLoadingShifts] = useState(true)
const [shiftError, setShiftError] = useState('')
const [assignments, setAssignments] = useState([])
const [loadingAssignments, setLoadingAssignments] = useState(true)
const [assignmentError, setAssignmentError] = useState('')
const [showAssignmentForm, setShowAssignmentForm] = useState(false)
const [savingAssignment, setSavingAssignment] = useState(false)

const [assignmentForm, setAssignmentForm] = useState({
  employeeId: '',
  shiftId: '',
})
const [showShiftForm, setShowShiftForm] = useState(false)
const [shiftForm, setShiftForm] = useState({
  name: '',
  startTime: '08:00',
  endTime: '16:00',
  workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
})
const weekdays = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
]
useEffect(() => {
  const loadEmployees = async () => {
    try {
      setLoadingEmployees(true)
      setEmployeeError('')

      const data = await employeeService.getAll()
      setEmployees(data)
    } catch (error) {
      console.error('Error loading employees:', error)
      setEmployeeError('Unable to load employees. Please try again.')
    } finally {
      setLoadingEmployees(false)
    }
  }

  loadEmployees()
}, [])
useEffect(() => {
const loadShifts = async () => {
try {
setLoadingShifts(true)
setShiftError('')


  const data = await scheduleService.getAll()
  setShifts(data)
} catch (error) {
  console.error('Error loading shifts:', error)
  setShiftError('Unable to load shifts. Please try again.')
} finally {
  setLoadingShifts(false)
}

}

loadShifts()
}, [])

useEffect(() => {
const loadAssignments = async () => {
try {
setLoadingAssignments(true)
setAssignmentError('')

  const data = await shiftAssignmentService.getAll()
  setAssignments(data)
} catch (error) {
  console.error('Error loading assignments:', error)
  setAssignmentError('Unable to load employee assignments.')
} finally {
  setLoadingAssignments(false)
}

}

loadAssignments()
}, [])


  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1>Schedules & Shifts</h1>
          <p>Plan employee working hours and manage shifts.</p>
        </div>
      </div>


<div className={styles.sectionHeader}>
  <div>
    <h2>Shift Management</h2>
    <p>Create shifts and assign employees to their working hours.</p>
  </div>

  <div className={styles.headerActions}>
    <button
      type="button"
      className={styles.secondaryButton}
      onClick={() => {
        setShowAssignmentForm((current) => !current)
        setShowShiftForm(false)
      }}
    >
      {showAssignmentForm ? 'Cancel Assignment' : '+ Assign Employee'}
    </button>

<button
  type="button"
  className={styles.primaryButton}
  onClick={() => {
    setShowShiftForm((current) => !current)
    setShowAssignmentForm(false)
  }}
>
  {showShiftForm ? 'Cancel' : '+ Create Shift'}
</button>

  </div>
</div>

{showAssignmentForm && (

  <form
    className={styles.shiftForm}
    onSubmit={async (event) => {
      event.preventDefault()

  if (!assignmentForm.employeeId || !assignmentForm.shiftId) {
    window.alert('Please select both an employee and a shift.')
    return
  }

  const employee = employees.find(
    (item) => item.id === assignmentForm.employeeId
  )

  const shift = shifts.find(
    (item) => item.id === assignmentForm.shiftId
  )

  if (!employee || !shift) {
    window.alert('The selected employee or shift could not be found.')
    return
  }

  try {
    setSavingAssignment(true)
    setAssignmentError('')

    await shiftAssignmentService.create({
      employeeId: employee.id,
      employeeName: employee.fullName,
      employeeNumber: employee.employeeNumber,
      shiftId: shift.id,
      shiftName: shift.name,
    })

    const updatedAssignments = await shiftAssignmentService.getAll()
    setAssignments(updatedAssignments)

    setAssignmentForm({
      employeeId: '',
      shiftId: '',
    })

    setShowAssignmentForm(false)
    window.alert('Employee assigned successfully!')
  } catch (error) {
    console.error('Error assigning employee:', error)

    window.alert(
      error.message === 'This employee is already assigned to this shift.'
        ? error.message
        : 'Unable to assign employee. Please try again.'
    )
  } finally {
    setSavingAssignment(false)
  }
}}

>

<div className={styles.formField}>

  <label htmlFor="assignmentEmployee">Select employee</label>

  <select
    id="assignmentEmployee"
    value={assignmentForm.employeeId}
    onChange={(event) =>
      setAssignmentForm((current) => ({
        ...current,
        employeeId: event.target.value,
      }))
    }
    required
  >
    <option value="">Choose an employee</option>

    {employees
      .filter((employee) => employee.status === 'Active')
      .map((employee) => (
        <option key={employee.id} value={employee.id}>
          {employee.fullName} ({employee.employeeNumber})
        </option>
      ))}
  </select>

  {!loadingEmployees && employees.length === 0 && (
    <p>No employees found. Add an employee first.</p>
  )}

  {employeeError && <p>{employeeError}</p>}
</div>

<div className={styles.formField}>
  <label htmlFor="assignmentShift">Select shift</label>

  <select
    id="assignmentShift"
    value={assignmentForm.shiftId}
    onChange={(event) =>
      setAssignmentForm((current) => ({
        ...current,
        shiftId: event.target.value,
      }))
    }
    required
  >
    <option value="">Choose a shift</option>

    {shifts.map((shift) => (
      <option key={shift.id} value={shift.id}>
        {shift.name} ({shift.startTime}–{shift.endTime})
      </option>
    ))}
  </select>

  {!loadingShifts && shifts.length === 0 && (
    <p>Create a shift before assigning employees.</p>
  )}
</div>

<button
  type="submit"
  className={styles.primaryButton}
  disabled={savingAssignment || loadingEmployees || loadingShifts}
>
  {savingAssignment ? 'Assigning...' : 'Save Assignment'}
</button>

  </form>
)}

  {showShiftForm && (
    <form
      className={styles.shiftForm}
      onSubmit={async (event) => {
event.preventDefault()

if (shiftForm.workingDays.length === 0) {
window.alert('Please select at least one working day.')
return
}

if (shiftForm.endTime <= shiftForm.startTime) {
window.alert('End time must be later than start time.')
return
}

try {
await scheduleService.create(shiftForm)

window.alert('Shift saved successfully!')

setShiftForm({
  name: '',
  startTime: '08:00',
  endTime: '16:00',
  workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
})

setShowShiftForm(false)


} catch (error) {
console.error('Error saving shift:', error)
window.alert('Unable to save the shift. Please try again.')
}
}}

    >
      <div className={styles.formField}>
        <label htmlFor="shiftName">Shift name</label>
        <input
          id="shiftName"
          type="text"
          placeholder="e.g. Morning Shift"
          value={shiftForm.name}
          onChange={(event) =>
            setShiftForm((current) => ({
              ...current,
              name: event.target.value,
            }))
          }
          required
        />
      </div>

      <div className={styles.timeGrid}>
        <div className={styles.formField}>
          <label htmlFor="startTime">Start time</label>
          <input
            id="startTime"
            type="time"
            value={shiftForm.startTime}
            onChange={(event) =>
              setShiftForm((current) => ({
                ...current,
                startTime: event.target.value,
              }))
            }
            required
          />
        </div>

        <div className={styles.formField}>
          <label htmlFor="endTime">End time</label>
          <input
            id="endTime"
            type="time"
            value={shiftForm.endTime}
            onChange={(event) =>
              setShiftForm((current) => ({
                ...current,
                endTime: event.target.value,
              }))
            }
            required
          />
        </div>
      </div>

      <fieldset className={styles.daysFieldset}>
        <legend>Working days</legend>

        <div className={styles.daysGrid}>
          {weekdays.map((day) => (
            <label key={day} className={styles.dayOption}>
              <input
                type="checkbox"
                checked={shiftForm.workingDays.includes(day)}
                onChange={(event) =>
                  setShiftForm((current) => ({
                    ...current,
                    workingDays: event.target.checked
                      ? [...current.workingDays, day]
                      : current.workingDays.filter(
                          (selectedDay) => selectedDay !== day
                        ),
                  }))
                }
              />
              <span>{day}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <button type="submit" className={styles.primaryButton}>
        Save Shift
      </button>
    </form>
  )}
  <div className={styles.savedShifts}>
  <h2>Saved Shifts</h2>

{loadingShifts ? ( <p>Loading shifts...</p>
) : shiftError ? ( <p>{shiftError}</p>
) : shifts.length === 0 ? ( <p>No shifts created yet. Create your first shift above.</p>
) : ( <div className={styles.shiftsGrid}>
{shifts.map((shift) => ( <div key={shift.id} className={styles.shiftCard}> <h3>{shift.name}</h3>

      <p>
        <strong>Start:</strong> {shift.startTime}
      </p>

      <p>
        <strong>End:</strong> {shift.endTime}
      </p>

      <p>
        <strong>Working days:</strong>{' '}
        {shift.workingDays.join(', ')}
      </p>
    </div>
  ))}
</div>

)}

</div>

{/* Employee Shift Assignments */}

<div className={styles.savedShifts}>
  <h2>Employee Shift Assignments</h2>

{loadingAssignments ? ( <p>Loading assignments...</p>
) : assignmentError ? ( <p>{assignmentError}</p>
) : assignments.length === 0 ? ( <p>No employees have been assigned to shifts yet.</p>
) : ( <div className={styles.shiftsGrid}>
{assignments.map((assignment) => ( <div key={assignment.id} className={styles.shiftCard}> <h3>{assignment.employeeName}</h3>

      <p>
        <strong>Employee No.:</strong>{' '}
        {assignment.employeeNumber || 'Not available'}
      </p>

      <p>
        <strong>Shift:</strong> {assignment.shiftName}
      </p>

      <p>
        <strong>Working hours:</strong>{' '}
        {shifts.find((shift) => shift.id === assignment.shiftId)
          ? `${shifts.find((shift) => shift.id === assignment.shiftId).startTime} – ${shifts.find((shift) => shift.id === assignment.shiftId).endTime}`
          : 'Shift details unavailable'}
      </p>
    </div>
  ))}
</div>

)}

</div>

</div>
  )
}

