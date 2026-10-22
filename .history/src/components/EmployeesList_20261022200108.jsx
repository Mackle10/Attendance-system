import React, { useState, useEffect } from 'react';
import {
  Search,
  ChevronDown,
  Upload,
  Download,
  Plus,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

import { employeeService } from '@services/employeeService';

/* ─── Employee data ──────────────────────────────────────── */




function StatusBadge({ status }) {
  if (status === 'Active') {
    return (
      <span className="inline-flex items-center rounded-full bg-[#e0f2fe] px-2.5 py-0.5 text-[11px] font-semibold text-[#0284c7]">
        Active
      </span>
    );
  }
  if (status === 'On leave') {
    return (
      <span className="inline-flex items-center rounded-full bg-[#ede9fe] px-2.5 py-0.5 text-[11px] font-semibold text-[#6366f1]">
        On leave
      </span>
    );
  }
  if (status === 'Probation') {
    return (
      <span className="inline-flex items-center rounded-full bg-[#fef3c7] px-2.5 py-0.5 text-[11px] font-semibold text-[#b45309]">
        Probation
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600">
      {status}
    </span>
  );
}

export default function EmployeesList({
  activeEmpPage = 2,
  onPageChange,
  onAddEmployee,
  onSelectEmployee,
}) {
const [activeTab, setActiveTab] = useState('Active');
const [checked, setChecked] = useState([]);
const [searchQuery, setSearchQuery] = useState('');

const [employees, setEmployees] = useState([]);
const tabs = [
  {
    label: 'Active',
    count: employees.filter((emp) => (emp.status || 'Active') === 'Active').length,
  },
  {
    label: 'Probation',
    count: employees.filter((emp) => emp.status === 'Probation').length,
  },
  {
    label: 'On leave',
    count: employees.filter((emp) => emp.status === 'On leave').length,
  },
  {
    label: 'Exited',
    count: employees.filter((emp) => emp.status === 'Exited').length,
  },
];
const [loading, setLoading] = useState(true);
const [error, setError] = useState('');
  {
    label: 'Active',
    count: employees.filter((emp) => (emp.status || 'Active') === 'Active').length,
  },
  {
    label: 'Probation',
    count: employees.filter((emp) => emp.status === 'Probation').length,
  },
  {
    label: 'On leave',
    count: employees.filter((emp) => emp.status === 'On leave').length,
  },
  {
    label: 'Exited',
    count: employees.filter((emp) => emp.status === 'Exited').length,
  },
];

useEffect(() => {
  async function loadEmployees() {
    try {
      setLoading(true);
      setError('');

      const data = await employeeService.getAll();
      setEmployees(data);
    } catch (err) {
      console.error('Failed to load employees:', err);
      setError('Could not load employees. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  loadEmployees();
}, []);

  const toggle = (id) =>
    setChecked((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

const filteredEmployees = employees.filter((emp) => {
  const name = emp.fullName || emp.name || '';
  const employeeNumber = emp.employeeNumber || '';
  const phone = emp.phone || '';
  const position = emp.position || '';
  const department = emp.department || '';

  const matchesSearch = [
    name,
    employeeNumber,
    emp.id,
    phone,
    position,
    department,
  ].some((value) =>
    String(value).toLowerCase().includes(searchQuery.toLowerCase())
  );

  const matchesStatus =
    activeTab === 'All' || (emp.status || 'Active') === activeTab;

  return matchesSearch && matchesStatus;
});

  return (
    <div className="min-w-0 flex-1 bg-[#f8f7f4]">
      <div className="mx-auto max-w-[1440px] px-4 pb-12 pt-6 sm:px-6 xl:px-8">

        {/* ── Page header ──────────────────────────────────── */}
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <nav className="mb-1 text-xs text-slate-500 font-medium">
              People · <span className="text-slate-700">Employees</span>
            </nav>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              {employees.length} {employees.length === 1 ? 'person' : 'people'} work here
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-xl border border-[#e2ddd5] bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              <span>Import from Excel</span>
            </button>
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-xl border border-[#e2ddd5] bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              <span>Export</span>
            </button>
            <button
              type="button"
              onClick={onAddEmployee}
              className="flex items-center gap-1.5 rounded-xl bg-[#0b1329] px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-800"
            >
              <Plus size={14} />
              <span>Add employee</span>
            </button>
          </div>
        </div>

        {/* ── Search + filter controls row ─────────────────── */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
            {/* Search */}
            <div className="relative min-w-[200px] max-w-xs flex-1">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Name, ID or phone"
                className="w-full rounded-xl border border-[#e2ddd5] bg-white py-2 pl-9 pr-3 text-xs text-slate-800 placeholder-slate-400 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-900/5 shadow-sm"
              />
            </div>

            {/* Dropdown filters */}
            {['Branch', 'Department', 'Type'].map((label) => (
              <button
                key={label}
                type="button"
                className="flex items-center gap-1.5 rounded-xl border border-[#e2ddd5] bg-white px-3.5 py-2 text-xs font-medium text-slate-600 shadow-sm transition hover:bg-slate-50"
              >
                <span className="text-slate-400">{label}</span>
                <span className="font-bold text-slate-800">All</span>
                <ChevronDown size={12} className="text-slate-400" />
              </button>
            ))}
          </div>

          {/* Status pill tabs */}
          <div className="flex items-center gap-1.5 rounded-xl border border-[#e2ddd5] bg-[#f2eee7] p-1">
            {tabs.map((tab) => {
              const isSelected = activeTab === tab.label;
              return (
                <button
                  key={tab.label}
                  type="button"
                  onClick={() => setActiveTab(tab.label)}
                  className={
                    'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ' +
                    (isSelected
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900')
                  }
                >
                  <span>{tab.label}</span>
                  <span className={isSelected ? 'text-slate-800 font-bold' : 'text-slate-500 font-medium'}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Table container ──────────────────────────────── */}
        <div className="rounded-2xl border border-[#ede9e2] bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[840px] text-xs">
              <thead>
                <tr className="border-b border-[#f0ece5] text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-[#fbfaf8]">
                  <th className="w-10 py-3.5 pl-5 pr-2 text-left">
                    <input type="checkbox" className="rounded border-slate-300 text-slate-900 focus:ring-slate-900" />
                  </th>
                  <th className="px-4 py-3.5 text-left">EMPLOYEE</th>
                  <th className="px-4 py-3.5 text-left">ID</th>
                  <th className="px-4 py-3.5 text-left">POSITION</th>
                  <th className="px-4 py-3.5 text-left">DEPARTMENT</th>
                  <th className="px-4 py-3.5 text-left">BRANCH</th>
                  <th className="px-4 py-3.5 text-left">TYPE</th>
                  <th className="px-4 py-3.5 text-left">STARTED</th>
                  <th className="px-5 py-3.5 text-left">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f5f2eb]">
                {loading && (
  <tr>
    <td colSpan={9} className="px-5 py-10 text-center text-slate-500">
      Loading employees...
    </td>
  </tr>
)}

{!loading && error && (
  <tr>
    <td colSpan={9} className="px-5 py-10 text-center text-red-600">
      {error}
    </td>
  </tr>
)}

{!loading && !error && filteredEmployees.length === 0 && (
  <tr>
    <td colSpan={9} className="px-5 py-10 text-center text-slate-500">
      No employees found. Add an employee record to get started.
    </td>
  </tr>
)}
                {filteredEmployees.map((emp) => (
                  <tr
                    key={emp.id}
                    className="cursor-pointer transition hover:bg-slate-50/80"
                    onClick={() => onSelectEmployee(emp)}
                  >
                    <td className="py-3.5 pl-5 pr-2" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={checked.includes(emp.id)}
                        onChange={() => toggle(emp.id)}
                        className="rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                      />
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#dbeafe] text-[11px] font-bold text-[#1e40af]">
                          {(emp.fullName || emp.name || 'U')
  .split(' ')
  .map((part) => part[0])
  .join('')
  .slice(0, 2)
  .toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{emp.fullName || emp.name || 'Unnamed employee'}</p>
                          <p className="text-[11px] text-slate-400">{emp.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 font-mono text-xs font-semibold text-slate-600">{emp.employeeNumber || emp.id}</td>
                    <td className="px-4 py-3.5 text-slate-800 font-medium">{emp.position || '-'}</td>
                    <td className="px-4 py-3.5 text-slate-600">{emp.department || '-'}</td>
                    <td className="px-4 py-3.5 text-slate-600">{emp.branch || '-'}</td>
                    <td className="px-4 py-3.5 text-slate-600">{emp.type || '-'}</td>
                    <td className="px-4 py-3.5 text-slate-500 font-medium">{emp.started || emp.startDate || '-'}</td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={emp.status || 'Active'} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── Pagination at the bottom ─────────────────────── */}
          <div className="flex flex-wrap items-center justify-between border-t border-[#f0ece5] px-5 py-4 gap-3 bg-[#fbfaf8]/50">
            <span className="text-xs text-slate-500 font-medium">Showing 1–12 of 138</span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => onPageChange && onPageChange(Math.max(1, activeEmpPage - 1))}
                className="grid h-8 w-8 place-items-center rounded-lg border border-[#e2ddd5] bg-white text-slate-600 transition hover:bg-slate-50 disabled:opacity-40"
                disabled={activeEmpPage === 1}
              >
                <ChevronLeft size={14} />
              </button>
              {[1, 2, 3].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => onPageChange && onPageChange(n)}
                  className={
                    'grid h-8 w-8 place-items-center rounded-lg text-xs font-semibold transition ' +
                    (activeEmpPage === n
                      ? 'bg-[#0b1329] text-white shadow-sm'
                      : 'border border-[#e2ddd5] bg-white text-slate-700 hover:bg-slate-50')
                  }
                >
                  {n}
                </button>
              ))}
              <button
                type="button"
                onClick={() => onPageChange && onPageChange(Math.min(3, activeEmpPage + 1))}
                className="grid h-8 w-8 place-items-center rounded-lg border border-[#e2ddd5] bg-white text-slate-600 transition hover:bg-slate-50 disabled:opacity-40"
                disabled={activeEmpPage === 3}
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
