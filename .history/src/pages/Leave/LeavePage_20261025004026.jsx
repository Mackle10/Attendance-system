import { useEffect, useState } from 'react';
import { CalendarDays, Clock, CheckCircle2, XCircle, Plus, RefreshCw } from 'lucide-react';
import { leaveService } from '@services/leaveService';

const tabs = ['Requests', 'My Leave', 'Balances'];

function StatusBadge({ status }) {
const normalizedStatus = (status || 'Pending').toLowerCase();

const styles = {
pending: 'bg-amber-100 text-amber-700',
approved: 'bg-emerald-100 text-emerald-700',
rejected: 'bg-red-100 text-red-700',
};

return (
<span
className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
        styles[normalizedStatus] || 'bg-slate-100 text-slate-600'
      }`}
>
{normalizedStatus.charAt(0).toUpperCase() + normalizedStatus.slice(1)} </span>
);
}

export default function LeavePage() {
const [activeTab, setActiveTab] = useState('Requests');
const [requests, setRequests] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState('');

async function loadRequests() {
setLoading(true);
setError('');

```
try {
  const data = await leaveService.getRequests();
  setRequests(data);
} catch (err) {
  console.error('Failed to load leave requests:', err);
  setError('Unable to load leave requests. Please try again.');
} finally {
  setLoading(false);
}
```

}

useEffect(() => {
loadRequests();
}, []);

const pendingCount = requests.filter(
(request) => request.status?.toLowerCase() === 'pending'
).length;

const approvedCount = requests.filter(
(request) => request.status?.toLowerCase() === 'approved'
).length;

const rejectedCount = requests.filter(
(request) => request.status?.toLowerCase() === 'rejected'
).length;

return ( <div className="min-h-screen bg-[#f8f7f4] px-4 py-6 sm:px-6 xl:px-8"> <div className="mx-auto max-w-[1440px]"> <div className="mb-7 flex flex-wrap items-center justify-between gap-4"> <div> <p className="mb-1 text-sm font-medium text-slate-500">
Attendance & HR Management </p> <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
Leave Management </h1> <p className="mt-2 text-sm text-slate-500">
Manage employee leave requests and track their status. </p> </div>

```
      <div className="flex gap-2">
        <button
          type="button"
          onClick={loadRequests}
          className="flex items-center gap-2 rounded-xl border border-[#e2ddd5] bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          <RefreshCw size={15} />
          Refresh
        </button>

        <button
          type="button"
          onClick={() => alert('We will build the leave application form next.')}
          className="flex items-center gap-2 rounded-xl bg-[#0b1329] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          <Plus size={16} />
          Apply for Leave
        </button>
      </div>
    </div>

    <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <div className="rounded-2xl bg-[#0b1329] p-5 text-white shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-slate-300">Total Requests</p>
          <CalendarDays size={20} className="text-slate-300" />
        </div>
        <p className="mt-4 text-4xl font-extrabold">{requests.length}</p>
        <p className="mt-2 text-xs text-slate-400">All submitted requests</p>
      </div>

      <div className="rounded-2xl border border-[#ede9e2] bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-slate-500">Pending</p>
          <Clock size={20} className="text-amber-600" />
        </div>
        <p className="mt-4 text-4xl font-extrabold text-amber-600">
          {pendingCount}
        </p>
        <p className="mt-2 text-xs text-slate-400">Awaiting a decision</p>
      </div>

      <div className="rounded-2xl border border-[#ede9e2] bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-slate-500">Approved</p>
          <CheckCircle2 size={20} className="text-emerald-600" />
        </div>
        <p className="mt-4 text-4xl font-extrabold text-emerald-600">
          {approvedCount}
        </p>
        <p className="mt-2 text-xs text-slate-400">Approved requests</p>
      </div>

      <div className="rounded-2xl border border-[#ede9e2] bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-slate-500">Rejected</p>
          <XCircle size={20} className="text-red-600" />
        </div>
        <p className="mt-4 text-4xl font-extrabold text-red-600">
          {rejectedCount}
        </p>
        <p className="mt-2 text-xs text-slate-400">Rejected requests</p>
      </div>
    </div>

    <div className="overflow-hidden rounded-2xl border border-[#ede9e2] bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#f0ece5] px-5 py-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Leave Overview
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Review requests and their current status.
          </p>
        </div>

        <div className="flex flex-wrap gap-1 rounded-xl bg-slate-100 p-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                activeTab === tab
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'Requests' && (
        <>
          {error && (
            <div className="m-5 rounded-xl bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {loading ? (
            <div className="px-5 py-16 text-center text-sm text-slate-500">
              Loading leave requests...
            </div>
          ) : requests.length === 0 ? (
            <div className="px-5 py-16 text-center">
              <CalendarDays className="mx-auto mb-3 text-slate-300" size={36} />
              <h3 className="font-semibold text-slate-800">
                No leave requests yet
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Submitted leave applications will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left text-sm">
                <thead className="bg-[#fbfaf8] text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="px-5 py-4">Employee</th>
                    <th className="px-5 py-4">Leave Type</th>
                    <th className="px-5 py-4">Start Date</th>
                    <th className="px-5 py-4">End Date</th>
                    <th className="px-5 py-4">Days</th>
                    <th className="px-5 py-4">Reason</th>
                    <th className="px-5 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f5f2eb]">
                  {requests.map((request) => (
                    <tr key={request.id} className="transition hover:bg-slate-50/70">
                      <td className="px-5 py-4 font-semibold text-slate-800">
                        {request.employeeName || 'Employee'}
                      </td>
                      <td className="px-5 py-4 text-slate-600">
                        {request.leaveType || request.type || '—'}
                      </td>
                      <td className="px-5 py-4 text-slate-600">
                        {request.startDate || '—'}
                      </td>
                      <td className="px-5 py-4 text-slate-600">
                        {request.endDate || '—'}
                      </td>
                      <td className="px-5 py-4 text-slate-600">
                        {request.days ?? '—'}
                      </td>
                      <td className="max-w-[220px] truncate px-5 py-4 text-slate-600">
                        {request.reason || '—'}
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={request.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {activeTab === 'My Leave' && (
        <div className="px-5 py-16 text-center">
          <p className="font-semibold text-slate-800">My Leave</p>
          <p className="mt-2 text-sm text-slate-500">
            Personal leave history will be added after the application form.
          </p>
        </div>
      )}

      {activeTab === 'Balances' && (
        <div className="px-5 py-16 text-center">
          <p className="font-semibold text-slate-800">Leave Balances</p>
          <p className="mt-2 text-sm text-slate-500">
            Leave allowances and remaining days will be added in a later step.
          </p>
        </div>
      )}
    </div>
  </div>
</div>


);
}
