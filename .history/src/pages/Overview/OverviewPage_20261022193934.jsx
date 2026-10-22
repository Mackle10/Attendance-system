/**
 * OverviewPage.jsx
 * People-focused overview: headcount, attendance and HR follow-ups.
 */
import { useNavigate } from 'react-router-dom'
import OverviewDashboard from '@components/OverviewDashboard'

export default function OverviewPage() {
  const navigate = useNavigate()

  const openEmployee = name => {
    const match = employees.find(emp => emp.name === name)
    navigate(match ? `/employees/${match.id}` : '/employees')
  }

  return <OverviewDashboard onNavigateToEmployees={openEmployee} />
}
