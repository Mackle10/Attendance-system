import { useNavigate } from 'react-router-dom';
import EmployeesList from '@components/EmployeesList';

export default function EmployeesPage() {
  const navigate = useNavigate();

  return (
    <EmployeesList
      activeEmpPage={1}
      onPageChange={() => {}}
      onAddEmployee={() => navigate('/employees/new')}
      onSelectEmployee={(emp) => navigate(`/employees/${emp.id}`)}
    />
  );
}