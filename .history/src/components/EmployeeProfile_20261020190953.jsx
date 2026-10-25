import React, { useState } from 'react';
import { ChevronLeft, MessageSquare, RefreshCw, Pencil } from 'lucide-react';

/* ─── Tabs ────────────────────────────────────────────────── */
const TABS = ['Overview', 'Employment & contract', 'Attendance', 'Schedule', 'Leave', 'Pay & payslips', 'Documents', 'Performance', 'Activity'];

/* ─── September attendance grid data ─────────────────────── */
/* ─── September attendance grid data matching Image 3 ──────── */
const septGridRow1 = ['on', 'on', 'on', 'on', 'on', 'late', 'on'];
const septGridRow2 = ['on', 'on', 'on', 'on', 'leave', 'leave', 'leave'];

function DaySquare({ type }) {
  const cls = {
    on: 'bg-[#1c3faa]',
    late: 'bg-[#f59e0b]',
    leave: 'bg-[#818cf8]',
  }[type] || 'bg-[#1c3faa]';
  return <span className={'inline-block h-4 w-7 sm:w-8 rounded-sm ' + cls} />;
}

function LeaveBar({ label, left, total }) {
  const pct = Math.round(((total - left) / total) * 100);
  return (
    <li>
      <div className="mb-1.5 flex items-center justify-between text-xs">
        <span className="font-semibold text-slate-800">{label}</span>
        <span className="text-slate-400 font-medium">
          {left} of {total} days left
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#f1eee8]">
        <div className="h-full rounded-full bg-[#1c3faa]" style={{ width: Math.max(15, 100 - pct) + '%' }} />
      </div>
    </li>
  );
}

