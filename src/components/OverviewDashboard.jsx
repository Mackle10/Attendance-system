import React, { useState } from 'react';
import {
  Search,
  Bell,
  ChevronDown,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

/* ─── Static data ─────────────────────────────────────────── */
const clockIns = [
  { time: '08:26', initials: 'RN', color: 'bg-blue-500',   name: 'Ruth Nabirye',    role: 'Human resources', branch: 'Kampala HQ',      method: 'Office device', status: 'late', lateMins: 26 },
  { time: '08:21', initials: 'IK', color: 'bg-purple-500', name: 'Ivan Kizza',       role: 'Field sales',     branch: 'Wakiso route',    method: 'GPS',           status: 'late', lateMins: 21 },
  { time: '08:14', initials: 'EA', color: 'bg-teal-500',   name: 'Esther Akello',   role: 'Finance',         branch: 'Kampala HQ',      method: 'Office device', status: 'late', lateMins: 14 },
  { time: '08:02', initials: 'DM', color: 'bg-orange-500', name: 'David Mugisha',   role: 'Warehouse',       branch: 'Mukono Warehouse',method: 'QR code',       status: 'ontime' },
  { time: '07:58', initials: 'SN', color: 'bg-green-500',  name: 'Sarah Namutebi', role: 'Sales',           branch: 'Ntinda Store',    method: 'QR code',       status: 'ontime' },
  { time: '07:51', initials: 'JO', color: 'bg-red-500',    name: 'Joseph Okello',  role: 'Drivers',         branch: 'Entebbe Depot',   method: 'GPS',           status: 'ontime' },
  { time: '07:44', initials: 'GA', color: 'bg-indigo-500', name: 'Grace Atim',     role: 'Warehouse',       branch: 'Mukono Warehouse',method: 'QR code',       status: 'ontime' },
];

const approvals = [
  { name: 'Annet Nakato',       detail: 'Annual leave · 5-9 Oct · 5 days' },
  { name: 'Brian Ssemwogerere', detail: 'Expense claim · Fuel · UGX 180,000' },
  { name: 'Grace Atim',         detail: 'Salary advance · UGX 400,000' },
  { name: 'Joseph Okello',      detail: 'Shift swap · Sat 3 Oct with P. Lubega' },
];

const branches = [
  { name: 'Kampala HQ',      onTime: 58, total: 64, pct: 91 },
  { name: 'Ntinda Store',    onTime: 22, total: 26, pct: 85 },
  { name: 'Mukono Warehouse',onTime: 24, total: 33, pct: 58 },
  { name: 'Entebbe Depot',   onTime:  8, total: 15, pct: 35 },
];

/* ─── Sub-components ──────────────────────────────────────── */
function StatCard({ bg, children }) {
  return (
    <div className={'flex-1 min-w-[160px] rounded-2xl p-4 sm:p-5 ' + bg}>
      {children}
    </div>
  );
}

function Badge({ status, mins }) {
  if (status === 'ontime') {
    return (
      <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">
        On time
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-semibold text-amber-700">
      Late {mins}m
    </span>
  );
}

/* ─── Main component ──────────────────────────────────────── */
export default function OverviewDashboard({ onNavigateToEmployees }) {
  const [branch, setBranch] = useState('All branches');

  return (
    <main className="min-h-screen min-w-0 flex-1 overflow-y-auto bg-[#f8f7f4]">

      {/* ── Top bar ─────────────────────────────────────────── */}
      <header className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-3 border-b border-[#ede9e2] bg-[#f8f7f4]/90 backdrop-blur-md px-4 py-3 sm:px-6 xl:px-8">
        {/* Date + greeting */}
        <div className="flex flex-col">
          <span className="text-xs text-slate-500 font-medium">Monday, 28 September 2026</span>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Good morning, Pafra
          </h1>
        </div>

        {/* Right side controls: Search, Branch, Bell, Review payroll */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          {/* Search */}
          <div className="relative min-w-[200px] sm:min-w-[240px] lg:min-w-[280px]">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              placeholder="Search people, tasks, payslips..."
              className="w-full rounded-xl border border-[#e2ddd5] bg-white py-2 pl-9 pr-3 text-xs text-slate-800 placeholder-slate-400 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-900/5 shadow-sm"
            />
          </div>

          {/* Branch selector */}
          <button
            type="button"
            onClick={() => setBranch(branch === 'All branches' ? 'Kampala HQ' : 'All branches')}
            className="flex items-center gap-2 rounded-xl border border-[#e2ddd5] bg-white px-3.5 py-2 text-xs font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50"
          >
            <span>{branch}</span>
            <ChevronDown size={13} className="text-slate-500" />
          </button>

          {/* Bell with orange notification dot */}
          <button
            type="button"
            className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-[#e2ddd5] bg-white text-slate-600 shadow-sm transition hover:bg-slate-50"
            aria-label="Notifications"
          >
            <Bell size={16} />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#f97316] ring-2 ring-white" />
          </button>

          {/* Review payroll button */}
          <button
            type="button"
            className="flex items-center gap-2 rounded-xl bg-[#0b1329] px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-800"
          >
            <span>Review payroll</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-[1440px] px-4 pb-12 pt-6 sm:px-6 xl:px-8">

        {/* ── Stat cards row (4 cards) ───────────────────────── */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          
          {/* Card 1: Present now (Navy Card) */}
          <div className="flex flex-col justify-between rounded-2xl bg-[#0b1329] p-5 shadow-sm text-white min-h-[140px]">
            <div>
              <p className="text-xs font-medium text-slate-400">Present now</p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-4xl font-extrabold tracking-tight sm:text-5xl">112</span>
                <span className="text-xs text-slate-400 font-medium">of 138 scheduled</span>
              </div>
            </div>
            {/* Underline bar: dark track with orange filled portion */}
            <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
              <div className="h-full rounded-full bg-[#e58c38]" style={{ width: '81%' }} />
            </div>
          </div>

          {/* Card 2: Late today */}
          <div className="flex flex-col justify-between rounded-2xl border border-[#ede9e2] bg-white p-5 shadow-sm min-h-[140px]">
            <div>
              <p className="text-xs font-medium text-slate-400">Late today</p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-[#965b2a] sm:text-5xl">9</span>
                <span className="text-xs text-slate-400 font-medium">avg 18 min</span>
              </div>
            </div>
            <p className="mt-3 text-xs text-slate-500 font-medium">Mukono Warehouse has 5 of them</p>
          </div>

          {/* Card 3: Absent · On leave */}
          <div className="flex flex-col justify-between rounded-2xl border border-[#ede9e2] bg-white p-5 shadow-sm min-h-[140px]">
            <div>
              <p className="text-xs font-medium text-slate-400">Absent · On leave</p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-slate-900 sm:text-5xl">10</span>
                <span className="text-2xl font-bold text-slate-400">·</span>
                <span className="text-4xl font-extrabold text-[#5b4a8e] sm:text-5xl">7</span>
              </div>
            </div>
            <p className="mt-3 text-xs text-slate-500 font-medium">4 absences not yet explained</p>
          </div>

          {/* Card 4: September payroll · due Wed */}
          <div className="flex flex-col justify-between rounded-2xl border border-[#ede9e2] bg-white p-5 shadow-sm min-h-[140px]">
            <div>
              <p className="text-xs font-medium text-slate-400">September payroll · due Wed</p>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="text-sm font-semibold text-slate-500">UGX</span>
                <span className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">48.26M</span>
              </div>
            </div>
            <p className="mt-3 text-xs font-semibold text-[#b45309]">
              Draft · 3 exceptions to resolve
            </p>
          </div>
        </div>

        {/* ── Two-column content area ───────────────────────── */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px] xl:grid-cols-[1fr_380px]">

          {/* ── Left: Live clock-ins ─────────────────────────── */}
          <div className="rounded-2xl border border-[#ede9e2] bg-white shadow-sm overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#f0ece5] px-5 py-4">
              <h2 className="text-base font-bold text-slate-900">Live clock-ins</h2>
              <button
                type="button"
                className="flex items-center gap-1 text-xs font-semibold text-blue-600 transition hover:text-blue-700"
              >
                Open attendance board <ExternalLink size={12} className="ml-0.5" />
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-xs">
                <thead>
                  <tr className="border-b border-[#f0ece5] text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-[#fbfaf8]">
                    <th className="px-5 py-3 text-left">Time</th>
                    <th className="px-4 py-3 text-left">Employee</th>
                    <th className="px-4 py-3 text-left">Branch</th>
                    <th className="px-4 py-3 text-left">Method</th>
                    <th className="px-5 py-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f5f2eb]">
                  {clockIns.map((row) => (
                    <tr
                      key={row.time + row.name}
                      onClick={() => onNavigateToEmployees && onNavigateToEmployees(row.name)}
                      className="cursor-pointer transition hover:bg-slate-50/70"
                    >
                      <td className="px-5 py-3.5 font-mono text-xs font-semibold text-slate-700">
                        {row.time}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#dbeafe] text-[11px] font-bold text-[#1e40af]">
                            {row.initials}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">{row.name}</p>
                            <p className="text-[11px] text-slate-400">{row.role}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-slate-600 font-medium">{row.branch}</td>
                      <td className="px-4 py-3.5 text-slate-600 font-medium">{row.method}</td>
                      <td className="px-5 py-3.5">
                        <Badge status={row.status} mins={row.lateMins} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Right column ────────────────────────────────── */}
          <div className="flex flex-col gap-6">

            {/* Needs your approval */}
            <div className="rounded-2xl border border-[#ede9e2] bg-white shadow-sm overflow-hidden">
              <div className="flex items-center justify-between border-b border-[#f0ece5] px-5 py-4">
                <h2 className="text-base font-bold text-slate-900">Needs your approval</h2>
                <span className="text-xs font-semibold text-blue-600">
                  6 pending ·{' '}
                  <button type="button" className="underline underline-offset-2 transition hover:text-blue-700">
                    view all
                  </button>
                </span>
              </div>

              <ul className="divide-y divide-[#f5f2eb]">
                {approvals.map((item) => (
                  <li key={item.name} className="flex items-center gap-3 px-5 py-3.5">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-slate-800">{item.name}</p>
                      <p className="text-[11px] text-slate-400">{item.detail}</p>
                    </div>
                    <div className="flex shrink-0 gap-1.5">
                      <button
                        type="button"
                        className="rounded-lg border border-[#e2ddd5] bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-700 transition hover:bg-slate-50"
                      >
                        Decline
                      </button>
                      <button
                        type="button"
                        className="rounded-lg bg-[#0b1329] px-3.5 py-1.5 text-[11px] font-semibold text-white transition hover:bg-slate-800"
                      >
                        Approve
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Attendance by branch */}
            <div className="rounded-2xl border border-[#ede9e2] bg-white shadow-sm overflow-hidden">
              <div className="flex items-center justify-between border-b border-[#f0ece5] px-5 py-4">
                <h2 className="text-base font-bold text-slate-900">Attendance by branch</h2>
                <button
                  type="button"
                  className="text-xs font-semibold text-blue-600 transition hover:text-blue-700"
                >
                  Reports
                </button>
              </div>

              <ul className="space-y-4 px-5 py-4">
                {branches.map((b) => {
                  const latePct = b.pct < 100 ? Math.min(25, 100 - b.pct) : 0;
                  return (
                    <li key={b.name}>
                      <div className="mb-1.5 flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-800">{b.name}</span>
                        <span className="text-slate-400 font-medium">{b.onTime} / {b.total}</span>
                      </div>
                      <div className="flex h-2 w-full overflow-hidden rounded-full bg-[#f1eee8]">
                        <div
                          className="h-full rounded-l-full bg-[#1c3faa] transition-all"
                          style={{ width: b.pct + '%' }}
                        />
                        {latePct > 0 && (
                          <div
                            className="h-full bg-[#f59e0b] transition-all"
                            style={{ width: latePct + '%' }}
                          />
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>

              {/* Legend */}
              <div className="flex items-center gap-5 border-t border-[#f0ece5] px-5 py-3">
                <span className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                  <span className="inline-block h-2.5 w-2.5 rounded-sm bg-[#1c3faa]" />
                  On time
                </span>
                <span className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                  <span className="inline-block h-2.5 w-2.5 rounded-sm bg-[#f59e0b]" />
                  Late
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
