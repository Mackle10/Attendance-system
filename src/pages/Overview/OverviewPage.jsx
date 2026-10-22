
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import OverviewDashboard from '@components/OverviewDashboard';
import { employeeService } from '@services/employeeService';

export default function OverviewPage() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    async function loadEmployees() {
      try {
        const data = await employeeService.getAll();
        setEmployees(data);
      } catch (error) {
        console.error('Failed to load employees:', error);
      }
    }

    loadEmployees();
  }, []);

  const openEmployee = (name) => {
    const match = employees.find(
      (emp) => (emp.fullName || emp.name) === name
    );

    navigate(match ? `/employees/${match.id}` : '/employees');
  };

  return <OverviewDashboard onNavigateToEmployees={openEmployee} />;
}