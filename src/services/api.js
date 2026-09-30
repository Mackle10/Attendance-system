/**
 * api.js – Centralised HTTP client
 *
 * TODO: Install Axios then uncomment the implementation below:
 *   npm install axios
 *
 * This file exports a pre-configured Axios instance with:
 *  - Base URL from env variable
 *  - Automatic JWT token injection
 *  - 401 / error interceptors
 */

// ─── Uncomment after `npm install axios` ─────────────────────────────────────
//
// import axios from 'axios'
//
// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_BASE_URL,
//   timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 10000,
//   headers: { 'Content-Type': 'application/json' },
// })
//
// // Request interceptor – inject auth token
// api.interceptors.request.use(
//   config => {
//     const token = localStorage.getItem('abs_token')
//     if (token) config.headers.Authorization = `Bearer ${token}`
//     return config
//   },
//   error => Promise.reject(error)
// )
//
// // Response interceptor – handle 401 globally
// api.interceptors.response.use(
//   response => response,
//   error => {
//     if (error.response?.status === 401) {
//       localStorage.removeItem('abs_token')
//       localStorage.removeItem('abs_user')
//       window.location.href = '/login'
//     }
//     return Promise.reject(error)
//   }
// )
//
// export default api
// ─────────────────────────────────────────────────────────────────────────────

// Placeholder export so imports don't break before Axios is installed
const api = {}
export default api
