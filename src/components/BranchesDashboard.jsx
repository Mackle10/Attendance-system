import React from 'react';

const branches = [
  {
    name: 'Kampala HQ',
    address: 'Plot 12, Yusuf Lule Rd',
    staff: 64,
    manager: 'Ruth Nabirye',
    clockIn: 'Device + GPS 100 m',
    hours: '08:00–17:00 Mon–Fri',
  },
  {
    name: 'Ntinda Store',
    address: 'Ntinda Shopping Centre',
    staff: 26,
    manager: 'David Mugisha',
    clockIn: 'QR at counter',
    hours: '08:00–21:00 daily',
  },
  {
    name: 'Mukono Warehouse',
    address: 'Jinja Rd, Mukono',
    staff: 33,
    manager: 'Grace Atim',
    clockIn: 'QR + Face check',
    hours: '07:00–18:00 Mon–Sat',
  },
  {
    name: 'Entebbe Depot',
    address: 'Airport Rd, Entebbe',
    staff: 15,
    manager: 'John Bukenya',
    clockIn: 'GPS 150 m',
    hours: '08:00–17:00 Mon–Fri',
  },
];

const departments = [
  { name: 'Sales', head: 'Esther Akello', staff: 41, branchCount: 3 },
  { name: 'Warehouse', head: 'Grace Atim', staff: 30, branchCount: 1 },
  { name: 'Logistics', head: 'Martin Kato', staff: 22, branchCount: 2 },
  { name: 'Finance', head: 'Moses Waiswa', staff: 19, branchCount: 2 },
  { name: 'Operations', head: 'Sarah Namatovu', staff: 18, branchCount: 4 },
  { name: 'HR', head: 'Pafra K.', staff: 8, branchCount: 4 },
];

const positions = [
  { title: 'Sales Associate', department: 'Sales', grade: 'G2', payRange: '700K – 1.1M', filled: '24 / 26', hiring: true },
  { title: 'Loader', department: 'Warehouse', grade: 'G1', payRange: '450K – 650K', filled: '12 / 14', hiring: true },
  { title: 'Shift Supervisor', department: 'Operations', grade: 'G3', payRange: '1.2M – 1.6M', filled: '7 / 9', hiring: true },
  { title: 'Accounts Officer', department: 'Finance', grade: 'G3', payRange: '1.3M – 1.8M', filled: '5 / 7', hiring: true },
  { title: 'Store Manager', department: 'Sales', grade: 'G4', payRange: '2.0M – 2.8M', filled: '4 / 4', hiring: false },
  { title: 'Driver', department: 'Logistics', grade: 'G2', payRange: '800K – 1.0M', filled: '8 / 8', hiring: false },
];

export default function BranchesDashboard() {
  return (
    <main className="min-h-screen min-w-0 flex-1 overflow-y-auto bg-[#f5f6f8]">
      <div className="mx-auto max-w-[1440px] px-4 py-5 sm:px-6 xl:px-8">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">People · Structure</p>
            <h1 className="mt-1 text-[1.75rem] font-bold tracking-[-0.04em] text-slate-900 sm:text-[2rem]">
              Branches, departments &amp; positions
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 sm:px-4"
            >
              Add department
            </button>
            <button
              type="button"
              className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 sm:px-4"
            >
              Add position
            </button>
            <button
              type="button"
              className="rounded-xl bg-[#0b1329] px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 sm:px-4"
            >
              Add branch
            </button>
          </div>
        </div>

        {/* Branch cards — 4 across on xl, 2 on md, 1 on mobile */}
        <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {branches.map((branch) => (
            <article
              key={branch.name}
              className="flex flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h2 className="truncate text-base font-bold text-slate-900">{branch.name}</h2>
                  <p className="mt-0.5 truncate text-xs text-slate-500">{branch.address}</p>
                </div>
                <span className="shrink-0 text-2xl font-bold tracking-tight text-slate-900">{branch.staff}</span>
              </div>
              <dl className="mt-4 space-y-1.5 text-xs text-slate-600">
                <div className="flex gap-2">
                  <dt className="w-16 shrink-0 text-slate-400">Manager</dt>
                  <dd className="font-medium text-slate-700">{branch.manager}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="w-16 shrink-0 text-slate-400">Clock-in</dt>
                  <dd className="font-medium text-slate-700">{branch.clockIn}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="w-16 shrink-0 text-slate-400">Hours</dt>
                  <dd className="font-medium text-slate-700">{branch.hours}</dd>
                </div>
              </dl>
              <button
                type="button"
                className="mt-4 self-start text-xs font-semibold text-blue-700 hover:text-blue-900 hover:underline"
              >
                Edit geofence &amp; rules
              </button>
            </article>
          ))}
        </section>

        {/* Departments + Job positions — side by side on lg+, stacked on mobile */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <h2 className="text-lg font-bold text-slate-900">Departments</h2>
            <div className="table-scroll mt-4">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    <th className="pb-3 pr-3 font-semibold">Department</th>
                    <th className="pb-3 pr-3 font-semibold">Head</th>
                    <th className="pb-3 pr-3 font-semibold">Staff</th>
                    <th className="pb-3 font-semibold">Branches</th>
                  </tr>
                </thead>
                <tbody>
                  {departments.map((dept) => (
                    <tr key={dept.name} className="border-t border-slate-100 text-slate-700">
                      <td className="py-3 pr-3 font-semibold text-slate-900">{dept.name}</td>
                      <td className="py-3 pr-3 whitespace-nowrap">{dept.head}</td>
                      <td className="py-3 pr-3">{dept.staff}</td>
                      <td className="py-3">{dept.branchCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
              <h2 className="text-lg font-bold text-slate-900">Job positions</h2>
              <p className="text-xs text-slate-500">Pay ranges feed into payroll</p>
            </div>
            <div className="table-scroll mt-4">
              <table className="min-w-[480px] w-full text-left text-sm">
                <thead>
                  <tr className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    <th className="pb-3 pr-3 font-semibold">Position</th>
                    <th className="pb-3 pr-3 font-semibold">Department</th>
                    <th className="pb-3 pr-3 font-semibold">Grade</th>
                    <th className="pb-3 pr-3 font-semibold">Pay range (UGX)</th>
                    <th className="pb-3 font-semibold">Filled</th>
                  </tr>
                </thead>
                <tbody>
                  {positions.map((pos) => (
                    <tr key={pos.title} className="border-t border-slate-100 text-slate-700">
                      <td className="py-3 pr-3 font-semibold text-slate-900 whitespace-nowrap">{pos.title}</td>
                      <td className="py-3 pr-3">{pos.department}</td>
                      <td className="py-3 pr-3">{pos.grade}</td>
                      <td className="py-3 pr-3 whitespace-nowrap">{pos.payRange}</td>
                      <td className="py-3 whitespace-nowrap">
                        <span className={pos.hiring ? 'text-amber-700' : 'text-slate-600'}>
                          {pos.filled}
                          {pos.hiring && <span className="font-medium"> · hiring</span>}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
