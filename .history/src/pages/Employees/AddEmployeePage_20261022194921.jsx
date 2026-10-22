/**
 * AddEmployeePage.jsx
 * Six-step wizard for onboarding a new employee.
 */
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StepTracker from '@components/StepTracker'
import JobPlacementForm from '@components/JobPlacementForm'
import SummaryCard from '@components/SummaryCard'


const stepTitles = [
  'Personal details',
  'Job & placement',
  'Contract & pay',
  'Schedule',
  'Documents',
  'Review & invite',
]

const inputClass =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm font-medium text-slate-800 outline-none transition focus:border-slate-700 focus:ring-2 focus:ring-slate-900/10'

function Field({ label, children }) {
  return (
    <label className="block text-xs font-semibold text-slate-700">
      <span className="mb-1.5 block">{label}</span>
      {children}
    </label>
  )
}

const dropdowns = {
  jobPositions: ['Sales Associate', 'Store Manager', 'Inventory Clerk', 'Cashier'],
  departments: ['Sales', 'Operations', 'Finance', 'Human Resources'],
  branches: ['Ntinda Store', 'Kampala HQ', 'Mukono Warehouse', 'Entebbe Depot'],
  managers: ['David Mugisha', 'Sarah Namatovu', 'John Doe', 'Alice Kigozi'],
  roles: ['Employee', 'Supervisor', 'Manager', 'Admin'],
}

const defaultForm = {
  fullName: 'Brenda Nankya',
  phone: '0741 226 590',
  email: 'brenda.n@nilefresh.co.ug',
  jobPosition: 'Sales Associate',
  department: 'Sales',
  branch: 'Ntinda Store',
  reportsTo: 'David Mugisha',
  startDate: '2026-10-05',
  appRole: 'Employee',
  employmentType: 'Permanent',
  salary: '1200000',
  paymentFrequency: 'Monthly',
  shift: 'Day Shift (8:00 AM - 5:00 PM)',
  clockInMethods: { qr: true, gps: true, officeDevice: false, faceCheck: true },
}

const FORM_STORAGE_KEY = 'attndi-form'

