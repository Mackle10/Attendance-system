import React, { useState } from 'react';

const categories = [
  { name: 'All documents', count: 412 },
  { name: 'Company policies', count: 14 },
  { name: 'Employment contracts', count: 138 },
  { name: 'ID & NSSF records', count: 131 },
  { name: 'Certificates', count: 76 },
  { name: 'Disciplinary', count: 9 },
  { name: 'Payslip archive', count: 44 },
];

const documents = [
  {
    id: 1,
    name: 'Employee handbook 2026',
    type: 'PDF',
    belongsTo: 'Company',
    category: 'Policy',
    uploaded: '12 Jan',
    expires: '—',
    viewer: 'Everyone',
    status: 'Published',
    tone: 'published',
  },
  {
    id: 2,
    name: 'Fuel & transport policy',
    type: 'PDF',
    belongsTo: 'Company',
    category: 'Policy',
    uploaded: '3 Aug',
    expires: '—',
    viewer: 'Everyone',
    status: 'Published',
    tone: 'published',
  },
  {
    id: 3,
    name: 'Employment contract',
    type: 'DOC',
    belongsTo: 'Ivan Kizza',
    category: 'Contract',
    uploaded: '1 Aug 2023',
    expires: '31 Oct 2026',
    viewer: 'Employee + HR',
    status: 'Ends soon',
    tone: 'endsSoon',
    expiresWarn: true,
  },
  {
    id: 4,
    name: 'Employment contract',
    type: 'DOC',
    belongsTo: 'Joseph Okello',
    category: 'Contract',
    uploaded: '8 Jan 2024',
    expires: '14 Oct 2026',
    viewer: 'Employee + HR',
    status: 'Ends soon',
    tone: 'endsSoon',
    expiresWarn: true,
  },
  {
    id: 5,
    name: 'Employment contract',
    type: 'DOC',
    belongsTo: 'Paul Lubega',
    category: 'Contract',
    uploaded: '14 Sep 2026',
    expires: '13 Sep 2027',
    viewer: 'Employee + HR',
    status: 'Awaiting signature',
    tone: 'awaiting',
  },
  {
    id: 6,
    name: 'National ID copy',
    type: 'JPG',
    belongsTo: 'Sarah Namutebi',
    category: 'ID',
    uploaded: '6 Feb 2023',
    expires: '—',
    viewer: 'HR only',
    status: 'Verified',
    tone: 'verified',
  },
  {
    id: 7,
    name: 'Driving permit',
    type: 'PDF',
    belongsTo: 'Joseph Okello',
    category: 'Licence',
    uploaded: '8 Jan 2024',
    expires: '2 Oct 2026',
    viewer: 'HR only',
    status: 'Expires in 4 days',
    tone: 'expires',
    expiresWarn: true,
  },
  {
    id: 8,
    name: 'Medical fitness form',
    type: 'PDF',
    belongsTo: 'Sarah Namutebi',
    category: 'Health',
    uploaded: '—',
    expires: '—',
    viewer: 'HR only',
    status: 'Missing',
    tone: 'missing',
  },
  {
    id: 9,
    name: 'Warning letter - lateness',
    type: 'PDF',
    belongsTo: 'Moses Waiswa',
    category: 'Disciplinary',
    uploaded: '19 Sep',
    expires: '—',
    viewer: 'Employee + HR',
    status: 'Acknowledged',
    tone: 'acknowledged',
  },
  {
    id: 10,
    name: 'Diploma in accounting',
    type: 'PDF',
    belongsTo: 'Esther Akello',
    category: 'Certificate',
    uploaded: '2 Jan 2020',
    expires: '—',
    viewer: 'HR only',
    status: 'Verified',
    tone: 'verified',
  },
  {
    id: 11,
    name: 'Job offer letter',
    type: 'PDF',
    belongsTo: 'Fiona Acheng',
    category: 'Contract',
    uploaded: '20 Aug',
    expires: '—',
    viewer: 'Employee + HR',
    status: 'Signed',
    tone: 'signed',
  },
];

const statusClasses = {
  published: 'bg-sky-50 text-sky-800',
  endsSoon: 'bg-amber-50 text-amber-800',
  awaiting: 'bg-violet-50 text-violet-800',
  verified: 'bg-sky-50 text-sky-800',
  expires: 'bg-rose-50 text-rose-800',
  missing: 'bg-rose-50 text-rose-700',
  acknowledged: 'bg-blue-50 text-blue-800',
  signed: 'bg-slate-100 text-slate-700',
};

