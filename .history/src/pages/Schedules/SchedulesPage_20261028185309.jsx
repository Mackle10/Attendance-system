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


<div className={styles.placeholder}>
  <div className={styles.sectionHeader}>
    <div>
      <h2>Shift Management</h2>
      <p>Create shifts and define employee working hours.</p>
    </div>

    <button
      type="button"
      className={styles.primaryButton}
      onClick={() => setShowShiftForm((current) => !current)}
    >
      {showShiftForm ? 'Cancel' : '+ Create Shift'}
    </button>
  </div>

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

</div>
    </div>
  )
}
