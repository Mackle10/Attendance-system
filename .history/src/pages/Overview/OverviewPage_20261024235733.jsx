import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import OverviewDashboard from '@components/OverviewDashboard';
import { employeeService } from '@services/employeeService';
import { attendanceService } from '@services/attendanceService';

function getToday() {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Africa/Kampala',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date());

  const values = Object.fromEntries(
    parts.map(({ type, value }) => [type, value])
  );

  return `${values.year}-${values.month}-${values.day}`;
}

export default function OverviewPage() {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const today = getToday();

        const [employeeData, attendanceData] = await Promise.all([
          employeeService.getAll(),
          attendanceService.getDaily(today),
        ]);

        setEmployees(employeeData);
        setAttendanceRecords(attendanceData);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      }
    }

    loadDashboardData();
  }, []);

  const openEmployee = (name) => {
    const match = employees.find(
      (emp) => (emp.fullName || emp.name) === name
    );

    navigate(match ? `/employees/${match.id}` : '/employees');
  };

  return (
    <OverviewDashboard
      employees={employees}
      attendanceRecords={attendanceRecords}
      onNavigateToEmployees={openEmployee}
    />
  );
}