import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import EmployeeProfile from '@components/EmployeeProfile';
import { employeeService } from '@services/employeeService';

export default function EmployeeProfilePage() {
const { employeeId } = useParams();
const navigate = useNavigate();

const [employee, setEmployee] = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
async function loadEmployee() {
try {
setLoading(true);
const data = await employeeService.getById(employeeId);
setEmployee(data);
} catch (error) {
console.error('Failed to load employee:', error);
setEmployee(null);
} finally {
setLoading(false);
}
}

```
loadEmployee();
```

}, [employeeId]);

const goToPage = (page) => {
if (page === 1) navigate('/employees/new');
if (page === 2) navigate('/employees');
};

if (loading) {
return <div className="p-6">Loading employee...</div>;
}

if (!employee) {
return ( <div className="p-6"> <p>Employee not found.</p>
<button
onClick={() => navigate('/employees')}
className="mt-4 rounded bg-blue-600 px-4 py-2 text-white"
>
Back to employees </button> </div>
);
}

return (
<EmployeeProfile
employee={{
...employee,
name: employee.fullName || employee.name || 'Unnamed employee',
id: employee.employeeNumber || employee.id,
}}
activeEmpPage={3}
onPageChange={goToPage}
onBack={() => navigate('/employees')}
/>
);
}