export default function AddEmployeePage() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem(FORM_STORAGE_KEY)
    if (!saved) return defaultForm
    try {
      return { ...defaultForm, ...JSON.parse(saved) }
    } catch {
      return defaultForm
    }
  })
  const [saveMessage, setSaveMessage] = useState('')
  const [employeeId, setEmployeeId] = useState('NF-0139')
  const [documents, setDocuments] = useState([])

  useEffect(() => {
    localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(formData))
  }, [formData])

  const updateForm = (key, value) => setFormData(previous => ({ ...previous, [key]: value }))

  const handleSave = (isDraft = false) => {
    const generatedId = `NF-${String(Math.floor(Math.random() * 9000) + 1000)}`
    setEmployeeId(generatedId)
    setSaveMessage(isDraft ? 'Draft saved locally.' : `Employee saved locally. ID: ${generatedId}`)
    localStorage.setItem(
      FORM_STORAGE_KEY,
      JSON.stringify({ ...formData, documents: documents.map(file => file.name), isDraft })
    )
  }

  // The prototype paged between its three employee screens with 1/2/3.
  // Those screens are routes now, so map the page numbers onto them.
  const goToPage = (page) => {
  if (page === 1) navigate('/employees/new');
  if (page === 2) navigate('/employees');
  if (page === 3) navigate('/employees');
};

  const renderStep = () => {
    if (currentStep === 1) {
      return (
        <div className="space-y-6">
          <header>
            <h2 className="text-xl font-bold text-slate-900">Personal details</h2>
            <p className="mt-1 text-sm text-slate-500">Basic identification details for the new employee profile.</p>
          </header>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Full name">
              <input
                className={inputClass}
                value={formData.fullName}
                onChange={event => updateForm('fullName', event.target.value)}
              />
            </Field>
            <Field label="Phone number">
              <input
                className={inputClass}
                type="tel"
                value={formData.phone}
                onChange={event => updateForm('phone', event.target.value)}
              />
            </Field>
            <Field label="Email address">
              <input
                className={inputClass}
                type="email"
                value={formData.email}
                onChange={event => updateForm('email', event.target.value)}
              />
            </Field>
          </div>
        </div>
      )
    }
    if (currentStep === 2) {
      return <JobPlacementForm formData={formData} options={dropdowns} setFormData={setFormData} />
    }
    if (currentStep === 3) {
      return (
        <div className="space-y-6">
          <header>
            <h2 className="text-xl font-bold text-slate-900">Contract &amp; pay</h2>
            <p className="mt-1 text-sm text-slate-500">Configure compensation and payment settings.</p>
          </header>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Monthly salary (UGX)">
              <input
                className={inputClass}
                type="number"
                min="0"
                value={formData.salary}
                onChange={event => updateForm('salary', event.target.value)}
              />
            </Field>
            <Field label="Payment frequency">
              <select
                className={inputClass}
                value={formData.paymentFrequency}
                onChange={event => updateForm('paymentFrequency', event.target.value)}
              >
                <option>Monthly</option>
                <option>Bi-weekly</option>
                <option>Weekly</option>
              </select>
            </Field>
          </div>
        </div>
      )
    }
    if (currentStep === 4) {
      return (
        <div className="space-y-6">
          <header>
            <h2 className="text-xl font-bold text-slate-900">Schedule</h2>
            <p className="mt-1 text-sm text-slate-500">Set up the employee&apos;s shift pattern.</p>
          </header>
          <Field label="Shift assignment">
            <select
              className={inputClass}
              value={formData.shift}
              onChange={event => updateForm('shift', event.target.value)}
            >
              <option>Day Shift (8:00 AM - 5:00 PM)</option>
              <option>Evening Shift (1:00 PM - 10:00 PM)</option>
              <option>Night Shift (10:00 PM - 7:00 AM)</option>
            </select>
          </Field>
        </div>
      )
    }
    if (currentStep === 5) {
      return (
        <div className="space-y-6">
          <header>
            <h2 className="text-xl font-bold text-slate-900">Documents</h2>
            <p className="mt-1 text-sm text-slate-500">Attach identity cards, contracts, or certificates.</p>
          </header>
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-10 text-center transition hover:border-slate-500">
            <span className="text-sm font-semibold text-slate-700">Choose files to upload</span>
            <span className="mt-1 text-xs text-slate-500">PDF, image, or office documents</span>
            <input
              className="sr-only"
              type="file"
              multiple
              onChange={event => setDocuments(Array.from(event.target.files || []))}
            />
          </label>
          {documents.length > 0 && (
            <ul className="space-y-1 text-sm text-slate-600">
              {documents.map(file => (
                <li key={`${file.name}-${file.lastModified}`}>{file.name}</li>
              ))}
            </ul>
          )}
        </div>
      )
    }
    return (
      <div className="space-y-5">
        <header>
          <h2 className="text-xl font-bold text-slate-900">Review &amp; invite</h2>
          <p className="mt-1 text-sm text-slate-500">Confirm the details before sending the invitation.</p>
        </header>
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
          <p className="font-semibold">Ready to send the employee invitation.</p>
          <p className="mt-1 text-emerald-800">
            An invitation SMS will be sent to {formData.phone || 'the registered mobile number'} when you finish.
          </p>
        </div>
        <dl className="grid grid-cols-2 gap-3 text-sm">
          <dt className="text-slate-500">Position</dt>
          <dd className="text-right font-medium">{formData.jobPosition}</dd>
          <dt className="text-slate-500">Department</dt>
          <dd className="text-right font-medium">{formData.department}</dd>
          <dt className="text-slate-500">Branch</dt>
          <dd className="text-right font-medium">{formData.branch}</dd>
          <dt className="text-slate-500">Start date</dt>
          <dd className="text-right font-medium">{formData.startDate}</dd>
        </dl>
      </div>
    )
  }

  return (
    <div className="min-w-0 flex-1 bg-[#f8f7f4]">
      <div className="mx-auto max-w-[1440px] px-4 pb-12 pt-6 sm:px-6 xl:px-8">
        <header className="pb-4">
          <nav className="mb-1 flex items-center gap-2 text-xs font-medium text-slate-500">
            <button
              type="button"
              onClick={() => navigate('/employees')}
              className="font-medium text-blue-600 hover:underline"
            >
              Employees
            </button>
            <span>/</span>
            <span className="text-slate-700">Add employee</span>
          </nav>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">Add an employee</h1>
        </header>

        <div className="grid min-w-0 grid-cols-1 items-start gap-6 lg:grid-cols-[220px_minmax(0,1fr)] xl:grid-cols-[220px_minmax(0,1fr)_280px]">
          <div className="min-w-0 xl:pr-1">
            <StepTracker currentStep={currentStep} setCurrentStep={setCurrentStep} />
          </div>

          <section className="flex min-h-[480px] flex-col justify-between rounded-2xl border border-[#ede9e2] bg-white p-6 shadow-sm sm:min-h-[560px]">
            <div>{renderStep()}</div>
            <div className="mt-8 border-t border-[#f0ece5] pt-4">
              {saveMessage && (
                <p role="status" className="mb-3 text-xs text-slate-600">
                  {saveMessage}
                </p>
              )}
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
                <button
                  type="button"
                  disabled={currentStep === 1}
                  onClick={() => setCurrentStep(step => Math.max(1, step - 1))}
                  className="order-2 rounded-xl border border-[#e2ddd5] bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 sm:order-1"
                >
                  Back
                </button>
                <div className="order-1 flex flex-wrap gap-2 sm:order-2">
                  <button
                    type="button"
                    onClick={() => handleSave(true)}
                    className="rounded-xl border border-[#e2ddd5] bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    Save draft
                  </button>
                  {currentStep < 6 ? (
                    <button
                      type="button"
                      onClick={() => {
                        setSaveMessage('')
                        setCurrentStep(step => Math.min(6, step + 1))
                      }}
                      className="rounded-xl bg-[#0b1329] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-slate-800"
                    >
                      Continue to {stepTitles[currentStep]}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSave(false)}
                      className="rounded-xl bg-[#0b1329] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-slate-800"
                    >
                      Finish &amp; send invite
                    </button>
                  )}
                </div>
              </div>
            </div>
          </section>

          <aside className="grid min-w-0 gap-4 sm:grid-cols-2 lg:col-span-2 xl:col-span-1 xl:grid-cols-1 xl:pl-1">
            <SummaryCard formData={{ ...formData, employeeId }} />
          </aside>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#ede9e2] bg-white px-5 py-4 shadow-sm">
          <span className="text-xs font-semibold text-slate-500">Add employee</span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => navigate('/employees')}
              className="rounded-lg border border-[#e2ddd5] bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Go to employee list →
            </button>
            {[1, 2, 3].map(n => (
              <button
                key={n}
                type="button"
                onClick={() => goToPage(n)}
                className={
                  'grid h-8 w-8 place-items-center rounded-lg text-xs font-semibold transition ' +
                  (n === 1
                    ? 'bg-[#0b1329] text-white shadow-sm'
                    : 'border border-[#e2ddd5] bg-white text-slate-700 hover:bg-slate-50')
                }
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
