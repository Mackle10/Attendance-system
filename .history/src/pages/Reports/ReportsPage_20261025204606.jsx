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

function getToday() {
  return new Date().toLocaleDateString('en-CA', {
    timeZone: 'Africa/Kampala',
  })
}

function getEmployeeName(employee) {
  const firstName =
    employee.firstName ||
    employee.first_name ||
    employee.name ||
    employee.fullName ||
    ''

  const lastName = employee.lastName || employee.last_name || ''

  return `${firstName} ${lastName}`.trim() || 'Unnamed employee'
}

export default function ReportsPage() {
  const [reportType, setReportType] = useState('Employee Report')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [selectedBranch, setSelectedBranch] = useState('All branches')
  const [selectedDepartment, setSelectedDepartment] =
    useState('All departments')

  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [attendanceRecords, setAttendanceRecords] = useState([])
  const [attendanceLoading, setAttendanceLoading] = useState(true)
  const [attendanceError, setAttendanceError] = useState('')

  // Load employees from Firestore.
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

  // Load attendance for today or the selected date range.
  useEffect(() => {
    let cancelled = false

    async function loadAttendance() {
      try {
        setAttendanceLoading(true)
        setAttendanceError('')

        const today = getToday()

        // Use a custom range only when both dates are selected.
        const fromDate = startDate && endDate ? startDate : today
        const toDate = startDate && endDate ? endDate : today

        if (fromDate > toDate) {
          throw new Error('Start date cannot be after end date.')
        }

        const records =
          fromDate === toDate
            ? await attendanceService.getDaily(fromDate)
            : await attendanceService.getByDateRange(fromDate, toDate)

        if (!cancelled) {
          setAttendanceRecords(records)
        }
      } catch (err) {
        console.error('Failed to load attendance records:', err)

        if (!cancelled) {
          setAttendanceError(
            err.message || 'Unable to load attendance data. Please try again.'
          )
          setAttendanceRecords([])
        }
      } finally {
        if (!cancelled) {
          setAttendanceLoading(false)
        }
      }
    }

    loadAttendance()

    return () => {
      cancelled = true
    }
  }, [startDate, endDate])

  // Summary calculations.
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

  const activeEmployees = employees.filter(
    (employee) => employee.status?.toLowerCase() === 'active'
  ).length

  const inactiveEmployees = employees.filter(
    (employee) => employee.status?.toLowerCase() === 'inactive'
  ).length

  const branches = [
    ...new Set(
      employees.map((employee) => employee.branch).filter(Boolean)
    ),
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

  const branchCount = branches.length
  const departmentCount = departments.length

  const summaryCards = [
    {
      title: 'Total Employees',
      value: loading ? '...' : error ? '—' : employees.length,
      description: 'Employees in the system',
      icon: Users,
    },
    {
      title: 'Present Today',
      value: attendanceLoading
        ? '...'
        : attendanceError
          ? '—'
          : presentCount,
      description: 'Present in the selected attendance period',
      icon: Clock,
    },
    {
      title: 'Attendance Rate',
      value:
        attendanceLoading || loading
          ? '...'
          : attendanceError || error
            ? '—'
            : `${attendanceRate}%`,
      description: 'Present records compared with total employees',
      icon: CalendarDays,
    },
    {
      title: 'Late Today',
      value: attendanceLoading
        ? '...'
        : attendanceError
          ? '—'
          : lateCount,
      description: 'Late records in the selected period',
      icon: UserX,
    },
  ]

  // Export the currently selected report.
  function handleExport() {
    if (reportType === 'Leave Report') {
      window.alert(
        'Leave report export is not available until leave records are connected.'
      )
      return
    }

    if (reportType === 'Attendance Report' && attendanceError) {
      window.alert('Attendance data could not be loaded.')
      return
    }

    if (
      (reportType === 'Employee Report' ||
        reportType === 'Branch Report') &&
      (loading || error)
    ) {
      window.alert('Employee data is not ready to export.')
      return
    }

    if (reportType === 'Attendance Report' && attendanceLoading) {
      window.alert('Please wait for attendance data to finish loading.')
      return
    }

    let headers = []
    let rows = []

    if (reportType === 'Attendance Report') {
      headers = [
        'Employee Name',
        'Employee Number',
        'Date',
        'Department',
        'Branch',
        'Status',
        'Clock In',
        'Clock Out',
      ]

      const records = attendanceRecords.filter((record) => {
        const matchesBranch =
          selectedBranch === 'All branches' ||
          record.branch === selectedBranch

        const matchesDepartment =
          selectedDepartment === 'All departments' ||
          record.department === selectedDepartment

        return matchesBranch && matchesDepartment
      })

      rows = records.map((record) => [
        record.employeeName || 'Unnamed employee',
        record.employeeNumber || '',
        record.date || '',
        record.department || '',
        record.branch || '',
        record.status || 'Not specified',
        record.clockIn || '',
        record.clockOut || '',
      ])
    } else if (reportType === 'Branch Report') {
      headers = ['Branch', 'Total Employees', 'Active Employees']

      rows = branches
        .filter(
          (branch) =>
            selectedBranch === 'All branches' ||
            branch === selectedBranch
        )
        .map((branch) => {
          const branchEmployees = filteredEmployees.filter(
            (employee) => employee.branch === branch
          )

          return [
            branch,
            branchEmployees.length,
            branchEmployees.filter(
              (employee) => employee.status?.toLowerCase() === 'active'
            ).length,
          ]
        })
    } else {
      headers = [
        'Employee Name',
        'Department',
        'Branch',
        'Employment Status',
      ]

      rows = filteredEmployees.map((employee) => [
        getEmployeeName(employee),
        employee.department || '',
        employee.branch || '',
        employee.status || 'Not specified',
      ])
    }

    if (rows.length === 0) {
      window.alert('There are no records to export for this report.')
      return
    }

    const escapeCSV = (value) => {
      const text = String(value ?? '')
      return `"${text.replace(/"/g, '""')}"`
    }

    const csvContent = [
      headers.map(escapeCSV).join(','),
      ...rows.map((row) => row.map(escapeCSV).join(',')),
    ].join('\r\n')

    const blob = new Blob(['\uFEFF', csvContent], {
      type: 'text/csv;charset=utf-8;',
    })

    const downloadUrl = URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = downloadUrl
    link.download = `attendi-${reportType
      .toLowerCase()
      .replace(/\s+/g, '-')}-${getToday()}.csv`

    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(downloadUrl)
  }

  // Attendance records can be filtered by branch and department.
  const filteredAttendance = attendanceRecords.filter((record) => {
    const matchesBranch =
      selectedBranch === 'All branches' ||
      record.branch === selectedBranch

    const matchesDepartment =
      selectedDepartment === 'All departments' ||
      record.department === selectedDepartment

    return matchesBranch && matchesDepartment
  })

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

      {attendanceError && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          Attendance data could not be loaded: {attendanceError}
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
              max={endDate || undefined}
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

        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-gray-500">
          <Building2 size={15} />
          Branches and departments are populated from employee records.
        </div>
      </section>

      {/* Report results */}
      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 p-5">
          <h2 className="font-semibold text-gray-900">{reportType}</h2>

          <p className="mt-1 text-sm text-gray-500">
            {reportType === 'Employee Report' &&
              'Employee details for the selected branch and department.'}

            {reportType === 'Attendance Report' &&
              'Attendance records for the selected date period and team.'}

            {reportType === 'Leave Report' &&
              'Leave reporting requires the leave records to be connected.'}

            {reportType === 'Branch Report' &&
              'Employee totals grouped by branch.'}
          </p>
        </div>

        <div className="overflow-x-auto">
          {reportType === 'Leave Report' ? (
            <div className="p-8 text-center text-sm text-gray-500">
              Leave report data has not been connected yet. We can add it using
              your leave service in a later step.
            </div>
          ) : reportType === 'Attendance Report' ? (
            attendanceLoading ? (
              <p className="p-8 text-center text-sm text-gray-500">
                Loading attendance records...
              </p>
            ) : attendanceError ? (
              <p className="p-8 text-center text-sm text-red-600">
                Unable to display attendance records.
              </p>
            ) : filteredAttendance.length === 0 ? (
              <p className="p-8 text-center text-sm text-gray-500">
                No attendance records match the selected filters.
              </p>
            ) : (
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Employee</th>
                    <th className="px-5 py-3 font-semibold">Date</th>
                    <th className="px-5 py-3 font-semibold">Department</th>
                    <th className="px-5 py-3 font-semibold">Branch</th>
                    <th className="px-5 py-3 font-semibold">Status</th>
                    <th className="px-5 py-3 font-semibold">Clock In</th>
                    <th className="px-5 py-3 font-semibold">Clock Out</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filteredAttendance.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-5 py-4 font-medium text-gray-900">
                        {record.employeeName || 'Unnamed employee'}
                      </td>

                      <td className="px-5 py-4 text-gray-600">
                        {record.date || '—'}
                      </td>

                      <td className="px-5 py-4 text-gray-600">
                        {record.department || '—'}
                      </td>

                      <td className="px-5 py-4 text-gray-600">
                        {record.branch || '—'}
                      </td>

                      <td className="px-5 py-4">
                        <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                          {record.status || 'Not specified'}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-gray-600">
                        {record.clockIn
                          ? new Date(record.clockIn).toLocaleTimeString()
                          : '—'}
                      </td>

                      <td className="px-5 py-4 text-gray-600">
                        {record.clockOut
                          ? new Date(record.clockOut).toLocaleTimeString()
                          : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          ) : reportType === 'Branch Report' ? (
            loading ? (
              <p className="p-8 text-center text-sm text-gray-500">
                Loading branch data...
              </p>
            ) : error ? (
              <p className="p-8 text-center text-sm text-red-600">
                Unable to display branch data.
              </p>
            ) : branches.filter(
                (branch) =>
                  selectedBranch === 'All branches' ||
                  branch === selectedBranch
              ).length === 0 ? (
              <p className="p-8 text-center text-sm text-gray-500">
                No branches match the selected filter.
              </p>
            ) : (
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Branch</th>
                    <th className="px-5 py-3 font-semibold">
                      Total Employees
                    </th>
                    <th className="px-5 py-3 font-semibold">
                      Active Employees
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {branches
                    .filter(
                      (branch) =>
                        selectedBranch === 'All branches' ||
                        branch === selectedBranch
                    )
                    .map((branch) => {
                      const branchEmployees = employees.filter(
                        (employee) => {
                          const matchesBranch = employee.branch === branch
                          const matchesDepartment =
                            selectedDepartment === 'All departments' ||
                            employee.department === selectedDepartment

                          return matchesBranch && matchesDepartment
                        }
                      )

                      const activeCount = branchEmployees.filter(
                        (employee) =>
                          employee.status?.toLowerCase() === 'active'
                      ).length

                      return (
                        <tr key={branch} className="hover:bg-gray-50">
                          <td className="px-5 py-4 font-medium text-gray-900">
                            {branch}
                          </td>

                          <td className="px-5 py-4 text-gray-600">
                            {branchEmployees.length}
                          </td>

                          <td className="px-5 py-4 text-gray-600">
                            {activeCount}
                          </td>
                        </tr>
                      )
                    })}
                </tbody>
              </table>
            )
          ) : loading ? (
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
                      {getEmployeeName(employee)}
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

      {/* Additional workforce information */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Active employees</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            {loading ? '...' : activeEmployees}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Inactive employees</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            {loading ? '...' : inactiveEmployees}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Departments / branches</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            {loading ? '...' : `${departmentCount} / ${branchCount}`}
          </p>
        </div>
      </section>
    </div>
  )
}