import React, { useState } from 'react';
import { Search, ChevronDown, Upload, Download, Plus, ChevronLeft, ChevronRight } from 'lucide-react';

/* ─── Employee data ──────────────────────────────────────── */
export const employees = [
  { id: 'NF-0007', initials: 'RN', color: 'bg-blue-500',   name: 'Ruth Nabirye',      phone: '0772 418 903', position: 'HR Manager',           department: 'Human resources', branch: 'Kampala HQ',       type: 'Permanent', started: 'Mar 2019', status: 'Active' },
  { id: 'NF-0012', initials: 'EA', color: 'bg-teal-500',   name: 'Esther Akello',     phone: '0701 552 110', position: 'Finance Officer',       department: 'Finance',         branch: 'Kampala HQ',       type: 'Permanent', started: 'Jan 2020', status: 'Active' },
  { id: 'NF-0019', initials: 'DM', color: 'bg-orange-500', name: 'David Mugisha',     phone: '0782 330 471', position: 'Warehouse Supervisor',  department: 'Warehouse',       branch: 'Mukono Warehouse', type: 'Permanent', started: 'Jun 2020', status: 'Active' },
  { id: 'NF-0044', initials: 'SN', color: 'bg-green-500',  name: 'Sarah Namutebi',   phone: '0756 907 214', position: 'Sales Associate',      department: 'Sales',           branch: 'Ntinda Store',     type: 'Permanent', started: 'Feb 2023', status: 'Active' },
  { id: 'NF-0051', initials: 'IK', color: 'bg-purple-500', name: 'Ivan Kizza',        phone: '0774 118 620', position: 'Field Sales Rep',      department: 'Sales',           branch: 'Wakiso route',     type: 'Contract',  started: 'Aug 2023', status: 'Active' },
  { id: 'NF-0058', initials: 'GA', color: 'bg-indigo-500', name: 'Grace Atim',        phone: '0703 845 996', position: 'Store Keeper',         department: 'Warehouse',       branch: 'Mukono Warehouse', type: 'Permanent', started: 'Nov 2023', status: 'Active' },
  { id: 'NF-0063', initials: 'JO', color: 'bg-red-500',    name: 'Joseph Okello',     phone: '0789 204 337', position: 'Driver',               department: 'Logistics',       branch: 'Entebbe Depot',    type: 'Contract',  started: 'Jan 2024', status: 'Active' },
  { id: 'NF-0070', initials: 'AN', color: 'bg-sky-500',    name: 'Annet Nakato',      phone: '0752 661 048', position: 'Accounts Assistant',   department: 'Finance',         branch: 'Kampala HQ',       type: 'Permanent', started: 'Apr 2024', status: 'On leave' },
  { id: 'NF-0091', initials: 'MW', color: 'bg-lime-600',   name: 'Moses Waiswa',      phone: '0776 093 582', position: 'Loader',               department: 'Warehouse',       branch: 'Mukono Warehouse', type: 'Casual',    started: 'Feb 2025', status: 'Active' },
  { id: 'NF-0104', initials: 'HN', color: 'bg-pink-500',   name: 'Harriet Nansubuga', phone: '0708 377 150', position: 'Cashier',              department: 'Sales',           branch: 'Ntinda Store',     type: 'Permanent', started: 'Jul 2025', status: 'Active' },
  { id: 'NF-0131', initials: 'FA', color: 'bg-amber-500',  name: 'Fiona Achieng',     phone: '0787 512 739', position: 'Sales Associate',      department: 'Sales',           branch: 'Kampala HQ',       type: 'Contract',  started: 'Aug 2026', status: 'Probation' },
  { id: 'NF-0138', initials: 'PL', color: 'bg-cyan-600',   name: 'Paul Lubega',       phone: '0759 428 061', position: 'Sales Associate',      department: 'Sales',           branch: 'Ntinda Store',     type: 'Contract',  started: 'Sep 2026', status: 'Probation' },
];

const tabs = [
  { label: 'Active',    count: 131 },
  { label: 'Probation', count: 5   },
  { label: 'On leave',  count: 7   },
  { label: 'Exited',    count: 12  },
];

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

  const toggle = (id) =>
    setChecked((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const filteredEmployees = employees.filter((emp) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      emp.name.toLowerCase().includes(q) ||
      emp.id.toLowerCase().includes(q) ||
      emp.phone.includes(q) ||
      emp.position.toLowerCase().includes(q) ||
      emp.department.toLowerCase().includes(q)
    );
  });

  return (
    <main className="min-h-screen min-w-0 flex-1 overflow-y-auto bg-[#f8f7f4]">
      <div className="mx-auto max-w-[1440px] px-4 pb-12 pt-6 sm:px-6 xl:px-8">

        {/* ── Page header ──────────────────────────────────── */}
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <nav className="mb-1 text-xs text-slate-500 font-medium">
              People · <span className="text-slate-700">Employees</span>
            </nav>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              138 people work here
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
                          {emp.initials}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{emp.name}</p>
                          <p className="text-[11px] text-slate-400">{emp.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 font-mono text-xs font-semibold text-slate-600">{emp.id}</td>
                    <td className="px-4 py-3.5 text-slate-800 font-medium">{emp.position}</td>
                    <td className="px-4 py-3.5 text-slate-600">{emp.department}</td>
                    <td className="px-4 py-3.5 text-slate-600">{emp.branch}</td>
                    <td className="px-4 py-3.5 text-slate-600">{emp.type}</td>
                    <td className="px-4 py-3.5 text-slate-500 font-medium">{emp.started}</td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={emp.status} />
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
    </main>
  );
}
