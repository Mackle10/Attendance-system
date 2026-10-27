import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Users,
  Search,
  RefreshCw,
  TrendingUp,
  ClipboardCheck,
  Building2,
  ChevronRight,
  AlertCircle,
  Plus,
} from 'lucide-react'

import { employeeService } from '@services/employeeService'
import styles from './PerformancePage.module.css'
import { performanceService } from '@services/performanceService';

function getEmployeeName(employee) {
  const firstName = employee.firstName || employee.first_name || ''
  const lastName = employee.lastName || employee.last_name || ''

  return (
    employee.name ||
    employee.fullName ||
    `${firstName} ${lastName}`.trim() ||
    employee.email ||
    'Unnamed employee'
  )
}

function getEmployeeDepartment(employee) {
  return employee.department || employee.departmentName || 'Unassigned'
}

function getEmployeeBranch(employee) {
  return employee.branch || employee.branchName || 'Unassigned'
}

function getEmployeeStatus(employee) {
  return String(employee.status || 'Active')
}

export default function PerformancePage() {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [reviews, setReviews] = useState([])
  const [reviewsLoading, setReviewsLoading] = useState(true)
  const [reviewsError, setReviewsError] = useState('')

  const [search, setSearch] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('All departments')
  const [selectedBranch, setSelectedBranch] = useState('All branches')
  const [showReviewForm, setShowReviewForm] = useState(false);
const [savingReview, setSavingReview] = useState(false);
const [reviewError, setReviewError] = useState('');

const [reviewForm, setReviewForm] = useState({
  employeeId: '',
  period: 'Quarterly',
  reviewDate: new Date().toISOString().slice(0, 10),
  quality: 3,
  productivity: 3,
  communication: 3,
  teamwork: 3,
  strengths: '',
  improvements: '',
  managerComments: '',
  goals: '',
});

  async function loadEmployees() {
    try {
      setLoading(true)
      setError('')

      const records = await employeeService.getAll()
      setEmployees(records)
    } catch (err) {
      console.error('Failed to load employees:', err)
      setError('Could not load employees. Please try again.')
    } finally {
      setLoading(false)
    }
  }
  async function loadReviews() {
  try {
    setReviewsLoading(true)
    setReviewsError('')

    const records = await performanceService.getAll()
    setReviews(records)
  } catch (err) {
    console.error('Failed to load performance reviews:', err)
    setReviewsError('Could not load performance reviews.')
  } finally {
    setReviewsLoading(false)
  }
}

  useEffect(() => {
    loadEmployees()
  }, [])

  const departments = useMemo(
    () =>
      [...new Set(employees.map(getEmployeeDepartment))].sort(),
    [employees],
  )

  const branches = useMemo(
    () =>
      [...new Set(employees.map(getEmployeeBranch))].sort(),
    [employees],
  )

  const filteredEmployees = useMemo(() => {
    const searchTerm = search.trim().toLowerCase()
    
    return employees.filter((employee) => {
      const name = getEmployeeName(employee).toLowerCase()
      const email = String(employee.email || '').toLowerCase()
      const department = getEmployeeDepartment(employee)
      const branch = getEmployeeBranch(employee)

      const matchesSearch =
        !searchTerm ||
        name.includes(searchTerm) ||
        email.includes(searchTerm)

      const matchesDepartment =
        selectedDepartment === 'All departments' ||
        department === selectedDepartment

      const matchesBranch =
        selectedBranch === 'All branches' ||
        branch === selectedBranch

      return matchesSearch && matchesDepartment && matchesBranch
    })
  }, [employees, search, selectedDepartment, selectedBranch])
  

const handleSaveReview = async (status) => {
  if (!reviewForm.employeeId) {
    setReviewError('Please select an employee.');
    return;
  }

  if (!reviewForm.reviewDate) {
    setReviewError('Please select a review date.');
    return;
  }

  const selectedEmployee = employees.find(
    (employee) => employee.id === reviewForm.employeeId
  );

  if (!selectedEmployee) {
    setReviewError('The selected employee could not be found.');
    return;
  }

  try {
    setSavingReview(true);
    setReviewError('');

    const ratings = {
      quality: Number(reviewForm.quality),
      productivity: Number(reviewForm.productivity),
      communication: Number(reviewForm.communication),
      teamwork: Number(reviewForm.teamwork),
    };

    const overallScore =
      Object.values(ratings).reduce(
        (total, rating) => total + rating,
        0
      ) / Object.values(ratings).length;

    await performanceService.create({
      employeeId: selectedEmployee.id,
      employeeName: getEmployeeName(selectedEmployee),
      employeeDepartment: getEmployeeDepartment(selectedEmployee),
      period: reviewForm.period,
      reviewDate: reviewForm.reviewDate,
      ratings,
      overallScore: Number(overallScore.toFixed(1)),
      strengths: reviewForm.strengths.trim(),
      areasForImprovement: reviewForm.improvements.trim(),
      managerComments: reviewForm.managerComments.trim(),
      goals: reviewForm.goals.trim(),
      status,
    });

    setShowReviewForm(false);

    setReviewForm({
      employeeId: '',
      period: 'Quarterly',
      reviewDate: new Date().toISOString().slice(0, 10),
      quality: 3,
      productivity: 3,
      communication: 3,
      teamwork: 3,
      strengths: '',
      improvements: '',
      managerComments: '',
      goals: '',
    });
  } catch (error) {
    console.error('Error saving performance review:', error);

    setReviewError(
      error.message || 'Unable to save the review. Please try again.'
    );
  } finally {
    setSavingReview(false);
  }
};


  const activeEmployees = employees.filter(
    (employee) =>
      getEmployeeStatus(employee).toLowerCase() === 'active',
  ).length

  const inactiveEmployees = employees.length - activeEmployees
  // Performance review statistics
const completedReviews = reviews.filter(
  (review) => review.status === 'Completed'
).length

const draftReviews = reviews.filter(
  (review) => review.status === 'Draft'
).length

const averagePerformanceScore = (() => {
  const scoredReviews = reviews.filter(
    (review) =>
      typeof review.overallScore === 'number' &&
      Number.isFinite(review.overallScore)
  )

  if (scoredReviews.length === 0) return 0

  const totalScore = scoredReviews.reduce(
    (total, review) => total + review.overallScore,
    0
  )

  return Number((totalScore / scoredReviews.length).toFixed(1))
})()

  const departmentCount = new Set(
    employees.map(getEmployeeDepartment),
  ).size

  return (
    <div className={styles.page}>
      
<header className={styles.header}>
  <div className={styles.titleGroup}>
    <span className={styles.crumb}>Work · Performance</span>

    <h1 className={styles.title}>Employee Performance</h1>

    <p>
      Monitor your workforce and manage employee performance reviews.
    </p>
  </div>

  <div className={styles.headerActions}>
    <button
      type="button"
      onClick={loadEmployees}
      disabled={loading}
      className={styles.remindBtn}
    >
      <RefreshCw size={16} />
      {loading ? 'Loading...' : 'Refresh data'}
    </button>

    <button
      type="button"
      onClick={() => {
  setReviewError('');
  setShowReviewForm(true);
}}
      className={styles.newReviewBtn}
    >
      <Plus size={16} />
      New Review
    </button>
  </div>
</header>
{showReviewForm && (
  <div className={styles.reviewModalOverlay}>
    <div
      className={styles.reviewModal}
      role="dialog"
      aria-modal="true"
      aria-labelledby="reviewFormTitle"
    >
      <div className={styles.reviewModalHeader}>
        <div>
          <span className={styles.crumb}>PERFORMANCE MANAGEMENT</span>
          <h2 id="reviewFormTitle">New Performance Review</h2>
          <p>Evaluate an employees performance and development.</p>
        </div>

        <button
          type="button"
          className={styles.reviewCloseBtn}
          onClick={() => setShowReviewForm(false)}
          disabled={savingReview}
          aria-label="Close review form"
        >
          ×
        </button>
      </div>

      <form
        className={styles.reviewForm}
        onSubmit={(event) => {
          event.preventDefault();
          handleSaveReview('Completed');
        }}
      >
        {reviewError && (
          <div className={styles.reviewError} role="alert">
            {reviewError}
          </div>
        )}

        <div className={styles.reviewFormGrid}>
          <label className={styles.reviewField}>
            <span>Select employee *</span>

            <select
              value={reviewForm.employeeId}
              onChange={(event) =>
                setReviewForm({
                  ...reviewForm,
                  employeeId: event.target.value,
                })
              }
              required
            >
              <option value="">Choose an employee</option>

              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {getEmployeeName(employee)}
                </option>
              ))}
            </select>
          </label>

          <label className={styles.reviewField}>
            <span>Review period *</span>

            <select
              value={reviewForm.period}
              onChange={(event) =>
                setReviewForm({
                  ...reviewForm,
                  period: event.target.value,
                })
              }
            >
              <option value="Monthly">Monthly</option>
              <option value="Quarterly">Quarterly</option>
              <option value="Annual">Annual</option>
              <option value="Probation">Probation</option>
            </select>
          </label>

          <label className={styles.reviewField}>
            <span>Review date *</span>

            <input
              type="date"
              value={reviewForm.reviewDate}
              onChange={(event) =>
                setReviewForm({
                  ...reviewForm,
                  reviewDate: event.target.value,
                })
              }
              required
            />
          </label>
        </div>

        <div className={styles.reviewSectionHeading}>
          <h3>Performance ratings</h3>
          <p>Rate each area from 1 (Needs improvement) to 5 (Excellent).</p>
        </div>

        <div className={styles.reviewFormGrid}>
          {[
            { key: 'quality', label: 'Quality of work' },
            { key: 'productivity', label: 'Productivity' },
            { key: 'communication', label: 'Communication' },
            { key: 'teamwork', label: 'Teamwork' },
          ].map((rating) => (
            <label className={styles.reviewField} key={rating.key}>
              <span>{rating.label}</span>

              <select
                value={reviewForm[rating.key]}
                onChange={(event) =>
                  setReviewForm({
                    ...reviewForm,
                    [rating.key]: Number(event.target.value),
                  })
                }
              >
                <option value={1}>1 - Needs improvement</option>
                <option value={2}>2 - Below expectations</option>
                <option value={3}>3 - Meets expectations</option>
                <option value={4}>4 - Very good</option>
                <option value={5}>5 - Excellent</option>
              </select>
            </label>
          ))}
        </div>

        <div className={styles.reviewSectionHeading}>
          <h3>Feedback and development</h3>
          <p>Record feedback to help the employee improve and grow.</p>
        </div>

        <label className={styles.reviewField}>
          <span>Strengths</span>

          <textarea
            rows={3}
            placeholder="What does this employee do well?"
            value={reviewForm.strengths}
            onChange={(event) =>
              setReviewForm({
                ...reviewForm,
                strengths: event.target.value,
              })
            }
          />
        </label>

        <label className={styles.reviewField}>
          <span>Areas for improvement</span>

          <textarea
            rows={3}
            placeholder="What skills or areas need improvement?"
            value={reviewForm.improvements}
            onChange={(event) =>
              setReviewForm({
                ...reviewForm,
                improvements: event.target.value,
              })
            }
          />
        </label>

        <label className={styles.reviewField}>
          <span>Managers comments</span>

          <textarea
            rows={3}
            placeholder="Additional feedback from the manager..."
            value={reviewForm.managerComments}
            onChange={(event) =>
              setReviewForm({
                ...reviewForm,
                managerComments: event.target.value,
              })
            }
          />
        </label>

        <label className={styles.reviewField}>
          <span>Goals for the next review period</span>

          <textarea
            rows={3}
            placeholder="What should the employee work towards?"
            value={reviewForm.goals}
            onChange={(event) =>
              setReviewForm({
                ...reviewForm,
                goals: event.target.value,
              })
            }
          />
        </label>

        <div className={styles.reviewFormActions}>
          <button
            type="button"
            className={styles.reviewCancelBtn}
            onClick={() => setShowReviewForm(false)}
            disabled={savingReview}
          >
            Cancel
          </button>

          <button
            type="button"
            className={styles.reviewDraftBtn}
            onClick={() => handleSaveReview('Draft')}
            disabled={savingReview}
          >
            {savingReview ? 'Saving...' : 'Save draft'}
          </button>

          <button
            type="submit"
            className={styles.reviewCompleteBtn}
            disabled={savingReview}
          >
            {savingReview ? 'Saving...' : 'Complete review'}
          </button>
        </div>
      </form>
    </div>
  </div>
)}


      <section className={styles.progressGrid}>
        <div className={styles.progressCard}>
          <div className={styles.cardIcon}>
            <Users size={20} />
          </div>

          <span className={styles.progressLabel}>
            Total employees
          </span>

          <span className={styles.progressValue}>
            {loading ? '—' : employees.length}
          </span>

          <span className={styles.progressSub}>
            Employees registered in the system
          </span>
        </div>

        <div className={styles.progressCard}>
          <div className={styles.cardIcon}>
            <ClipboardCheck size={20} />
          </div>

          <span className={styles.progressLabel}>
            Active employees
          </span>

          <span className={styles.progressValue}>
            {loading ? '—' : activeEmployees}
          </span>

          <span className={styles.progressSub}>
            Employees marked as active
          </span>
        </div>

        <div className={styles.progressCard}>
          <div className={styles.cardIcon}>
            <Building2 size={20} />
          </div>

          <span className={styles.progressLabel}>
            Departments
          </span>

          <span className={styles.progressValue}>
            {loading ? '—' : departmentCount}
          </span>

          <span className={styles.progressSub}>
            Departments represented in employee records
          </span>
        </div>

        <div className={styles.progressCard}>
          <div className={styles.cardIcon}>
            <TrendingUp size={20} />
          </div>

          <span className={styles.progressLabel}>
            Inactive or other status
          </span>

          <span className={styles.progressValue}>
            {loading ? '—' : inactiveEmployees}
          </span>

          <span className={styles.progressSub}>
            Employees not marked as active
          </span>
        </div>
      </section>

      <section className={styles.contentGrid}>
        <div className={styles.tableCard}>
          <div className={styles.tableToolbar}>
            <div>
              <h2 className={styles.tableTitle}>
                Employee directory
              </h2>

              <p className={styles.tableDescription}>
                Select an employee to view their profile.
              </p>
            </div>

            <span className={styles.resultCount}>
              {loading ? 'Loading...' : `${filteredEmployees.length} employees`}
            </span>
          </div>

          <div className={styles.filters}>
            <label className={styles.searchBox}>
              <Search size={17} />

              <input
                type="search"
                placeholder="Search employees..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </label>

            <select
              value={selectedDepartment}
              onChange={(event) =>
                setSelectedDepartment(event.target.value)
              }
              aria-label="Filter by department"
            >
              <option>All departments</option>

              {departments.map((department) => (
                <option key={department} value={department}>
                  {department}
                </option>
              ))}
            </select>

            <select
              value={selectedBranch}
              onChange={(event) => setSelectedBranch(event.target.value)}
              aria-label="Filter by branch"
            >
              <option>All branches</option>

              {branches.map((branch) => (
                <option key={branch} value={branch}>
                  {branch}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <div className={styles.errorMessage} role="alert">
              <AlertCircle size={18} />
              <span>{error}</span>

              <button type="button" onClick={loadEmployees}>
                Try again
              </button>
            </div>
          )}

          <div className={styles.tableHeader}>
            <span>Employee</span>
            <span>Department</span>
            <span>Branch</span>
            <span>Status</span>
            <span>Profile</span>
          </div>

          <div className={styles.tableBody}>
            {loading ? (
              <div className={styles.emptyState}>
                Loading employee records...
              </div>
            ) : error ? (
              <div className={styles.emptyState}>
                Employee records could not be displayed.
              </div>
            ) : filteredEmployees.length === 0 ? (
              <div className={styles.emptyState}>
                <Users size={30} />

                <strong>No employees found</strong>

                <span>
                  Try changing your search or department and branch filters.
                </span>
              </div>
            ) : (
              filteredEmployees.map((employee) => {
                const status = getEmployeeStatus(employee)
                const isActive = status.toLowerCase() === 'active'

                return (
                  <div
                    key={employee.id}
                    className={styles.tableRow}
                  >
                    <div className={styles.empCell}>
                      <span className={styles.empName}>
                        {getEmployeeName(employee)}
                      </span>

                      <span className={styles.empRole}>
                        {employee.jobTitle ||
                          employee.position ||
                          employee.role ||
                          employee.email ||
                          'Employee'}
                      </span>
                    </div>

                    <span className={styles.metricCell}>
                      {getEmployeeDepartment(employee)}
                    </span>

                    <span className={styles.metricCell}>
                      {getEmployeeBranch(employee)}
                    </span>

                    <span
                      className={
                        isActive
                          ? styles.overallNormal
                          : styles.overallLow
                      }
                    >
                      {status}
                    </span>

                    <Link
                      to={`/employees/${employee.id}`}
                      className={styles.profileLink}
                      aria-label={`View ${getEmployeeName(employee)}'s profile`}
                    >
                      View
                      <ChevronRight size={15} />
                    </Link>
                  </div>
                )
              })
            )}
          </div>

          <p className={styles.footnote}>
            Employee information is loaded from Firestore. Performance scores
            and review completion will appear once performance reviews are
            connected.
          </p>
        </div>

        <aside className={styles.sideStack}>
          <div className={styles.scoreWeightCard}>
            <h2 className={styles.sideTitleLight}>
              Performance reviews
            </h2>

            <p>
              Record manager evaluations, employee goals, strengths, and areas
              for improvement.
            </p>

            <div className={styles.reviewFeature}>
              <ClipboardCheck size={19} />

              <div>
                <strong>Manager evaluations</strong>
                <span>Record and track review scores.</span>
              </div>
            </div>

            <div className={styles.reviewFeature}>
              <TrendingUp size={19} />

              <div>
                <strong>Employee development</strong>
                <span>Track goals and improvement areas.</span>
              </div>
            </div>
          </div>

          <div className={styles.conversationCard}>
            <h2 className={styles.sideTitleDark}>
              Review workspace
            </h2>

            <p>
              Your employee directory is connected. The next step is to
              create a Firestore collection for performance reviews.
            </p>

            <div className={styles.workspaceSummary}>
              <span>Employees available</span>
              <strong>{loading ? '—' : employees.length}</strong>
            </div>

            <div className={styles.workspaceSummary}>
              <span>Departments</span>
              <strong>{loading ? '—' : departmentCount}</strong>
            </div>

            <Link
              to="/employees"
              className={styles.workspaceLink}
            >
              Manage employees
              <ChevronRight size={16} />
            </Link>
          </div>
        </aside>
      </section>
    </div>
  )
}
