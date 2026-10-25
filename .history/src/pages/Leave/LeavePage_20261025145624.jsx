import { useEffect, useState } from 'react';

import {
CalendarDays,
Clock,
CheckCircle2,
XCircle,
Plus,
RefreshCw,
X,
} from 'lucide-react';

import { leaveService } from '@services/leaveService';
import { employeeService } from '@services/employeeService';

const tabs = ['Requests', 'My Leave', 'Balances'];

const initialForm = {
employeeId: '',
employeeName: '',
leaveType: 'Annual Leave',
startDate: '',
endDate: '',
reason: '',
};

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
{normalizedStatus.charAt(0).toUpperCase() +
normalizedStatus.slice(1)} </span>
);
}

export default function LeavePage() {
const [activeTab, setActiveTab] = useState('Requests');
const [requests, setRequests] = useState([]);
const [employees, setEmployees] = useState([]);

const [loading, setLoading] = useState(true);
const [employeesLoading, setEmployeesLoading] = useState(true);
const [error, setError] = useState('');

const [showForm, setShowForm] = useState(false);
const [saving, setSaving] = useState(false);
const [formError, setFormError] = useState('');
const [successMessage, setSuccessMessage] = useState('');
const [form, setForm] = useState(initialForm);

const [processingId, setProcessingId] = useState('');
const [selectedRequest, setSelectedRequest] = useState(null);
const [actionError, setActionError] = useState('');
const [rejectingRequest, setRejectingRequest] = useState(null);
const [rejectionReason, setRejectionReason] = useState('');

async function loadRequests() {
setLoading(true);
setError('');


try {
  const data = await leaveService.getRequests();
  setRequests(data);
} catch (err) {
  console.error('Failed to load leave requests:', err);
  setError('Unable to load leave requests. Please try again.');
} finally {
  setLoading(false);
}


}

async function loadEmployees() {
setEmployeesLoading(true);


try {
  const data = await employeeService.getAll();
  setEmployees(data);
} catch (err) {
  console.error('Failed to load employees:', err);
  setFormError(
    'Unable to load employees. Please close the form and try again.'
  );
} finally {
  setEmployeesLoading(false);
}


}

useEffect(() => {
loadRequests();
loadEmployees();
}, []);

function openForm() {
setForm(initialForm);
setFormError('');
setSuccessMessage('');
setShowForm(true);
}

function closeForm() {
if (saving) return;


setShowForm(false);
setFormError('');


}

function handleChange(event) {
const { name, value } = event.target;


if (name === 'employeeId') {
  const selectedEmployee = employees.find(
    (employee) => employee.id === value
  );

  setForm((previous) => ({
    ...previous,
    employeeId: value,
    employeeName: selectedEmployee
      ? selectedEmployee.name ||
        selectedEmployee.fullName ||
        selectedEmployee.displayName ||
        ''
      : '',
  }));

  return;
}

setForm((previous) => ({
  ...previous,
  [name]: value,
}));


}

const days =
form.startDate && form.endDate
? Math.round(
(new Date(`${form.endDate}T00:00:00`) -
new Date(`${form.startDate}T00:00:00`)) /
(1000 * 60 * 60 * 24)
) + 1
: 0;

async function handleSubmit(event) {
event.preventDefault();
setFormError('');
setSuccessMessage('');


if (!form.employeeId) {
  setFormError('Please select an employee.');
  return;
}

if (!form.startDate || !form.endDate) {
  setFormError('Please select both the start date and end date.');
  return;
}

if (days < 1) {
  setFormError('The end date cannot be before the start date.');
  return;
}

if (!form.reason.trim()) {
  setFormError('Please provide a reason for the leave request.');
  return;
}

setSaving(true);

try {
  await leaveService.createRequest({
    ...form,
    reason: form.reason.trim(),
    days,
  });

  setShowForm(false);
  setForm(initialForm);
  setSuccessMessage('Leave request submitted successfully.');

  await loadRequests();
} catch (err) {
  console.error('Failed to submit leave request:', err);
  setFormError(
    'Unable to submit your leave request. Please check your connection and try again.'
  );
} finally {
  setSaving(false);
}


}
async function handleApprove(request) {
  const confirmed = window.confirm(
    `Are you sure you want to approve ${request.employeeName || 'this employee'}'s leave request?`
  );

  if (!confirmed) return;

  setProcessingId(request.id);
  setActionError('');
  setSuccessMessage('');

  try {
    await leaveService.approve(request.id);
    await loadRequests();
    setSuccessMessage('Leave request approved successfully.');
  } catch (err) {
    console.error('Failed to approve leave request:', err);
    setActionError('Unable to approve the leave request. Please try again.');
  } finally {
    setProcessingId('');
  }
}

function startReject(request) {
  setRejectingRequest(request);
  setRejectionReason('');
  setActionError('');
  setSuccessMessage('');
}

async function handleReject(event) {
  event.preventDefault();

  if (!rejectingRequest) return;

  setProcessingId(rejectingRequest.id);
  setActionError('');
  setSuccessMessage('');

  try {
    await leaveService.reject(
      rejectingRequest.id,
      rejectionReason.trim()
    );

    setRejectingRequest(null);
    setRejectionReason('');

    await loadRequests();
    setSuccessMessage('Leave request rejected successfully.');
  } catch (err) {
    console.error('Failed to reject leave request:', err);
    setActionError('Unable to reject the leave request. Please try again.');
  } finally {
    setProcessingId('');
  }
}


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
Attendance & HR Management </p>


        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
          Leave Management
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Manage employee leave requests and track their status.
        </p>
      </div>

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
          onClick={openForm}
          className="flex items-center gap-2 rounded-xl bg-[#0b1329] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          <Plus size={16} />
          Apply for Leave
        </button>
      </div>
    </div>

    
{successMessage && (
  <div className="mb-5 flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-700">
    <span>{successMessage}</span>

    <button
      type="button"
      onClick={() => setSuccessMessage('')}
      aria-label="Dismiss success message"
    >
      <X size={16} />
    </button>
  </div>
)}

{actionError && !rejectingRequest && (
  <div className="mb-5 flex items-center justify-between rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
    <span>{actionError}</span>

    <button
      type="button"
      onClick={() => setActionError('')}
      aria-label="Dismiss error message"
    >
      <X size={16} />
    </button>
  </div>
)}


    <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <div className="rounded-2xl bg-[#0b1329] p-5 text-white shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-slate-300">
            Total Requests
          </p>
          <CalendarDays size={20} className="text-slate-300" />
        </div>

        <p className="mt-4 text-4xl font-extrabold">{requests.length}</p>

        <p className="mt-2 text-xs text-slate-400">
          All submitted requests
        </p>
      </div>

      <div className="rounded-2xl border border-[#ede9e2] bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-slate-500">Pending</p>
          <Clock size={20} className="text-amber-600" />
        </div>

        <p className="mt-4 text-4xl font-extrabold text-amber-600">
          {pendingCount}
        </p>

        <p className="mt-2 text-xs text-slate-400">
          Awaiting a decision
        </p>
      </div>

      <div className="rounded-2xl border border-[#ede9e2] bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-slate-500">Approved</p>
          <CheckCircle2 size={20} className="text-emerald-600" />
        </div>

        <p className="mt-4 text-4xl font-extrabold text-emerald-600">
          {approvedCount}
        </p>

        <p className="mt-2 text-xs text-slate-400">
          Approved requests
        </p>
      </div>

      <div className="rounded-2xl border border-[#ede9e2] bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-slate-500">Rejected</p>
          <XCircle size={20} className="text-red-600" />
        </div>

        <p className="mt-4 text-4xl font-extrabold text-red-600">
          {rejectedCount}
        </p>

        <p className="mt-2 text-xs text-slate-400">
          Rejected requests
        </p>
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
              <CalendarDays
                className="mx-auto mb-3 text-slate-300"
                size={36}
              />

              <h3 className="font-semibold text-slate-800">
                No leave requests yet
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Submitted leave applications will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px] text-left text-sm">
                <thead className="bg-[#fbfaf8] text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="px-5 py-4">Employee</th>
                    <th className="px-5 py-4">Leave Type</th>
                    <th className="px-5 py-4">Start Date</th>
                    <th className="px-5 py-4">End Date</th>
                    <th className="px-5 py-4">Days</th>
                    <th className="px-5 py-4">Reason</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Rejection Reason</th>
                    <th className="px-5 py-4">Actions</th>


                  </tr>
                </thead>

                <tbody className="divide-y divide-[#f5f2eb]">
                  {requests.map((request) => (
                    <tr
                      key={request.id}
                      className="transition hover:bg-slate-50/70"
                    >
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
<td className="max-w-[220px] px-5 py-4 text-sm text-slate-600">
  {request.status?.toLowerCase() === 'rejected'
    ? request.rejectionReason || 'No reason provided'
    : '—'}
</td>

<td className="px-5 py-4">
  <div className="flex items-center gap-2">
    <button
      type="button"
      onClick={() => setSelectedRequest(request)}
      className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-100"
    >
      View Details
    </button>

{request.status?.toLowerCase() === 'pending' ? (
  <>
    <button
      type="button"
      onClick={() => handleApprove(request)}
      disabled={processingId === request.id}
      className="rounded-lg bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 disabled:opacity-50"
    >
      {processingId === request.id ? 'Processing...' : 'Approve'}
    </button>

    <button
      type="button"
      onClick={() => startReject(request)}
      disabled={processingId === request.id}
      className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-100 disabled:opacity-50"
    >
      Reject
    </button>
  </>
) : (
  <span className="text-xs text-slate-400">Reviewed</span>
)}

  </div>
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
            Personal leave history will be added in a later step.
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

  {showForm && (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4">
      <div className="my-auto w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Apply for Leave
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Complete the details below to submit a request.
            </p>
          </div>

          <button
            type="button"
            onClick={closeForm}
            disabled={saving}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-50"
            aria-label="Close form"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          {formError && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {formError}
            </div>
          )}

          <div>
            <label
              htmlFor="employeeId"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Employee
            </label>

            <select
              id="employeeId"
              name="employeeId"
              value={form.employeeId}
              onChange={handleChange}
              disabled={employeesLoading || saving}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500 disabled:bg-slate-50"
            >
              <option value="">
                {employeesLoading
                  ? 'Loading employees...'
                  : 'Select an employee'}
              </option>

              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.name ||
                    employee.fullName ||
                    employee.displayName ||
                    employee.email ||
                    employee.id}
                </option>
              ))}
            </select>

            {!employeesLoading && employees.length === 0 && (
              <p className="mt-2 text-xs text-amber-700">
                No employees were found. Check that your employee records
                are available.
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="leaveType"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Leave Type
            </label>

            <select
              id="leaveType"
              name="leaveType"
              value={form.leaveType}
              onChange={handleChange}
              disabled={saving}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
            >
              <option>Annual Leave</option>
              <option>Sick Leave</option>
              <option>Maternity Leave</option>
              <option>Paternity Leave</option>
              <option>Unpaid Leave</option>
              <option>Compassionate Leave</option>
              <option>Other</option>
            </select>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="startDate"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Start Date
              </label>

              <input
                id="startDate"
                name="startDate"
                type="date"
                value={form.startDate}
                
                onChange={(event) => {
  console.log('Selected start date:', event.target.value);
  handleChange(event);
}}
                disabled={saving}
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-500"
              />
            </div>

            <div>
              <label
                htmlFor="endDate"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                End Date
              </label>

              <input
                id="endDate"
                name="endDate"
                type="date"
                value={form.endDate}
                
                onChange={handleChange}
                disabled={saving}
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-500"
              />
            </div>
          </div>

          {days > 0 && (
            <div className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
              Requested duration:{' '}
              <span className="font-bold">
                {days} {days === 1 ? 'day' : 'days'}
              </span>
            </div>
          )}

          <div>
            <label
              htmlFor="reason"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Reason for Leave
            </label>

            <textarea
              id="reason"
              name="reason"
              value={form.reason}
              onChange={handleChange}
              disabled={saving}
              required
              rows={4}
              placeholder="Explain why you are requesting leave..."
              className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-500"
            />
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={closeForm}
              disabled={saving}
              className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving || employeesLoading || employees.length === 0}
              className="rounded-xl bg-[#0b1329] px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )}
  
{rejectingRequest && (
  <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 p-4">
    <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Reject Leave Request
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {rejectingRequest.employeeName || 'Employee'} —{' '}
            {rejectingRequest.leaveType || rejectingRequest.type || 'Leave'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            if (processingId) return;
            setRejectingRequest(null);
            setRejectionReason('');
            setActionError('');
          }}
          disabled={Boolean(processingId)}
          aria-label="Close rejection form"
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-50"
        >
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleReject} className="space-y-5 p-6">
        {actionError && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {actionError}
          </div>
        )}

        <div>
          <label
            htmlFor="rejectionReason"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Reason for rejection
          </label>

          <textarea
            id="rejectionReason"
            value={rejectionReason}
            onChange={(event) => setRejectionReason(event.target.value)}
            disabled={Boolean(processingId)}
            rows={4}
            placeholder="Explain why this leave request is being rejected..."
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-500 disabled:bg-slate-50"
          />

          <p className="mt-2 text-xs text-slate-500">
            Providing a reason helps the employee understand the decision.
          </p>
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
          <button
            type="button"
            onClick={() => {
              if (processingId) return;
              setRejectingRequest(null);
              setRejectionReason('');
              setActionError('');
            }}
            disabled={Boolean(processingId)}
            className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={Boolean(processingId)}
            className="rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {processingId ? 'Rejecting...' : 'Confirm Rejection'}
          </button>
        </div>
      </form>
    </div>
  </div>
)}
</div>


);
}
