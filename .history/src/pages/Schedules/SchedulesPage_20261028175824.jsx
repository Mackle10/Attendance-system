import styles from './SchedulesPage.module.css'

export default function SchedulesPage() {
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
