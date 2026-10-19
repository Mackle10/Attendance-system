/**
 * EmployeesPage.jsx
 * Employee directory – lists everyone in the company.
 */
import { useNavigate } from 'react-router-dom'
import EmployeesList, { employees } from '@components/EmployeesList'

export default function EmployeesPage() {
  const navigate = useNavigate()

  // The prototype paged between its three employee screens with 1/2/3.
  // Those screens are routes now, so map the page numbers onto them.
  const goToPage = page => {
    if (page === 1) navigate('/employees/new')
    if (page === 3) navigate(`/employees/${employees[3].id}`)
  }

  return (
    <EmployeesList
      activeEmpPage={2}
      onPageChange={goToPage}
      onAddEmployee={() => navigate('/employees/new')}
      onSelectEmployee={emp => navigate(`/employees/${emp.id}`)}
    />
  )
}
