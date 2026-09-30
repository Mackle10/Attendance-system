/**
 * LeavePage.jsx
 * TODO: Build the Leave management screen here.
 *
 * Suggested content:
 *  - Tabs: "Requests" | "My Leave" | "Balances"
 *  - Requests table: employee, leave type, dates, days, reason, status, approve/reject buttons
 *  - Leave balance summary cards per leave type
 *  - Apply for Leave button → modal form
 *  - Status badge colours: pending=yellow, approved=green, rejected=red
 *
 * Data: fetch from leaveService.getRequests(), leaveService.getBalances()
 */

export default function LeavePage() {
  return (
    <div className="page-container animate-fade-in-up">
      <h1>🌴 Leave</h1>
      <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
        Build the Leave page here – <code>src/pages/Leave/LeavePage.jsx</code>
      </p>
    </div>
  )
}