const typeIconColor = {
  PDF: 'bg-blue-50 text-blue-700 border-blue-100',
  DOC: 'bg-indigo-50 text-indigo-700 border-indigo-100',
  JPG: 'bg-emerald-50 text-emerald-700 border-emerald-100',
};

export default function DocumentsDashboard() {
  const [activeCategory, setActiveCategory] = useState('All documents');

  return (
    <div className="min-w-0 flex-1 bg-[#f3f4f6]">
      <div className="mx-auto max-w-[1440px] px-4 py-5 sm:px-6 xl:px-8">
        {/* Header */}
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">People · Documents</p>
            <h1 className="mt-1 text-[1.75rem] font-bold tracking-[-0.04em] text-slate-900 sm:text-[2rem]">
              Documents &amp; contracts
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 sm:px-4"
            >
              Contract templates
            </button>
            <button
              type="button"
              className="rounded-xl bg-[#0b1329] px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 sm:px-4"
            >
              Upload document
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[240px_minmax(0,1fr)]">
          {/* Left column: categories + needs attention */}
          <aside className="flex flex-col gap-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
              <div className="space-y-1">
                {categories.map((category) => {
                  const active = activeCategory === category.name;
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
                      <span className="shrink-0 text-xs tabular-nums text-slate-500">({category.count})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-2xl border border-amber-100 bg-[#fdf6ee] p-4 shadow-sm">
              <h2 className="text-sm font-bold text-slate-900">Needs attention</h2>
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                <li>3 contracts end within 30 days</li>
                <li>5 staff are missing a required document</li>
              </ul>
              <button
                type="button"
                className="mt-3 text-sm font-semibold text-blue-700 underline underline-offset-2 hover:text-blue-900"
              >
                Remind by SMS
              </button>
            </div>
          </aside>

          {/* Documents table */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="table-scroll">
              <table className="min-w-[860px] w-full border-separate border-spacing-0 text-left text-sm">
                <thead>
                  <tr className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    <th className="border-b border-slate-100 px-4 py-3 font-semibold">Document</th>
                    <th className="border-b border-slate-100 px-4 py-3 font-semibold">Belongs to</th>
                    <th className="border-b border-slate-100 px-4 py-3 font-semibold">Type</th>
                    <th className="border-b border-slate-100 px-4 py-3 font-semibold">Uploaded</th>
                    <th className="border-b border-slate-100 px-4 py-3 font-semibold">Expires</th>
                    <th className="border-b border-slate-100 px-4 py-3 font-semibold">Who can see</th>
                    <th className="border-b border-slate-100 px-4 py-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="text-slate-700">
                  {documents.map((doc) => (
                    <tr key={doc.id} className="align-middle hover:bg-slate-50/60">
                      <td className="border-b border-slate-100 px-4 py-3">
                        <div className="flex items-center gap-3">
                          <span
                            className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg border text-[10px] font-bold ${
                              typeIconColor[doc.type] || 'bg-slate-50 text-slate-600 border-slate-200'
                            }`}
                          >
                            {doc.type}
                          </span>
                          <span className="font-semibold text-slate-800 whitespace-nowrap">{doc.name}</span>
                        </div>
                      </td>
                      <td className="border-b border-slate-100 px-4 py-3 whitespace-nowrap text-slate-600">
                        {doc.belongsTo}
                      </td>
                      <td className="border-b border-slate-100 px-4 py-3 whitespace-nowrap text-slate-600">
                        {doc.category}
                      </td>
                      <td className="border-b border-slate-100 px-4 py-3 whitespace-nowrap text-slate-600">
                        {doc.uploaded}
                      </td>
                      <td
                        className={`border-b border-slate-100 px-4 py-3 whitespace-nowrap ${
                          doc.expiresWarn ? 'font-medium text-amber-800' : 'text-slate-600'
                        }`}
                      >
                        {doc.expires}
                      </td>
                      <td className="border-b border-slate-100 px-4 py-3 whitespace-nowrap text-slate-600">
                        {doc.viewer}
                      </td>
                      <td className="border-b border-slate-100 px-4 py-3">
                        <span
                          className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                            statusClasses[doc.tone] || statusClasses.published
                          }`}
                        >
                          {doc.status}
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
    </div>
  );
}
