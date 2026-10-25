import { useEffect, useState } from 'react'
import { employeeService } from '@services/employeeService'
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

  const summaryCards = [
    {
      title: 'Total Employees',
      value: '—',
      description: 'Employees in the system',
      icon: Users,
    },
    {
      title: 'Attendance Rate',
      value: '—',
      description: 'For the selected period',
      icon: Clock,
    },
    {
      title: 'Absences',
      value: '—',
      description: 'Recorded absences',
      icon: UserX,
    },
    {
      title: 'Leave Requests',
      value: '—',
      description: 'Requests in the system',
      icon: CalendarDays,
    },
  ]

  function handleExport() {
    window.alert(
      'CSV export will be enabled after we connect the report to Firestore.'
    )
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
                <option>All branches</option>
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
                <option>All departments</option>
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

        <div className="flex flex-col items-center justify-center px-5 py-14 text-center">
          <div className="rounded-full bg-gray-100 p-4 text-gray-500">
            <FileBarChart size={30} />
          </div>

          <h3 className="mt-4 font-semibold text-gray-900">
            Your report is being prepared
          </h3>

          <p className="mt-2 max-w-md text-sm text-gray-500">
            Select a report type and filters above. In the next step, well
            connect this page to Firestore so the figures and report results
            come from your actual records.
          </p>
        </div>
      </section>
    </div>
  )
}