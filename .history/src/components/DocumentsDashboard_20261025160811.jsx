import React, { useEffect, useMemo, useState } from 'react'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore'
import { db } from '@services/firebase'
import {
  Search,
  Plus,
  FileText,
  Pencil,
  Trash2,
  X,
  CalendarClock,
  AlertTriangle,
  RefreshCw,
  Users,
} from 'lucide-react'

const CATEGORY_OPTIONS = [
  'Company policies',
  'Employment contracts',
  'ID & NSSF records',
  'Certificates',
  'Disciplinary',
  'Payslip archive',
  'Other',
]

const EMPTY_FORM = {
  name: '',
  category: 'Employment contracts',
  employeeId: '',
  employeeName: 'Company',
  uploadedDate: new Date().toISOString().slice(0, 10),
  expiryDate: '',
  visibility: 'HR only',
  status: 'Active',
  notes: '',
}

function getEmployeeName(employee) {
  return (
    employee.fullName ||
    employee.name ||
    [employee.firstName, employee.lastName].filter(Boolean).join(' ') ||
    employee.displayName ||
    employee.email ||
    'Unnamed employee'
  )
}

function getStatus(record) {
  if (record.status === 'Missing') return 'Missing'
  if (record.status === 'Awaiting signature') return 'Awaiting signature'
  if (record.status === 'Draft') return 'Draft'
  if (!record.expiryDate) return record.status || 'Active'

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const expiry = new Date(`${record.expiryDate}T00:00:00`)
  if (Number.isNaN(expiry.getTime())) return record.status || 'Active'

  const days = Math.ceil((expiry.getTime() - today.getTime()) / 86400000)
  if (days < 0) return 'Expired'
  if (days <= 30) return 'Expiring soon'
  return record.status || 'Active'
}

