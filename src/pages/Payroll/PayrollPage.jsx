/**
 * PayrollPage.jsx
 * TODO: Build the Payroll screen here.
 *
 * Suggested content:
 *  - Payroll period selector (month/year)
 *  - Payroll summary: total payroll amount, employees paid, pending
 *  - Payslip table: employee, gross salary, deductions, net pay, status, download PDF
 *  - Run Payroll button (admin only)
 *  - Salary breakdown component (basic, allowances, deductions)
 *
 * Data: fetch from payrollService.getPayslips(), payrollService.getSalaryBreakdown()
 */

export default function PayrollPage() {
  return (
    <div className="page-container animate-fade-in-up">
      <h1>💰 Payroll</h1>
      <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
        Build the Payroll page here – <code>src/pages/Payroll/PayrollPage.jsx</code>
      </p>
    </div>
  )
}
