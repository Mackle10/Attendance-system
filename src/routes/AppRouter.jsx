import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '@hooks/useAuth'

// Layouts
import AppShell from '@components/layout/AppShell'

// Auth Pages
import LoginPage from '@pages/Auth/LoginPage'
import RegisterPage from '@pages/Auth/RegisterPage'
import ForgotPasswordPage from '@pages/Auth/ForgotPasswordPage'

// App Pages
import DashboardPage from '@pages/Dashboard/DashboardPage'
import EmployeesPage from '@pages/Employees/EmployeesPage'
import AttendancePage from '@pages/Attendance/AttendancePage'
import LeavePage from '@pages/Leave/LeavePage'
import PayrollPage from '@pages/Payroll/PayrollPage'
import ReportsPage from '@pages/Reports/ReportsPage'
import SettingsPage from '@pages/Settings/SettingsPage'
import NotFoundPage from '@pages/NotFound/NotFoundPage'

/**
 * ProtectedRoute – redirects unauthenticated users to /login
 */
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

/**
 * PublicRoute – redirects authenticated users away from auth pages
 */
function PublicRoute({ children }) {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children
}

export default function AppRouter() {
  return (
    <Routes>
      {/* ── Public Routes (Auth) ───────────────────── */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* ── Protected Routes (App Shell) ──────────── */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard"  element={<DashboardPage />} />
        <Route path="employees"  element={<EmployeesPage />} />
        <Route path="attendance" element={<AttendancePage />} />
        <Route path="leave"      element={<LeavePage />} />
        <Route path="payroll"    element={<PayrollPage />} />
        <Route path="reports"    element={<ReportsPage />} />
        <Route path="settings"   element={<SettingsPage />} />
      </Route>

      {/* ── 404 ───────────────────────────────────── */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
