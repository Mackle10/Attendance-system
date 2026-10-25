
import { useCallback, useEffect, useState } from 'react';
import { RefreshCw, Clock, Users, UserCheck, UserX } from 'lucide-react';
import { employeeService } from '@services/employeeService';
import { attendanceService } from '@services/attendanceService';

function getToday() {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Africa/Kampala',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date());

  const values = Object.fromEntries(
    parts.map(({ type, value }) => [type, value]),
  );

  return `${values.year}-${values.month}-${values.day}`;
}

function formatTime(value) {
  if (!value) return '—';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return '—';

  return date.toLocaleTimeString('en-UG', {
    timeZone: 'Africa/Kampala',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

export default function AttendancePage() {
  const [employees, setEmployees] = useState([]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [workingId, setWorkingId] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const today = getToday();

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const [employeeData, attendanceData] = await Promise.all([
        employeeService.getAll(),
        attendanceService.getDaily(today),
      ]);

      setEmployees(employeeData);
      setRecords(attendanceData);
    } catch (err) {
      console.error('Failed to load attendance:', err);
      setError('Could not load attendance data. Check your Firebase connection and permissions.');
    } finally {
      setLoading(false);
    }
  }, [today]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const clockIn = async (employee) => {
    setWorkingId(employee.id);
    setError('');
    setMessage('');

    try {
      await attendanceService.clockIn(employee);
      setMessage(`${employee.fullName || employee.name} clocked in successfully.`);
      await loadData();
    } catch (err) {
      console.error('Clock-in failed:', err);
      setError(err.message || 'Could not record clock-in.');
    } finally {
      setWorkingId('');
    }
  };

  const clockOut = async (record) => {
    setWorkingId(record.id);
    setError('');
    setMessage('');

    try {
      await attendanceService.clockOut(record.id);
      setMessage(`${record.employeeName} clocked out successfully.`);
      await loadData();
    } catch (err) {
      console.error('Clock-out failed:', err);
      setError('Could not record clock-out.');
    } finally {
      setWorkingId('');
    }
  };

  const presentIds = new Set(records.map((record) => record.employeeId));

  const activeEmployees = employees.filter(
    (employee) => employee.status?.toLowerCase() === 'active',
  );

  const presentCount = records.length;
  const absentCount = Math.max(activeEmployees.length - presentCount, 0);
  const clockedOutCount = records.filter((record) => record.clockOut).length;

  const getRecord = (employeeId) =>
    records.find((record) => record.employeeId === employeeId);

  return (
    <div className="min-w-0 flex-1 bg-[#f8f7f4]">
      <div className="mx-auto max-w-[1440px] px-4 pb-12 pt-6 sm:px-6 xl:px-8">
        <header className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm text-slate-500">Attendance management</p>
            <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900">
              Attendance
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              {new Date(`${today}T12:00:00`).toLocaleDateString('en-UG', {
                timeZone: 'Africa/Kampala',
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>

          <button
            type="button"
            onClick={loadData}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </header>

        {error && (
          <div role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {message && (
          <div role="status" className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
            {message}
          </div>
        )}

        <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Summary
            title="Active employees"
            value={activeEmployees.length}
            icon={<Users size={20} />}
          />
          <Summary
            title="Present today"
            value={presentCount}
            icon={<UserCheck size={20} />}
          />
          <Summary
            title="Not clocked in"
            value={absentCount}
            icon={<UserX size={20} />}
          />
          <Summary
            title="Clocked out"
            value={clockedOutCount}
            icon={<Clock size={20} />}
          />
        </section>

        <section className="overflow-hidden rounded-2xl border border-[#ede9e2] bg-white shadow-sm">
          <div className="flex flex-col justify-between gap-2 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-bold text-slate-900">Today's attendance</h2>
              <p className="mt-1 text-sm text-slate-500">
                Employee clock-in and clock-out records
              </p>
            </div>
            <span className="text-sm text-slate-500">
              {records.length} record{records.length === 1 ? '' : 's'}
            </span>
          </div>

          {loading ? (
            <div className="p-10 text-center text-sm text-slate-500">
              Loading attendance...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Employee</th>
                    <th className="px-5 py-3 font-semibold">Department</th>
                    <th className="px-5 py-3 font-semibold">Branch</th>
                    <th className="px-5 py-3 font-semibold">Clock in</th>
                    <th className="px-5 py-3 font-semibold">Clock out</th>
                    <th className="px-5 py-3 font-semibold">Status</th>
                    <th className="px-5 py-3 font-semibold">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {activeEmployees.map((employee) => {
                    const record = getRecord(employee.id);
                    const isWorking = workingId === employee.id ||
                      workingId === record?.id;

                    return (
                      <tr key={employee.id} className="hover:bg-slate-50/70">
                        <td className="px-5 py-4">
                          <p className="font-semibold text-slate-900">
                            {employee.fullName || employee.name || 'Unnamed employee'}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {employee.employeeNumber || employee.email || '—'}
                          </p>
                        </td>

                        <td className="px-5 py-4 text-slate-600">
                          {employee.department || '—'}
                        </td>

                        <td className="px-5 py-4 text-slate-600">
                          {employee.branch || '—'}
                        </td>

                        <td className="px-5 py-4 text-slate-600">
                          {record ? formatTime(record.clockIn) : '—'}
                        </td>

                        <td className="px-5 py-4 text-slate-600">
                          {record ? formatTime(record.clockOut) : '—'}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                              !record
                                ? 'bg-slate-100 text-slate-600'
                                : record.clockOut
                                  ? 'bg-blue-50 text-blue-700'
                                  : 'bg-emerald-50 text-emerald-700'
                            }`}
                          >
                            {!record
                              ? 'Not clocked in'
                              : record.clockOut
                                ? 'Clocked out'
                                : 'Present'}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          {!record ? (
                            <button
                              type="button"
                              disabled={Boolean(workingId)}
                              onClick={() => clockIn(employee)}
                              className="rounded-lg bg-[#0b1329] px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
                            >
                              {isWorking ? 'Saving...' : 'Clock in'}
                            </button>
                          ) : !record.clockOut ? (
                            <button
                              type="button"
                              disabled={Boolean(workingId)}
                              onClick={() => clockOut(record)}
                              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                            >
                              {isWorking ? 'Saving...' : 'Clock out'}
                            </button>
                          ) : (
                            <span className="text-xs text-slate-400">
                              Completed
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}

                  {activeEmployees.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-5 py-10 text-center text-slate-500">
                        No active employees found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <p className="mt-4 text-xs leading-5 text-slate-500">
          This initial version records manual clock-ins and clock-outs.
          Lateness calculations, scheduled shifts, and automated absence
          tracking have not been implemented yet.
        </p>
      </div>
    </div>
  );
}

function Summary({ title, value, icon }) {
  return (
    <div className="rounded-2xl border border-[#ede9e2] bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <span className="text-slate-500">{icon}</span>
      </div>
      <p className="mt-4 text-3xl font-extrabold text-slate-900">{value}</p>
    </div>
  );
}