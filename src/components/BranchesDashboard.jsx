import React, { useEffect, useMemo, useState } from 'react';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import {
  Building2,
  Users,
  BriefcaseBusiness,
  Search,
  Plus,
  Pencil,
  Trash2,
  MapPin,
  Clock,
  UserRound,
  X,
  LoaderCircle,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { db } from '@services/firebase';

const COLLECTIONS = {
  branches: 'branches',
  departments: 'departments',
  positions: 'positions',
};

const INITIAL_DATA = {
  branches: [
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
  ],
  departments: [
    { name: 'Sales', head: 'Esther Akello', staff: 41, branchCount: 3 },
    { name: 'Warehouse', head: 'Grace Atim', staff: 30, branchCount: 1 },
    { name: 'Logistics', head: 'Martin Kato', staff: 22, branchCount: 2 },
    { name: 'Finance', head: 'Moses Waiswa', staff: 19, branchCount: 2 },
    { name: 'Operations', head: 'Sarah Namatovu', staff: 18, branchCount: 4 },
    { name: 'HR', head: 'Pafra K.', staff: 8, branchCount: 4 },
  ],
  positions: [
    {
      title: 'Sales Associate',
      department: 'Sales',
      grade: 'G2',
      payRange: '700K – 1.1M',
      filled: '24 / 26',
      hiring: true,
    },
    {
      title: 'Loader',
      department: 'Warehouse',
      grade: 'G1',
      payRange: '450K – 650K',
      filled: '12 / 14',
      hiring: true,
    },
    {
      title: 'Shift Supervisor',
      department: 'Operations',
      grade: 'G3',
      payRange: '1.2M – 1.6M',
      filled: '7 / 9',
      hiring: true,
    },
    {
      title: 'Accounts Officer',
      department: 'Finance',
      grade: 'G3',
      payRange: '1.3M – 1.8M',
      filled: '5 / 7',
      hiring: true,
    },
    {
      title: 'Store Manager',
      department: 'Sales',
      grade: 'G4',
      payRange: '2.0M – 2.8M',
      filled: '4 / 4',
      hiring: false,
    },
    {
      title: 'Driver',
      department: 'Logistics',
      grade: 'G2',
      payRange: '800K – 1.0M',
      filled: '8 / 8',
      hiring: false,
    },
  ],
};

const FORM_FIELDS = {
  branches: [
    { name: 'name', label: 'Branch name', required: true },
    { name: 'address', label: 'Address', required: true },
    { name: 'manager', label: 'Branch manager', required: true },
    {
      name: 'staff',
      label: 'Staff count',
      type: 'number',
      required: true,
    },
    { name: 'clockIn', label: 'Clock-in method', required: true },
    { name: 'hours', label: 'Working hours', required: true },
  ],
  departments: [
    { name: 'name', label: 'Department name', required: true },
    { name: 'head', label: 'Department head', required: true },
    {
      name: 'staff',
      label: 'Staff count',
      type: 'number',
      required: true,
    },
    {
      name: 'branchCount',
      label: 'Number of branches',
      type: 'number',
      required: true,
    },
  ],
  positions: [
    { name: 'title', label: 'Position title', required: true },
    { name: 'department', label: 'Department', required: true },
    { name: 'grade', label: 'Job grade', required: true },
    { name: 'payRange', label: 'Pay range (UGX)', required: true },
    { name: 'filled', label: 'Positions filled / available', required: true },
    {
      name: 'hiring',
      label: 'Currently hiring',
      type: 'checkbox',
    },
  ],
};

const LABELS = {
  branches: 'Branch',
  departments: 'Department',
  positions: 'Position',
};

const EMPTY_FORM = {
  branches: {
    name: '',
    address: '',
    manager: '',
    staff: 0,
    clockIn: '',
    hours: '',
  },
  departments: {
    name: '',
    head: '',
    staff: 0,
    branchCount: 0,
  },
  positions: {
    title: '',
    department: '',
    grade: '',
    payRange: '',
    filled: '',
    hiring: false,
  },
};

function MetricCard({ icon: Icon, label, value, detail }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-500">{label}</span>
        <span className="rounded-xl bg-slate-100 p-2.5 text-slate-700">
          <Icon size={19} />
        </span>
      </div>
      <p className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
        {value}
      </p>
      <p className="mt-1 text-xs text-slate-500">{detail}</p>
    </article>
  );
}

