import { useEffect, useState } from 'react'
import { employeeService } from '@services/employeeService'
import { attendanceService } from '@services/attendanceService'
import {
  Users,
  Clock,
  UserX,
  CalendarDays,
  Download,
  FileBarChart,
  Building2,
  ChevronDown,
} from 'lucide-react'

const REPORT_TYPES = [
  'Employee Report',
  'Attendance Report',
  'Leave Report',
  'Branch Report',
]

export default function ReportsPage() {
  const [reportType, setReportType] = useState('Employee Report')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [selectedBranch, setSelectedBranch] = useState('All branches')
  const [selectedDepartment, setSelectedDepartment] = useState('All departments')
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [attendanceRecords, setAttendanceRecords] = useState([])
const [attendanceLoading, setAttendanceLoading] = useState(true)
const [attendanceError, setAttendanceError] = useState('')
  useEffect(() => {
  async function loadEmployees() {
    try {
      setLoading(true)
      setError('')

      const data = await employeeService.getAll()
      setEmployees(data)
    } catch (err) {
      console.error('Failed to load employees:', err)
      setError('Unable to load employee data. Please try again.')
    } finally {
      setLoading(false)
    }
  }
  
  loadEmployees()
}, [])

  useEffect(() => {
  async function loadEmployees() {
    try {
      setLoading(true)
      setError('')

      const data = await employeeService.getAll()
      setEmployees(data)
    } catch (err) {
      console.error('Failed to load employees:', err)
      setError('Unable to load employee data. Please try again.')
    } finally {
      setLoading(false)
    }
  }
  
  loadEmployees()
}, [])
useEffect(() => {
  async function loadAttendance() {
    try {
      setAttendanceLoading(true)
      setAttendanceError('')

      const today = new Date().toLocaleDateString('en-CA', {
        timeZone: 'Africa/Kampala',
      })

      const records = await attendanceService.getDaily(today)

      setAttendanceRecords(records)
    } catch (err) {
      console.error('Failed to load attendance records:', err)
      setAttendanceError('Unable to load attendance data. Please try again.')
    } finally {
      setAttendanceLoading(false)
    }
  }

  loadAttendance()
}, [])
const presentCount = attendanceRecords.filter(
  (record) => record.status?.toLowerCase() === 'present'
).length

const lateCount = attendanceRecords.filter(
  (record) => record.status?.toLowerCase() === 'late'
).length

const attendanceRate =
  employees.length > 0
    ? ((presentCount / employees.length) * 100).toFixed(1)
    : '0.0'
const totalEmployees = employees.length

const activeEmployees = employees.filter(
  (employee) => employee.status?.toLowerCase() === 'active'
).length

const inactiveEmployees = employees.filter(
  (employee) => employee.status?.toLowerCase() === 'inactive'
).length

const departmentCount = new Set(
  employees.map((employee) => employee.department).filter(Boolean)
).size
const branches = [
  ...new Set(employees.map((employee) => employee.branch).filter(Boolean)),
].sort()

const departments = [
  ...new Set(
    employees.map((employee) => employee.department).filter(Boolean)
  ),
].sort()

const filteredEmployees = employees.filter((employee) => {
  const matchesBranch =
    selectedBranch === 'All branches' ||
    employee.branch === selectedBranch

  const matchesDepartment =
    selectedDepartment === 'All departments' ||
    employee.department === selectedDepartment

  return matchesBranch && matchesDepartment
})
const branchCount = new Set(
  employees.map((employee) => employee.branch).filter(Boolean)
).size

const summaryCards = [
  {
    title: 'Total Employees',
    value: loading ? '...' : error ? '—' : totalEmployees,
    description: 'Employees in the system',
    icon: Users,
  },
  {
    title: 'Present Today',
    value: attendanceLoading ? '...' : attendanceError ? '—' : presentCount,
    description: 'Recorded as present today',
    icon: Clock,
  },
  {
    title: 'Attendance Rate',
    value: attendanceLoading || loading
      ? '...'
      : attendanceError || error
        ? '—'
        : `${attendanceRate}%`,
    description: 'Based on total employee count',
    icon: CalendarDays,
  },
  {
    title: 'Late Today',
    value: attendanceLoading ? '...' : attendanceError ? '—' : lateCount,
    description: 'Recorded as late today',
    icon: UserX,
  },
]
function handleExport() {
  if (loading || error) {
    window.alert('Employee data is not ready to export.')
    return
  }

  if (filteredEmployees.length === 0) {
    window.alert('There are no employees to export.')
    return
  }

  const headers = [
    'Employee Name',
    'Department',
    'Branch',
    'Employment Status',
  ]

  const escapeCSV = (value) => {
    const text = String(value ?? '')
    return `"${text.replace(/"/g, '""')}"`
  }

  const rows = filteredEmployees.map((employee) => {
    const firstName =
      employee.firstName || employee.first_name || employee.name || ''

    const lastName = employee.lastName || employee.last_name || ''

    const employeeName = `${firstName} ${lastName}`.trim()

    return [
      employeeName || 'Unnamed employee',
      employee.department || '',
      employee.branch || '',
      employee.status || 'Not specified',
    ]
  })

  const csvContent = [
    headers.map(escapeCSV).join(','),
    ...rows.map((row) => row.map(escapeCSV).join(',')),
  ].join('\r\n')

  // Add a UTF-8 BOM to improve compatibility with Microsoft Excel.
  const blob = new Blob(['\uFEFF', csvContent], {
    type: 'text/csv;charset=utf-8;',
  })

  const downloadUrl = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = downloadUrl
  link.download = `attendi-employee-report-${new Date()
    .toISOString()
    .slice(0, 10)}.csv`

  document.body.appendChild(link)
  link.click()
  link.remove()

  URL.revokeObjectURL(downloadUrl)
}

  return (
    <div className="page-container animate-fade-in-up space-y-6">
      {/* Page heading */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <FileBarChart size={17} />
            Analytics & reporting
          </div>

          <h1 className="mt-2 text-2xl font-bold text-gray-900">
            Reports & Analytics
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Understand your workforce using reports from your business data.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExport}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Download size={17} />
          Export CSV
        </button>
      </div>

{error && (
  <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
    {error}
  </div>
)}
      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => {
          const Icon = card.icon

          return (
            <div
              key={card.title}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-500">
                  {card.title}
                </p>

                <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                  <Icon size={20} />
                </div>
              </div>

              <p className="mt-4 text-3xl font-bold text-gray-900">
                {card.value}
              </p>

              <p className="mt-1 text-xs text-gray-500">
                {card.description}
              </p>
            </div>
          )
        })}
      </div>

      {/* Filters */}
      <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900">
          Configure your report
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Choose a report type and narrow the results to the period and team
          you want to examine.
        </p>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Report type
            </label>

            <div className="relative">
              <select
                value={reportType}
                onChange={(event) => setReportType(event.target.value)}
                className="w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 py-2.5 pr-9 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                {REPORT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>

              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Start date
            </label>

            <input
              type="date"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              End date
            </label>

            <input
              type="date"
              value={endDate}
              min={startDate || undefined}
              onChange={(event) => setEndDate(event.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Branch
            </label>

            <div className="relative">
              <select
                value={selectedBranch}
                onChange={(event) => setSelectedBranch(event.target.value)}
                className="w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 py-2.5 pr-9 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="All branches">All branches</option>

{branches.map((branch) => (
  <option key={branch} value={branch}>
    {branch}
  </option>
))}
              </select>

              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Department
            </label>

            <div className="relative">
              <select
                value={selectedDepartment}
                onChange={(event) =>
                  setSelectedDepartment(event.target.value)
                }
                className="w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 py-2.5 pr-9 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="All departments">All departments</option>

{departments.map((department) => (
  <option key={department} value={department}>
    {department}
  </option>
))}
              </select>

              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
          <Building2 size={15} />
          Branch and department options will load from your business data.
        </div>
      </section>

      {/* Report results */}
      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 p-5">
          <h2 className="font-semibold text-gray-900">{reportType}</h2>

          <p className="mt-1 text-sm text-gray-500">
            Your report results will appear here once the Firestore connection
            is implemented.
          </p>
        </div>

        <div className="overflow-x-auto">
  {loading ? (
    <p className="p-8 text-center text-sm text-gray-500">
      Loading employee records...
    </p>
  ) : error ? (
    <p className="p-8 text-center text-sm text-red-600">
      Unable to display employee records.
    </p>
  ) : filteredEmployees.length === 0 ? (
    <p className="p-8 text-center text-sm text-gray-500">
      No employees match the selected filters.
    </p>
  ) : (
    <table className="w-full text-left text-sm">
      <thead className="bg-gray-50 text-xs uppercase text-gray-500">
        <tr>
          <th className="px-5 py-3 font-semibold">Employee</th>
          <th className="px-5 py-3 font-semibold">Department</th>
          <th className="px-5 py-3 font-semibold">Branch</th>
          <th className="px-5 py-3 font-semibold">Status</th>
        </tr>
      </thead>

      <tbody className="divide-y divide-gray-100">
        {filteredEmployees.map((employee) => (
          <tr key={employee.id} className="hover:bg-gray-50">
            <td className="px-5 py-4 font-medium text-gray-900">
              {employee.firstName || employee.first_name || employee.name || 'Unnamed employee'}
              {employee.lastName || employee.last_name
                ? ` ${employee.lastName || employee.last_name}`
                : ''}
            </td>

            <td className="px-5 py-4 text-gray-600">
              {employee.department || '—'}
            </td>

            <td className="px-5 py-4 text-gray-600">
              {employee.branch || '—'}
            </td>

            <td className="px-5 py-4">
              <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                {employee.status || 'Not specified'}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )}
</div>
      </section>
    </div>
  )
}
const presentCount = attendanceRecords.filter(
  (record) => record.status?.toLowerCase() === 'present'
).length

const lateCount = attendanceRecords.filter(
  (record) => record.status?.toLowerCase() === 'late'
).length

const attendanceRate =
  employees.length > 0
    ? ((presentCount / employees.length) * 100).toFixed(1)
    : '0.0'
const totalEmployees = employees.length

const activeEmployees = employees.filter(
  (employee) => employee.status?.toLowerCase() === 'active'
).length

const inactiveEmployees = employees.filter(
  (employee) => employee.status?.toLowerCase() === 'inactive'
).length

const departmentCount = new Set(
  employees.map((employee) => employee.department).filter(Boolean)
).size
const branches = [
  ...new Set(employees.map((employee) => employee.branch).filter(Boolean)),
].sort()

const departments = [
  ...new Set(
    employees.map((employee) => employee.department).filter(Boolean)
  ),
].sort()

const filteredEmployees = employees.filter((employee) => {
  const matchesBranch =
    selectedBranch === 'All branches' ||
    employee.branch === selectedBranch

  const matchesDepartment =
    selectedDepartment === 'All departments' ||
    employee.department === selectedDepartment

  return matchesBranch && matchesDepartment
})
const branchCount = new Set(
  employees.map((employee) => employee.branch).filter(Boolean)
).size

const summaryCards = [
  {
    title: 'Total Employees',
    value: loading ? '...' : error ? '—' : totalEmployees,
    description: 'Employees in the system',
    icon: Users,
  },
  {
    title: 'Present Today',
    value: attendanceLoading ? '...' : attendanceError ? '—' : presentCount,
    description: 'Recorded as present today',
    icon: Clock,
  },
  {
    title: 'Attendance Rate',
    value: attendanceLoading || loading
      ? '...'
      : attendanceError || error
        ? '—'
        : `${attendanceRate}%`,
    description: 'Based on total employee count',
    icon: CalendarDays,
  },
  {
    title: 'Late Today',
    value: attendanceLoading ? '...' : attendanceError ? '—' : lateCount,
    description: 'Recorded as late today',
    icon: UserX,
  },
]
function handleExport() {
  if (loading || error) {
    window.alert('Employee data is not ready to export.')
    return
  }

  if (filteredEmployees.length === 0) {
    window.alert('There are no employees to export.')
    return
  }

  const headers = [
    'Employee Name',
    'Department',
    'Branch',
    'Employment Status',
  ]

  const escapeCSV = (value) => {
    const text = String(value ?? '')
    return `"${text.replace(/"/g, '""')}"`
  }

  const rows = filteredEmployees.map((employee) => {
    const firstName =
      employee.firstName || employee.first_name || employee.name || ''

    const lastName = employee.lastName || employee.last_name || ''

    const employeeName = `${firstName} ${lastName}`.trim()

    return [
      employeeName || 'Unnamed employee',
      employee.department || '',
      employee.branch || '',
      employee.status || 'Not specified',
    ]
  })

  const csvContent = [
    headers.map(escapeCSV).join(','),
    ...rows.map((row) => row.map(escapeCSV).join(',')),
  ].join('\r\n')

  // Add a UTF-8 BOM to improve compatibility with Microsoft Excel.
  const blob = new Blob(['\uFEFF', csvContent], {
    type: 'text/csv;charset=utf-8;',
  })

  const downloadUrl = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = downloadUrl
  link.download = `attendi-employee-report-${new Date()
    .toISOString()
    .slice(0, 10)}.csv`

  document.body.appendChild(link)
  link.click()
  link.remove()

  URL.revokeObjectURL(downloadUrl)
}

  return (
    <div className="page-container animate-fade-in-up space-y-6">
      {/* Page heading */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <FileBarChart size={17} />
            Analytics & reporting
          </div>

          <h1 className="mt-2 text-2xl font-bold text-gray-900">
            Reports & Analytics
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Understand your workforce using reports from your business data.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExport}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Download size={17} />
          Export CSV
        </button>
      </div>

{error && (
  <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
    {error}
  </div>
)}
      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => {
          const Icon = card.icon

          return (
            <div
              key={card.title}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-500">
                  {card.title}
                </p>

                <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                  <Icon size={20} />
                </div>
              </div>

              <p className="mt-4 text-3xl font-bold text-gray-900">
                {card.value}
              </p>

              <p className="mt-1 text-xs text-gray-500">
                {card.description}
              </p>
            </div>
          )
        })}
      </div>

      {/* Filters */}
      <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900">
          Configure your report
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Choose a report type and narrow the results to the period and team
          you want to examine.
        </p>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Report type
            </label>

            <div className="relative">
              <select
                value={reportType}
                onChange={(event) => setReportType(event.target.value)}
                className="w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 py-2.5 pr-9 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                {REPORT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>

              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Start date
            </label>

            <input
              type="date"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              End date
            </label>

            <input
              type="date"
              value={endDate}
              min={startDate || undefined}
              onChange={(event) => setEndDate(event.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Branch
            </label>

            <div className="relative">
              <select
                value={selectedBranch}
                onChange={(event) => setSelectedBranch(event.target.value)}
                className="w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 py-2.5 pr-9 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="All branches">All branches</option>

{branches.map((branch) => (
  <option key={branch} value={branch}>
    {branch}
  </option>
))}
              </select>

              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Department
            </label>

            <div className="relative">
              <select
                value={selectedDepartment}
                onChange={(event) =>
                  setSelectedDepartment(event.target.value)
                }
                className="w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 py-2.5 pr-9 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="All departments">All departments</option>

{departments.map((department) => (
  <option key={department} value={department}>
    {department}
  </option>
))}
              </select>

              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
          <Building2 size={15} />
          Branch and department options will load from your business data.
        </div>
      </section>

      {/* Report results */}
      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 p-5">
          <h2 className="font-semibold text-gray-900">{reportType}</h2>

          <p className="mt-1 text-sm text-gray-500">
            Your report results will appear here once the Firestore connection
            is implemented.
          </p>
        </div>

        <div className="overflow-x-auto">
  {loading ? (
    <p className="p-8 text-center text-sm text-gray-500">
      Loading employee records...
    </p>
  ) : error ? (
    <p className="p-8 text-center text-sm text-red-600">
      Unable to display employee records.
    </p>
  ) : filteredEmployees.length === 0 ? (
    <p className="p-8 text-center text-sm text-gray-500">
      No employees match the selected filters.
    </p>
  ) : (
    <table className="w-full text-left text-sm">
      <thead className="bg-gray-50 text-xs uppercase text-gray-500">
        <tr>
          <th className="px-5 py-3 font-semibold">Employee</th>
          <th className="px-5 py-3 font-semibold">Department</th>
          <th className="px-5 py-3 font-semibold">Branch</th>
          <th className="px-5 py-3 font-semibold">Status</th>
        </tr>
      </thead>

      <tbody className="divide-y divide-gray-100">
        {filteredEmployees.map((employee) => (
          <tr key={employee.id} className="hover:bg-gray-50">
            <td className="px-5 py-4 font-medium text-gray-900">
              {employee.firstName || employee.first_name || employee.name || 'Unnamed employee'}
              {employee.lastName || employee.last_name
                ? ` ${employee.lastName || employee.last_name}`
                : ''}
            </td>

            <td className="px-5 py-4 text-gray-600">
              {employee.department || '—'}
            </td>

            <td className="px-5 py-4 text-gray-600">
              {employee.branch || '—'}
            </td>

            <td className="px-5 py-4">
              <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                {employee.status || 'Not specified'}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )}
</div>
      </section>
    </div>
  )
}