import styles from './SchedulesPage.module.css'
import { useEffect, useState } from 'react'
import { employeeService } from '@services/employeeService'
export default function SchedulesPage() {
  const [employees, setEmployees] = useState([])
const [loadingEmployees, setLoadingEmployees] = useState(true)
const [employeeError, setEmployeeError] = useState('')
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
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1>Schedules & Shifts</h1>
          <p>Plan employee working hours and manage shifts.</p>
        </div>
      </div>

      <div className={styles.placeholder}>
        <h2>Employee Scheduling</h2>
        <p>
          This is where we will create shifts, assign employees,
          and manage their working schedules.
        </p>
      </div>
    </div>
  )
}
