/**
 * EmployeeProfilePage.jsx
 * Single employee profile, resolved from the :employeeId route param.
 */
import { useNavigate, useParams } from 'react-router-dom'
import EmployeeProfile from '@components/EmployeeProfile'
import { employees } from '@components/EmployeesList'

export default function EmployeeProfilePage() {
  const { employeeId } = useParams()
  const navigate = useNavigate()
  const employee = employees.find(emp => emp.id === employeeId)

  const goToPage = page => {
    if (page === 1) navigate('/employees/new')
    if (page === 2) navigate('/employees')
  }

  return (
    <EmployeeProfile
      employee={employee}
      activeEmpPage={3}
      onPageChange={goToPage}
      onBack={() => navigate('/employees')}
    />
  )
}
