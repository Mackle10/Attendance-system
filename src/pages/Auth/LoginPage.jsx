/**
 * LoginPage.jsx
 * TODO: Build the login form UI here.
 * - Connect form submission to useAuth().login()
 * - Add form validation using src/utils/validators.js
 * - Add "Remember me" checkbox
 * - Link to /forgot-password and /register
 */

export default function LoginPage() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <div style={{ textAlign: 'center' }}>
        <h1>🔐 Login</h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
          Build the Login page here – <code>src/pages/Auth/LoginPage.jsx</code>
        </p>
      </div>
    </div>
  )
}