function formatDate(value) {
  if (!value) return '—'
  const date = new Date(`${value}T00:00:00`)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function statusClass(status) {
  if (status === 'Expired' || status === 'Missing') return 'bg-rose-50 text-rose-700'
  if (status === 'Expiring soon') return 'bg-amber-50 text-amber-800'
  if (status === 'Awaiting signature') return 'bg-violet-50 text-violet-800'
  if (status === 'Draft') return 'bg-slate-100 text-slate-700'
  return 'bg-emerald-50 text-emerald-800'
}

export default function DocumentsDashboard() {
  const [documents, setDocuments] = useState([])
  const [employees, setEmployees] = useState([])
  const [activeCategory, setActiveCategory] = useState('All documents')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [employeesLoading, setEmployeesLoading] = useState(true)
  const [error, setError] = useState('')
  const [employeesError, setEmployeesError] = useState('')
  const [saving, setSaving] = useState(false)
  const [notice, setNotice] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'documents'),
      (snapshot) => {
        setDocuments(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })))
        setLoading(false)
        setError('')
      },
      (firebaseError) => {
        console.error('Failed to load documents:', firebaseError)
        setError('Could not load documents. Check your Firestore permissions.')
        setLoading(false)
      }
    )

    return unsubscribe
  }, [])

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'employees'),
      (snapshot) => {
        setEmployees(
          snapshot.docs.map((item) => ({
            id: item.id,
            ...item.data(),
          }))
        )
        setEmployeesLoading(false)
        setEmployeesError('')
      },
      (firebaseError) => {
        console.error('Failed to load employees:', firebaseError)
        setEmployeesError('Employee list could not be loaded. You can still enter an employee name manually.')
        setEmployeesLoading(false)
      }
    )

    return unsubscribe
  }, [])

  const categoryItems = useMemo(() => {
    const all = [{ name: 'All documents', count: documents.length }]
    return all.concat(
      CATEGORY_OPTIONS.map((name) => ({
        name,
        count: documents.filter((item) => item.category === name).length,
      }))
    )
  }, [documents])

  const filteredDocuments = useMemo(() => {
    const term = search.trim().toLowerCase()
    return documents.filter((item) => {
      const categoryMatch =
        activeCategory === 'All documents' || item.category === activeCategory
      const searchable = [
        item.name,
        item.category,
        item.employeeName,
        item.visibility,
        getStatus(item),
        item.notes,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      return categoryMatch && (!term || searchable.includes(term))
    })
  }, [documents, activeCategory, search])

  const attentionDocuments = useMemo(
    () => documents.filter((item) => ['Expired', 'Expiring soon', 'Missing'].includes(getStatus(item))),
    [documents]
  )

  const openCreateModal = () => {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setNotice('')
    setModalOpen(true)
  }

  const openEditModal = (record) => {
    setEditingId(record.id)
    setForm({
      name: record.name || '',
      category: record.category || CATEGORY_OPTIONS[0],
      employeeId: record.employeeId || '',
      employeeName: record.employeeName || 'Company',
      uploadedDate: record.uploadedDate || '',
      expiryDate: record.expiryDate || '',
      visibility: record.visibility || 'HR only',
      status: record.status || 'Active',
      notes: record.notes || '',
    })
    setNotice('')
    setModalOpen(true)
  }

  const updateForm = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const handleEmployeeChange = (employeeId) => {
    const selected = employees.find((employee) => employee.id === employeeId)
    setForm((current) => ({
      ...current,
      employeeId,
      employeeName: selected ? getEmployeeName(selected) : 'Company',
    }))
  }

  const handleSave = async (event) => {
    event.preventDefault()
    setNotice('')

    const cleanName = form.name.trim()
    if (!cleanName) {
      setNotice('Enter a document name before saving.')
      return
    }

    if (form.expiryDate && form.uploadedDate && form.expiryDate < form.uploadedDate) {
      setNotice('The expiry date cannot be earlier than the upload date.')
      return
    }

    const selectedEmployee = employees.find((employee) => employee.id === form.employeeId)
    const payload = {
      name: cleanName,
      category: form.category,
      employeeId: selectedEmployee ? selectedEmployee.id : '',
      employeeName: selectedEmployee ? getEmployeeName(selectedEmployee) : (form.employeeName.trim() || 'Company'),
      uploadedDate: form.uploadedDate || '',
      expiryDate: form.expiryDate || '',
      visibility: form.visibility,
      status: form.status,
      notes: form.notes.trim(),
      updatedAt: serverTimestamp(),
    }

    setSaving(true)
    try {
      if (editingId) {
        await updateDoc(doc(db, 'documents', editingId), payload)
      } else {
        await addDoc(collection(db, 'documents'), {
          ...payload,
          createdAt: serverTimestamp(),
        })
      }
      setModalOpen(false)
      setForm(EMPTY_FORM)
      setEditingId(null)
      setNotice('')
    } catch (firebaseError) {
      console.error('Failed to save document:', firebaseError)
      setNotice('Could not save this record. Check your Firestore permissions and try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (record) => {
    const confirmed = window.confirm(`Delete "${record.name}"? This removes its Firestore record only.`)
    if (!confirmed) return

    try {
      await deleteDoc(doc(db, 'documents', record.id))
      setNotice('Document record deleted.')
      window.setTimeout(() => setNotice(''), 3500)
    } catch (firebaseError) {
      console.error('Failed to delete document:', firebaseError)
      setNotice('Could not delete this record. Check your Firestore permissions.')
    }
  }

  return (
    <div className="min-w-0 flex-1 bg-[#f3f4f6]">
      <div className="mx-auto max-w-[1440px] px-4 py-5 sm:px-6 xl:px-8">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">People · Documents</p>
            <h1 className="mt-1 text-[1.75rem] font-bold tracking-[-0.04em] text-slate-900 sm:text-[2rem]">
              Documents &amp; contracts
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage document records, employee associations, and expiry dates.
            </p>
          </div>
          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0b1329] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
          >
            <Plus size={17} />
            Add document
          </button>
        </div>

        {notice && (
          <div className="mb-4 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-800" role="status">
            {notice}
          </div>
        )}

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">Total records</p>
              <FileText className="text-slate-400" size={19} />
            </div>
            <p className="mt-2 text-2xl font-bold text-slate-900">{documents.length}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">Employee-linked</p>
              <Users className="text-slate-400" size={19} />
            </div>
            <p className="mt-2 text-2xl font-bold text-slate-900">
              {documents.filter((item) => item.employeeId).length}
            </p>
          </div>
          <div className="rounded-2xl border border-amber-100 bg-[#fdf6ee] p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-600">Needs attention</p>
              <AlertTriangle className="text-amber-700" size={19} />
            </div>
            <p className="mt-2 text-2xl font-bold text-slate-900">{attentionDocuments.length}</p>
            <p className="mt-1 text-xs text-slate-500">Expired, missing, or expiring within 30 days</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[240px_minmax(0,1fr)]">
          <aside className="flex flex-col gap-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
              <h2 className="mb-2 px-3 text-xs font-bold uppercase tracking-wide text-slate-400">
                Categories
              </h2>
              <div className="space-y-1">
                {categoryItems.map((category) => {
                  const active = activeCategory === category.name
                  return (
                    <button
                      key={category.name}
                      type="button"
                      onClick={() => setActiveCategory(category.name)}
                      className={[
                        'flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition',
                        active
                          ? 'bg-[#e8eefc] font-semibold text-slate-900'
                          : 'text-slate-600 hover:bg-slate-50',
                      ].join(' ')}
                    >
                      <span className="truncate pr-2">{category.name}</span>
                      <span className="shrink-0 text-xs tabular-nums text-slate-500">
                        {category.count}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="rounded-2xl border border-amber-100 bg-[#fdf6ee] p-4 shadow-sm">
              <div className="flex items-center gap-2">
                <CalendarClock size={18} className="text-amber-700" />
                <h2 className="text-sm font-bold text-slate-900">Needs attention</h2>
              </div>
              {loading ? (
                <p className="mt-3 text-sm text-slate-600">Checking expiry dates…</p>
              ) : attentionDocuments.length === 0 ? (
                <p className="mt-3 text-sm text-slate-600">No expired or soon-to-expire records.</p>
              ) : (
                <ul className="mt-3 space-y-2 text-sm text-slate-700">
                  {attentionDocuments.slice(0, 5).map((item) => (
                    <li key={item.id} className="border-b border-amber-100 pb-2 last:border-0">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-xs text-slate-500">
                        {item.employeeName || 'Company'} · {getStatus(item)}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </aside>

          <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-bold text-slate-900">{activeCategory}</h2>
                <p className="mt-1 text-xs text-slate-500">
                  {filteredDocuments.length} record{filteredDocuments.length === 1 ? '' : 's'}
                </p>
              </div>
              <div className="relative w-full sm:max-w-xs">
                <Search size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search documents or employees…"
                  aria-label="Search documents"
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center gap-2 p-12 text-sm text-slate-500">
                <RefreshCw size={16} className="animate-spin" />
                Loading documents…
              </div>
            ) : error ? (
              <div className="m-4 rounded-xl border border-rose-100 bg-rose-50 p-4 text-sm text-rose-700">
                {error}
              </div>
            ) : filteredDocuments.length === 0 ? (
              <div className="px-6 py-14 text-center">
                <FileText className="mx-auto text-slate-300" size={34} />
                <h3 className="mt-3 font-semibold text-slate-800">
                  {search || activeCategory !== 'All documents' ? 'No matching documents' : 'No documents yet'}
                </h3>
                <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
                  {search || activeCategory !== 'All documents'
                    ? 'Try a different search term or category.'
                    : 'Add a document record to start tracking contracts, certificates, IDs, policies, and expiry dates.'}
                </p>
                {!search && activeCategory === 'All documents' && (
                  <button
                    type="button"
                    onClick={openCreateModal}
                    className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#0b1329] px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
                  >
                    <Plus size={16} />
                    Add your first document
                  </button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] border-separate border-spacing-0 text-left text-sm">
                  <thead>
                    <tr className="bg-slate-50 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                      <th className="border-b border-slate-100 px-4 py-3">Document</th>
                      <th className="border-b border-slate-100 px-4 py-3">Belongs to</th>
                      <th className="border-b border-slate-100 px-4 py-3">Category</th>
                      <th className="border-b border-slate-100 px-4 py-3">Uploaded</th>
                      <th className="border-b border-slate-100 px-4 py-3">Expires</th>
                      <th className="border-b border-slate-100 px-4 py-3">Visibility</th>
                      <th className="border-b border-slate-100 px-4 py-3">Status</th>
                      <th className="border-b border-slate-100 px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDocuments.map((item) => {
                      const status = getStatus(item)
                      return (
                        <tr key={item.id} className="hover:bg-slate-50/70">
                          <td className="border-b border-slate-100 px-4 py-3">
                            <div className="flex items-center gap-3">
                              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-blue-100 bg-blue-50 text-blue-700">
                                <FileText size={17} />
                              </span>
                              <div>
                                <p className="font-semibold text-slate-800">{item.name || 'Untitled document'}</p>
                                {item.notes && <p className="mt-0.5 max-w-xs truncate text-xs text-slate-500">{item.notes}</p>}
                              </div>
                            </div>
                          </td>
                          <td className="whitespace-nowrap border-b border-slate-100 px-4 py-3 text-slate-600">
                            {item.employeeName || 'Company'}
                          </td>
                          <td className="whitespace-nowrap border-b border-slate-100 px-4 py-3 text-slate-600">
                            {item.category || 'Other'}
                          </td>
                          <td className="whitespace-nowrap border-b border-slate-100 px-4 py-3 text-slate-600">
                            {formatDate(item.uploadedDate)}
                          </td>
                          <td className="whitespace-nowrap border-b border-slate-100 px-4 py-3 text-slate-600">
                            {formatDate(item.expiryDate)}
                          </td>
                          <td className="whitespace-nowrap border-b border-slate-100 px-4 py-3 text-slate-600">
                            {item.visibility || 'HR only'}
                          </td>
                          <td className="border-b border-slate-100 px-4 py-3">
                            <span className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusClass(status)}`}>
                              {status}
                            </span>
                          </td>
                          <td className="border-b border-slate-100 px-4 py-3">
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => openEditModal(item)}
                                aria-label={`Edit ${item.name}`}
                                title="Edit record"
                                className="rounded-lg p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-700"
                              >
                                <Pencil size={16} />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDelete(item)}
                                aria-label={`Delete ${item.name}`}
                                title="Delete record"
                                className="rounded-lg p-2 text-slate-500 hover:bg-rose-50 hover:text-rose-700"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="document-modal-title"
            className="my-6 w-full max-w-2xl rounded-2xl bg-white shadow-2xl"
          >
            <div className="flex items-start justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
              <div>
                <h2 id="document-modal-title" className="text-lg font-bold text-slate-900">
                  {editingId ? 'Edit document record' : 'Add document record'}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Save document details to Firestore. This form does not upload a file.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                aria-label="Close form"
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={19} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 px-5 py-5 sm:px-6">
              <div>
                <label htmlFor="document-name" className="mb-1.5 block text-sm font-medium text-slate-700">
                  Document name <span className="text-rose-600">*</span>
                </label>
                <input
                  id="document-name"
                  required
                  maxLength={120}
                  value={form.name}
                  onChange={(event) => updateForm('name', event.target.value)}
                  placeholder="e.g. Employment contract"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="document-category" className="mb-1.5 block text-sm font-medium text-slate-700">
                    Category
                  </label>
                  <select
                    id="document-category"
                    value={form.category}
                    onChange={(event) => updateForm('category', event.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  >
                    {CATEGORY_OPTIONS.map((category) => <option key={category}>{category}</option>)}
                  </select>
                </div>

                <div>
                  <label htmlFor="document-employee" className="mb-1.5 block text-sm font-medium text-slate-700">
                    Associate employee
                  </label>
                  <select
                    id="document-employee"
                    value={form.employeeId}
                    onChange={(event) => handleEmployeeChange(event.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="">Company / not linked to an employee</option>
                    {employees.map((employee) => (
                      <option key={employee.id} value={employee.id}>
                        {getEmployeeName(employee)}
                      </option>
                    ))}
                  </select>
                  {employeesLoading && <p className="mt-1 text-xs text-slate-500">Loading employees…</p>}
                  {employeesError && <p className="mt-1 text-xs text-amber-700">{employeesError}</p>}
                </div>

                <div>
                  <label htmlFor="document-uploaded" className="mb-1.5 block text-sm font-medium text-slate-700">
                    Document date
                  </label>
                  <input
                    id="document-uploaded"
                    type="date"
                    value={form.uploadedDate}
                    onChange={(event) => updateForm('uploadedDate', event.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label htmlFor="document-expiry" className="mb-1.5 block text-sm font-medium text-slate-700">
                    Expiry date (optional)
                  </label>
                  <input
                    id="document-expiry"
                    type="date"
                    value={form.expiryDate}
                    onChange={(event) => updateForm('expiryDate', event.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label htmlFor="document-visibility" className="mb-1.5 block text-sm font-medium text-slate-700">
                    Who can see it?
                  </label>
                  <select
                    id="document-visibility"
                    value={form.visibility}
                    onChange={(event) => updateForm('visibility', event.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  >
                    <option>HR only</option>
                    <option>Employee + HR</option>
                    <option>Everyone</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="document-status" className="mb-1.5 block text-sm font-medium text-slate-700">
                    Record status
                  </label>
                  <select
                    id="document-status"
                    value={form.status}
                    onChange={(event) => updateForm('status', event.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  >
                    <option>Active</option>
                    <option>Draft</option>
                    <option>Awaiting signature</option>
                    <option>Missing</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="document-notes" className="mb-1.5 block text-sm font-medium text-slate-700">
                  Notes (optional)
                </label>
                <textarea
                  id="document-notes"
                  rows={3}
                  maxLength={500}
                  value={form.notes}
                  onChange={(event) => updateForm('notes', event.target.value)}
                  placeholder="Add any useful notes about this record"
                  className="w-full resize-y rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {notice && (
                <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700" role="alert">
                  {notice}
                </p>
              )}

              <div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-[#0b1329] px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? 'Saving…' : editingId ? 'Save changes' : 'Save document record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
