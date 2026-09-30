/**
 * AttendancePage.jsx
 * TODO: Build the Attendance tracking screen here.
 *
 * Suggested content:
 *  - Date picker to select day / week / month
 *  - Today's attendance summary (present, absent, late, on leave counts)
 *  - Attendance table: employee, clock-in time, clock-out time, hours worked, status
 *  - Calendar view toggle
 *  - Export button (CSV / Excel)
 *  - Manual clock-in/out override (admin only)
 *
 * Data: fetch from attendanceService.getDaily() / attendanceService.getCalendar()
 */

export default function AttendancePage() {
  return (
    <div className="page-container animate-fade-in-up">
      <h1>🕐 Attendance</h1>
      <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
        Build the Attendance page here – <code>src/pages/Attendance/AttendancePage.jsx</code>
      </p>
    </div>
  )
}