function EmptyState({ message }) {
  return (
    <div className="py-10 text-center">
      <Building2 className="mx-auto text-slate-300" size={32} />
      <p className="mt-3 text-sm text-slate-500">{message}</p>
    </div>
  );
}

export default function BranchesDashboard() {
  const [data, setData] = useState(INITIAL_DATA);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('branches');
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const unsubscribers = [];
    let pending = 3;
    let hasError = false;

    const finishLoading = () => {
      pending -= 1;

      if (pending === 0) {
        setLoading(false);
      }
    };

    Object.entries(COLLECTIONS).forEach(([key, collectionName]) => {
      const unsubscribe = onSnapshot(
        collection(db, collectionName),
        (snapshot) => {
          const records = snapshot.docs.map((item) => ({
            ...item.data(),
            id: item.id,
          }));

          setData((previous) => ({
            ...previous,
            [key]: records,
          }));

          finishLoading();
        },
        (firebaseError) => {
          console.error(`Failed to load ${collectionName}:`, firebaseError);

          if (!hasError) {
            hasError = true;
            setError(
              'Could not load all records from Firebase. Check your connection and Firestore permissions.',
            );
          }

          finishLoading();
        },
      );

      unsubscribers.push(unsubscribe);
    });

    return () => {
      unsubscribers.forEach((unsubscribe) => unsubscribe());
    };
  }, []);

  useEffect(() => {
    if (!notice) return undefined;

    const timer = setTimeout(() => setNotice(''), 3500);
    return () => clearTimeout(timer);
  }, [notice]);

  const currentRecords = data[activeTab];

  const filteredRecords = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return currentRecords;

    return currentRecords.filter((record) =>
      Object.entries(record).some(([key, value]) => {
        if (key === 'id' || typeof value === 'boolean') return false;

        return String(value ?? '')
          .toLowerCase()
          .includes(query);
      }),
    );
  }, [currentRecords, search]);

  const totalStaff = data.branches.reduce(
    (total, branch) => total + (Number(branch.staff) || 0),
    0,
  );

  function openAdd(type) {
    setActiveTab(type);
    setForm({ ...EMPTY_FORM[type] });
    setModal({ type, record: null });
    setError('');
  }

  function openEdit(type, record) {
    setActiveTab(type);
    setForm({ ...EMPTY_FORM[type], ...record });
    setModal({ type, record });
    setError('');
  }

  function closeModal() {
    if (saving) return;

    setModal(null);
    setForm({});
  }

  function updateField(name, value) {
    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSave(event) {
    event.preventDefault();

    if (!modal || saving) return;

    const { type, record } = modal;
    const collectionName = COLLECTIONS[type];

    const payload = { ...form };
    delete payload.id;

    for (const field of FORM_FIELDS[type]) {
      if (
        field.required &&
        String(payload[field.name] ?? '').trim() === ''
      ) {
        setError(`${field.label} is required.`);
        return;
      }
    }

    for (const field of FORM_FIELDS[type]) {
      if (field.type === 'number') {
        const value = Number(payload[field.name]);

        if (!Number.isFinite(value) || value < 0) {
          setError(`${field.label} must be zero or greater.`);
          return;
        }

        payload[field.name] = value;
      }
    }

    setSaving(true);
    setError('');

    try {
      if (record?.id) {
        await updateDoc(doc(db, collectionName, record.id), {
          ...payload,
          updatedAt: serverTimestamp(),
        });
      } else {
        await addDoc(collection(db, collectionName), {
          ...payload,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }

      setNotice(
        `${LABELS[type]} ${record?.id ? 'updated' : 'added'} successfully.`,
      );
      setModal(null);
      setForm({});
    } catch (firebaseError) {
      console.error('Unable to save record:', firebaseError);

      setError(
        firebaseError.code === 'permission-denied'
          ? 'Firebase denied this action. Check your Firestore security rules.'
          : 'Could not save this record. Check your internet connection and try again.',
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(type, record) {
    if (!record.id) {
      setError(
        'This record has no Firebase ID. It may be sample data rather than a saved Firestore record.',
      );
      return;
    }

    const name =
      record.name || record.title || 'this record';

    const confirmed = window.confirm(
      `Delete "${name}"? This action cannot be undone.`,
    );

    if (!confirmed) return;

    setError('');

    try {
      await deleteDoc(doc(db, COLLECTIONS[type], record.id));
      setNotice(`${LABELS[type]} deleted successfully.`);
    } catch (firebaseError) {
      console.error('Unable to delete record:', firebaseError);

      setError(
        firebaseError.code === 'permission-denied'
          ? 'Firebase denied this deletion. Check your Firestore security rules.'
          : 'Could not delete this record. Please try again.',
      );
    }
  }

  function renderActions(type, record) {
    return (
      <div className="flex items-center justify-end gap-1">
        <button
          type="button"
          onClick={() => openEdit(type, record)}
          title="Edit record"
          aria-label="Edit record"
          className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
        >
          <Pencil size={16} />
        </button>

        <button
          type="button"
          onClick={() => handleDelete(type, record)}
          title="Delete record"
          aria-label="Delete record"
          className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600"
        >
          <Trash2 size={16} />
        </button>
      </div>
    );
  }

  function renderBranches() {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {filteredRecords.map((branch) => (
          <article
            key={branch.id || branch.name}
            className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                  <Building2 size={20} />
                </div>

                <h3 className="break-words text-base font-bold text-slate-900">
                  {branch.name}
                </h3>

                <p className="mt-1 flex items-start gap-1.5 text-xs text-slate-500">
                  <MapPin className="mt-0.5 shrink-0" size={13} />
                  {branch.address}
                </p>
              </div>

              <div className="shrink-0 text-right">
                <p className="text-2xl font-bold text-slate-900">
                  {branch.staff ?? 0}
                </p>
                <p className="text-[11px] text-slate-500">Staff</p>
              </div>
            </div>

            <div className="my-4 border-t border-slate-100" />

            <dl className="space-y-3 text-xs">
              <div className="flex items-start gap-2">
                <UserRound className="mt-0.5 shrink-0 text-slate-400" size={14} />
                <div>
                  <dt className="text-slate-400">Branch manager</dt>
                  <dd className="mt-0.5 font-semibold text-slate-700">
                    {branch.manager}
                  </dd>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Clock className="mt-0.5 shrink-0 text-slate-400" size={14} />
                <div>
                  <dt className="text-slate-400">Working hours</dt>
                  <dd className="mt-0.5 font-medium text-slate-700">
                    {branch.hours}
                  </dd>
                </div>
              </div>

              <div>
                <dt className="text-slate-400">Clock-in method</dt>
                <dd className="mt-1 inline-flex rounded-lg bg-slate-100 px-2 py-1 font-medium text-slate-700">
                  {branch.clockIn}
                </dd>
              </div>
            </dl>

            <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-3 mt-5">
              <span className="text-xs font-medium text-slate-500">
                Branch settings
              </span>
              {renderActions('branches', branch)}
            </div>
          </article>
        ))}

        {filteredRecords.length === 0 && (
          <div className="col-span-full">
            <EmptyState message="No branches found. Try a different search or add a branch." />
          </div>
        )}
      </div>
    );
  }

  function renderTable(type) {
    if (type === 'departments') {
      return (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] uppercase tracking-wide text-slate-500">
                <th className="px-4 py-3 font-semibold">Department</th>
                <th className="px-4 py-3 font-semibold">Department head</th>
                <th className="px-4 py-3 font-semibold">Staff</th>
                <th className="px-4 py-3 font-semibold">Branches</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredRecords.map((department) => (
                <tr
                  key={department.id || department.name}
                  className="border-b border-slate-50 transition hover:bg-slate-50"
                >
                  <td className="px-4 py-4 font-semibold text-slate-900">
                    {department.name}
                  </td>
                  <td className="px-4 py-4 text-slate-600">
                    {department.head}
                  </td>
                  <td className="px-4 py-4 text-slate-600">
                    {department.staff ?? 0}
                  </td>
                  <td className="px-4 py-4 text-slate-600">
                    {department.branchCount ?? 0}
                  </td>
                  <td className="px-4 py-3">
                    {renderActions('departments', department)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredRecords.length === 0 && (
            <EmptyState message="No departments found." />
          )}
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-[11px] uppercase tracking-wide text-slate-500">
              <th className="px-4 py-3 font-semibold">Position</th>
              <th className="px-4 py-3 font-semibold">Department</th>
              <th className="px-4 py-3 font-semibold">Grade</th>
              <th className="px-4 py-3 font-semibold">Pay range</th>
              <th className="px-4 py-3 font-semibold">Filled</th>
              <th className="px-4 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredRecords.map((position) => (
              <tr
                key={position.id || position.title}
                className="border-b border-slate-50 transition hover:bg-slate-50"
              >
                <td className="px-4 py-4">
                  <p className="font-semibold text-slate-900">
                    {position.title}
                  </p>

                  <span
                    className={`mt-1 inline-flex rounded-full px-2 py-1 text-[10px] font-semibold ${
                      position.hiring
                        ? 'bg-amber-50 text-amber-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {position.hiring ? 'Hiring' : 'Not hiring'}
                  </span>
                </td>

                <td className="px-4 py-4 text-slate-600">
                  {position.department}
                </td>

                <td className="px-4 py-4 text-slate-600">
                  {position.grade}
                </td>

                <td className="whitespace-nowrap px-4 py-4 text-slate-600">
                  {position.payRange}
                </td>

                <td className="px-4 py-4 text-slate-600">
                  {position.filled}
                </td>

                <td className="px-4 py-3">
                  {renderActions('positions', position)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredRecords.length === 0 && (
          <EmptyState message="No positions found." />
        )}
      </div>
    );
  }

  const tabs = [
    { key: 'branches', label: 'Branches', count: data.branches.length },
    {
      key: 'departments',
      label: 'Departments',
      count: data.departments.length,
    },
    { key: 'positions', label: 'Job positions', count: data.positions.length },
  ];

  return (
    <div className="min-w-0 flex-1 bg-[#f5f6f8]">
      <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 xl:px-8">
        <header className="mb-7 flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
          <div>
            <p className="text-sm font-medium text-slate-500">
              People <span className="mx-1 text-slate-300">/</span> Structure
            </p>

            <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Branches &amp; organisation
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
              Manage your locations, departments, reporting structure and job
              positions from one place.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => openAdd('departments')}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              <Plus size={16} />
              Department
            </button>

            <button
              type="button"
              onClick={() => openAdd('positions')}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              <Plus size={16} />
              Position
            </button>

            <button
              type="button"
              onClick={() => openAdd('branches')}
              className="inline-flex items-center gap-2 rounded-xl bg-[#0b1329] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
            >
              <Plus size={16} />
              Add branch
            </button>
          </div>
        </header>

        {notice && (
          <div
            role="status"
            className="mb-5 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
          >
            <CheckCircle2 size={18} />
            {notice}
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="mb-5 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            <AlertCircle className="mt-0.5 shrink-0" size={18} />
            <span>{error}</span>
            <button
              type="button"
              onClick={() => setError('')}
              aria-label="Dismiss error"
              className="ml-auto rounded p-1 hover:bg-red-100"
            >
              <X size={16} />
            </button>
          </div>
        )}

        <section className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <MetricCard
            icon={Building2}
            label="Total branches"
            value={data.branches.length}
            detail="Locations in your organisation"
          />
          <MetricCard
            icon={Users}
            label="Staff across branches"
            value={totalStaff}
            detail="Based on the staff counts entered for each branch"
          />
          <MetricCard
            icon={BriefcaseBusiness}
            label="Job positions"
            value={data.positions.length}
            detail={`${data.positions.filter((position) => position.hiring).length} currently hiring`}
          />
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-100 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-1 rounded-xl bg-slate-100 p-1">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab.key);
                    setSearch('');
                  }}
                  className={`rounded-lg px-3 py-2 text-xs font-semibold transition sm:text-sm ${
                    activeTab === tab.key
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {tab.label}
                  <span className="ml-1.5 text-slate-400">
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <label className="relative block">
                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder={`Search ${activeTab}...`}
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100 sm:w-64"
                />
              </label>

              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  setError('');
                }}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
              >
                <RefreshCw size={15} />
                Reset search
              </button>
            </div>
          </div>

          <div className="p-4 sm:p-5">
            {loading ? (
              <div className="flex min-h-48 flex-col items-center justify-center gap-3 text-sm text-slate-500">
                <LoaderCircle className="animate-spin" size={25} />
                Loading organisation records...
              </div>
            ) : (
              <>
                {activeTab === 'branches' && renderBranches()}
                {activeTab !== 'branches' && renderTable(activeTab)}
              </>
            )}
          </div>

          <div className="flex flex-col gap-2 border-t border-slate-100 bg-slate-50/70 px-4 py-3 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <span>
              Showing {filteredRecords.length} of {currentRecords.length}{' '}
              {activeTab}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Live Firestore updates
            </span>
          </div>
        </section>
      </div>

      {modal && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeModal();
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="record-modal-title"
            className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-5 py-4 sm:px-6">
              <div>
                <h2
                  id="record-modal-title"
                  className="text-lg font-bold text-slate-900"
                >
                  {modal.record ? 'Edit' : 'Add'} {LABELS[modal.type]}
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Changes are saved to your Firestore database.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                aria-label="Close form"
                className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 disabled:opacity-50"
              >
                <X size={19} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-5 p-5 sm:p-6">
              {FORM_FIELDS[modal.type].map((field) => (
                <div key={field.name}>
                  {field.type === 'checkbox' ? (
                    <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-4">
                      <input
                        type="checkbox"
                        checked={Boolean(form[field.name])}
                        onChange={(event) =>
                          updateField(field.name, event.target.checked)
                        }
                        className="h-4 w-4 rounded border-slate-300 accent-slate-900"
                      />
                      <span className="text-sm font-medium text-slate-700">
                        {field.label}
                      </span>
                    </label>
                  ) : (
                    <>
                      <label
                        htmlFor={`field-${field.name}`}
                        className="mb-2 block text-sm font-semibold text-slate-700"
                      >
                        {field.label}
                        {field.required && (
                          <span className="ml-1 text-red-500">*</span>
                        )}
                      </label>

                      <input
                        id={`field-${field.name}`}
                        type={field.type || 'text'}
                        min={field.type === 'number' ? 0 : undefined}
                        step={field.type === 'number' ? 1 : undefined}
                        required={field.required}
                        value={form[field.name] ?? ''}
                        onChange={(event) =>
                          updateField(
                            field.name,
                            field.type === 'number'
                              ? event.target.value
                              : event.target.value,
                          )
                        }
                        className="w-full rounded-xl border border-slate-200 px-3.5 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                        placeholder={`Enter ${field.label.toLowerCase()}`}
                      />
                    </>
                  )}
                </div>
              ))}

              {modal.type === 'positions' && data.departments.length > 0 && (
                <p className="text-xs leading-5 text-slate-500">
                  Tip: use an existing department name to keep your
                  organisation structure consistent.
                </p>
              )}

              <div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0b1329] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving && (
                    <LoaderCircle className="animate-spin" size={16} />
                  )}
                  {saving ? 'Saving...' : 'Save changes'}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}