/* ─── Main Component ───────────────────────────────────────── */
export default function EmployeeProfile({
  employee,
  onBack,
  activeEmpPage = 3,
  onPageChange,
}) {
  const [activeTab, setActiveTab] = useState('Overview');

  // Sarah Namutebi is the default matching Image 3
  const emp = employee || {
    initials: 'SN',
    name: 'Sarah Namutebi',
    status: 'Active',
    position: 'Sales Associate',
    department: 'Sales',
    branch: 'Ntinda Store',
    id: 'NF-0044',
    phone: '0756 907 214',
    email: 'sarah.n@nilefresh.co.ug',
  };

  return (
    <div className="min-w-0 flex-1 bg-[#f8f7f4]">
      <div className="mx-auto max-w-[1440px] px-4 pb-12 pt-6 sm:px-6 xl:px-8">

        {/* ── Breadcrumb ─────────────────────────────────── */}
        <nav className="mb-4 flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1 font-semibold text-blue-600 transition hover:text-blue-700"
          >
            Employees
          </button>
          <span>/</span>
          <span className="text-slate-700">{emp.name}</span>
        </nav>

        {/* ── Profile header card ───────────────────────── */}
        <div className="mb-6 rounded-2xl border border-[#ede9e2] bg-white px-6 py-5 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex flex-wrap items-start gap-4">
              {/* Dark Navy Avatar */}
              <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-[#0b1329] text-xl font-extrabold text-white">
                {emp.initials}
              </div>

              {/* Name + meta */}
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                    {emp.name}
                  </h1>
                  <span className="inline-flex items-center rounded-full bg-[#e0f2fe] px-2.5 py-0.5 text-[11px] font-semibold text-[#0284c7]">
                    {emp.status || 'Active'}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">Clocked in 07:58</span>
                </div>
                <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500 font-medium">
                  <span>{emp.position || 'Sales Associate'}</span>
                  <span>·</span>
                  <span>{emp.department || 'Sales'}</span>
                  <span>·</span>
                  <span>{emp.branch || 'Ntinda Store'}</span>
                  <span>·</span>
                  <span className="font-mono">{emp.id}</span>
                  <span>·</span>
                  <span>{emp.phone}</span>
                  <span>·</span>
                  <span>{emp.email || 'sarah.n@nilefresh.co.ug'}</span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex shrink-0 flex-wrap gap-2.5">
              <button
                type="button"
                className="rounded-xl border border-[#e2ddd5] bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                Send message
              </button>
              <button
                type="button"
                className="rounded-xl border border-[#e2ddd5] bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                Reset app login
              </button>
              <button
                type="button"
                className="rounded-xl bg-[#0b1329] px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-800"
              >
                Edit profile
              </button>
            </div>
          </div>

          {/* Tabs row */}
          <div className="mt-6 flex gap-6 overflow-x-auto border-t border-[#f0ece5] pt-1">
            {TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={
                  'shrink-0 border-b-2 py-3 text-xs font-semibold transition ' +
                  (activeTab === tab
                    ? 'border-[#0b1329] text-slate-900 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800')
                }
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* ── Overview tab content grid (Matching Image 3) ── */}
        {activeTab === 'Overview' && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">

            {/* 1. Employment */}
            <div className="rounded-2xl border border-[#ede9e2] bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-base font-bold text-slate-900">Employment</h2>
              <dl className="space-y-3 text-xs">
                {[
                  ['Position', emp.position || 'Sales Associate'],
                  ['Reports to', 'David Mugisha'],
                  ['Type', emp.type || 'Permanent'],
                  ['Started', '6 Feb 2023'],
                  ['Probation', 'Completed May 2023'],
                  ['Shift', 'Store day · 08:00–17:00'],
                  ['Clock-in', 'QR code · GPS'],
                  ['App access', 'Employee'],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between items-baseline gap-4">
                    <dt className="text-slate-500 font-medium">{label}</dt>
                    <dd className="font-semibold text-slate-900 text-right">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* 2. Personal & emergency */}
            <div className="rounded-2xl border border-[#ede9e2] bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-base font-bold text-slate-900">Personal &amp; emergency</h2>
              <dl className="space-y-3 text-xs">
                {[
                  ['Date of birth', '14 Aug 1998'],
                  ['Home', 'Kyanja, Kampala'],
                  ['National ID', 'On file · verified'],
                  ['NSSF', 'Registered'],
                  ['Emergency', 'Joan Nalubega · 0772 004 118'],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between items-baseline gap-4">
                    <dt className="text-slate-500 font-medium">{label}</dt>
                    <dd className="font-semibold text-slate-900 text-right">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* 3. Attendance September */}
            <div className="rounded-2xl border border-[#ede9e2] bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-900">Attendance · September</h2>
                <button type="button" className="text-xs font-semibold text-blue-600 transition hover:text-blue-700">
                  Timesheet
                </button>
              </div>

              {/* Stats row */}
              <div className="mb-4 flex items-baseline gap-6">
                <div>
                  <div className="flex items-baseline">
                    <span className="text-3xl font-extrabold text-slate-900">19</span>
                    <span className="text-lg font-bold text-slate-400">/20</span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-medium">Days present</p>
                </div>
                <div>
                  <p className="text-3xl font-extrabold text-slate-900">1</p>
                  <p className="text-[11px] text-slate-400 font-medium">Late arrival</p>
                </div>
                <div>
                  <p className="text-3xl font-extrabold text-slate-900">07:56</p>
                  <p className="text-[11px] text-slate-400 font-medium">Average clock-in</p>
                </div>
              </div>

              {/* Day grid: 2 rows of 7 pill squares */}
              <div className="space-y-1.5">
                <div className="flex gap-1.5">
                  {septGridRow1.map((type, i) => (
                    <DaySquare key={'r1-' + i} type={type} />
                  ))}
                </div>
                <div className="flex gap-1.5">
                  {septGridRow2.map((type, i) => (
                    <DaySquare key={'r2-' + i} type={type} />
                  ))}
                </div>
              </div>

              {/* Legend */}
              <div className="mt-4 flex items-center gap-4 text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1.5">
                  <span className="inline-block h-2 w-2 rounded-sm bg-[#1c3faa]" /> On time
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="inline-block h-2 w-2 rounded-sm bg-[#f59e0b]" /> Late
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="inline-block h-2 w-2 rounded-sm bg-[#818cf8]" /> Leave
                </span>
              </div>
            </div>

            {/* 4. Leave balances */}
            <div className="rounded-2xl border border-[#ede9e2] bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-900">Leave balances</h2>
                <button type="button" className="text-xs font-semibold text-blue-600 transition hover:text-blue-700">
                  History
                </button>
              </div>
              <ul className="space-y-4">
                <LeaveBar label="Annual" left={14} total={21} />
                <LeaveBar label="Sick" left={24} total={30} />
                <LeaveBar label="Compassionate" left={3} total={3} />
              </ul>
            </div>

            {/* 5. Pay (Dark Navy Card) */}
            <div className="rounded-2xl bg-[#0b1329] p-6 shadow-sm text-white flex flex-col justify-between">
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-base font-bold text-white">Pay</h2>
                  <button type="button" className="text-xs font-semibold text-blue-400 transition hover:text-blue-300">
                    Pay setup
                  </button>
                </div>
                <dl className="space-y-3 text-xs">
                  {[
                    ['Basic salary', 'UGX 900,000'],
                    ['Allowances', 'UGX 150,000'],
                    ['Paid to', 'MTN MoMo ···· 4471'],
                    ['Loans & advances', 'None'],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between items-baseline gap-4">
                      <dt className="text-slate-400 font-medium">{label}</dt>
                      <dd className="font-semibold text-slate-200 text-right">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
              <button
                type="button"
                className="mt-5 text-left text-xs font-semibold text-[#f59e0b] transition hover:text-amber-300 underline underline-offset-4"
              >
                Last payslip · August · UGX 794,500
              </button>
            </div>

            {/* 6. Open tasks */}
            <div className="rounded-2xl border border-[#ede9e2] bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-900">Open tasks</h2>
                <button type="button" className="text-xs font-semibold text-blue-600 transition hover:text-blue-700">
                  All tasks
                </button>
              </div>
              <ul className="divide-y divide-[#f5f2eb] text-xs">
                {[
                  ['Log damaged goods', 'Today 13:00'],
                  ['Close till report', 'Today 17:00'],
                ].map(([task, due]) => (
                  <li key={task} className="flex items-center justify-between py-3">
                    <span className="font-semibold text-slate-800">{task}</span>
                    <span className="text-slate-400 font-medium">{due}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 7. Documents */}
            <div className="rounded-2xl border border-[#ede9e2] bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-900">Documents</h2>
                <button type="button" className="text-xs font-semibold text-blue-600 transition hover:text-blue-700">
                  Upload
                </button>
              </div>
              <ul className="divide-y divide-[#f5f2eb] text-xs">
                {[
                  ['Employment contract', 'Signed', 'bg-[#e0f2fe] text-[#0284c7]'],
                  ['National ID copy', 'Verified', 'bg-[#e0f2fe] text-[#0284c7]'],
                  ['Academic certificate', 'Verified', 'bg-[#e0f2fe] text-[#0284c7]'],
                  ['Medical fitness form', 'Missing', 'bg-[#fef3c7] text-[#b45309]'],
                ].map(([doc, tag, cls]) => (
                  <li key={doc} className="flex items-center justify-between py-3">
                    <span className="font-semibold text-slate-800">{doc}</span>
                    <span className={'rounded-full px-2.5 py-0.5 text-[11px] font-semibold ' + cls}>
                      {tag}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 8. Performance */}
            <div className="rounded-2xl border border-[#ede9e2] bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-900">Performance</h2>
                <button type="button" className="text-xs font-semibold text-blue-600 transition hover:text-blue-700">
                  Reviews
                </button>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-4xl font-extrabold text-slate-900">4.2</span>
                <span className="text-base font-semibold text-slate-400">of 5</span>
                <span className="ml-1 text-xs text-slate-500 font-medium">· Q2 review by David Mugisha</span>
              </div>
              <p className="mt-4 text-xs text-slate-500 font-medium">Tasks on time 92% · Attendance score 96%</p>
            </div>

          </div>
        )}

        {/* ── Other tabs placeholder ────────────────────── */}
        {activeTab !== 'Overview' && (
          <div className="flex min-h-[360px] items-center justify-center rounded-2xl border border-[#ede9e2] bg-white shadow-sm">
            <p className="text-sm text-slate-400 font-medium">
              <span className="font-semibold text-slate-700">{activeTab}</span> details coming soon
            </p>
          </div>
        )}

        {/* ── Bottom pagination navigation bar ───────────── */}
        <div className="mt-8 flex flex-wrap items-center justify-between rounded-2xl border border-[#ede9e2] bg-white px-5 py-4 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Employees view:</span>
            <span className="text-xs font-bold text-slate-900">Page 3 of 3 (Employee Profile: Sarah Namutebi)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onPageChange && onPageChange(2)}
              className="rounded-lg border border-[#e2ddd5] bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Back to List (Page 2)
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
          </div>
        </div>

      </div>
    </div>
  );
}
