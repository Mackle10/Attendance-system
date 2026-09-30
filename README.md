# Attendi Business Suite

> **All-in-one Attendance & HR Management System** built with React + Vite.

---

## 🚀 Tech Stack

| Tool | Purpose |
|------|---------|
| [React 18](https://react.dev/) | UI Framework |
| [Vite 5](https://vitejs.dev/) | Build tool & dev server |
| [React Router v6](https://reactrouter.com/) | Client-side routing |
| Vanilla CSS + CSS Variables | Styling & design tokens |

---

## 📁 Project Structure

```
src/
├── assets/               # Static images, icons, logos
├── components/
│   ├── common/           # Reusable UI: Button, Input, Modal, Badge, Table, Card ...
│   ├── layout/           # AppShell, Sidebar, Navbar, Header, Footer
│   └── charts/           # Chart wrappers (attendance trends, leave stats, etc.)
├── context/
│   ├── AuthContext.jsx   # Authentication state (login/logout/user)
│   └── ThemeContext.jsx  # Dark/Light mode toggle
├── hooks/
│   ├── useAuth.js        # Auth hook
│   ├── useTheme.js       # Theme hook
│   └── useLocalStorage.js
├── pages/
│   ├── Auth/             # Login, Register, ForgotPassword
│   ├── Dashboard/        # Overview KPIs & quick stats
│   ├── Employees/        # Employee list, profile, add/edit
│   ├── Attendance/       # Daily attendance, clock-in/out, calendar view
│   ├── Leave/            # Leave requests, approvals, balances
│   ├── Payroll/          # Payslips, salary breakdown
│   ├── Reports/          # Analytics & exportable reports
│   └── Settings/         # Company settings, user roles
├── routes/
│   └── AppRouter.jsx     # Centralised route definitions
├── services/
│   ├── api.js            # Axios instance & interceptors (add Axios when needed)
│   ├── authService.js    # Login, logout, register API calls
│   ├── employeeService.js
│   ├── attendanceService.js
│   ├── leaveService.js
│   └── payrollService.js
├── styles/
│   ├── globals.css       # CSS reset + global base styles
│   ├── tokens.css        # Design tokens (colors, spacing, typography)
│   └── animations.css    # Reusable keyframe animations
├── utils/
│   ├── formatters.js     # Date, currency, percentage formatters
│   ├── validators.js     # Form validation helpers
│   └── constants.js      # App-wide constants & enums
├── App.jsx               # Root component with router & context providers
└── main.jsx              # ReactDOM entry point
```

---

## ⚙️ Getting Started

### Prerequisites
- Node.js **v18+**
- npm **v9+** or yarn

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_ORG/attendi-business-suite.git
cd attendi-business-suite

# 2. Install dependencies
npm install

# 3. Copy environment variables
cp .env.example .env
# Then fill in the values in .env

# 4. Start development server (opens on http://localhost:3000)
npm run dev
```

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server at http://localhost:3000 |
| `npm run build` | Build production bundle |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint checks |
| `npm run format` | Auto-format with Prettier |

---

## 🌍 Environment Variables

Copy `.env.example` to `.env` and fill in the required values:

```env
VITE_API_BASE_URL=https://api.your-backend.com
VITE_APP_NAME=Attendi Business Suite
```

> ⚠️ Never commit your `.env` file. It is already listed in `.gitignore`.

---

## 🏗️ Modules / Screens

| Module | Description |
|--------|-------------|
| **Auth** | Login, Register, Password Reset |
| **Dashboard** | KPI cards, attendance overview, recent activity |
| **Employees** | List, add, edit, deactivate employees |
| **Attendance** | Daily log, clock-in/out, calendar view |
| **Leave** | Apply, approve/reject leave requests, balances |
| **Payroll** | View payslips, salary components |
| **Reports** | Exportable attendance & HR reports |
| **Settings** | Company profile, roles & permissions |

---

## 🤝 Contributing

1. Create a branch: `git checkout -b feature/your-feature-name`
2. Commit your changes: `git commit -m "feat: add your feature"`
3. Push to branch: `git push origin feature/your-feature-name`
4. Open a Pull Request → `main`

### Commit Convention
Follow [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` – new feature
- `fix:` – bug fix
- `chore:` – build/config changes
- `docs:` – documentation only
- `style:` – formatting, no logic changes
- `refactor:` – code restructure
- `test:` – adding tests

---

## 📄 License

Private – All rights reserved © Attendi Business Suite Team
