
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import { NAV_SECTIONS, APP_NAME } from '@utils/constants';
import Icon from '@components/icons/Icon';
import styles from './Sidebar.module.css';

export default function Sidebar({ onNavigate }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Failed to sign out:', error);
      alert('Unable to sign out. Please try again.');
    }
  };

  const displayName =
    user?.name || user?.email?.split('@')[0] || 'User';

  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');

  const displayRole = user?.role || 'employee';

  return (
    <aside className={styles.sidebar} aria-label="Main navigation">
      <NavLink
        to="/dashboard"
        className={styles.brand}
        onClick={onNavigate}
      >
        <svg
          width="30"
          height="30"
          viewBox="0 0 32 32"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M16 4 L25 22 M16 4 L7 22 M11 15h10" />
          <path d="M8 26.5q8 4 16 0" stroke="#F0A04B" />
          <path d="M11.5 29.5q4.5 2 9 0" stroke="#F0A04B" strokeWidth="2" />
        </svg>

        <span className={styles.brandName}>{APP_NAME}</span>
      </NavLink>

      <div className={styles.company}>
        <span className={styles.companyBadge}>A</span>
        <span className={styles.companyCopy}>
          <span className={styles.companyName}>{APP_NAME}</span>
          <span className={styles.companyMeta}>Business Suite</span>
        </span>
      </div>

      <nav className={styles.nav}>
        {NAV_SECTIONS.map((section) => (
          <div key={section.id} className={styles.section}>
            {section.label ? (
              <p className={styles.sectionLabel}>{section.label}</p>
            ) : null}

            <ul className={styles.navList} role="list">
              {section.items.map((item) => {
                const isActive =
                  item.path && location.pathname.startsWith(item.path);

                const content = (
                  <>
                    <Icon name={item.icon} className={styles.navIcon} />
                    <span className={styles.navLabel}>{item.label}</span>
                    {item.badge ? (
                      <span className={styles.badge}>{item.badge}</span>
                    ) : null}
                  </>
                );

                return (
                  <li key={item.id}>
                    {item.path ? (
                      <NavLink
                        to={item.path}
                        className={`${styles.navLink} ${
                          isActive ? styles.navLinkActive : ''
                        }`}
                        aria-current={isActive ? 'page' : undefined}
                        onClick={onNavigate}
                      >
                        {content}
                      </NavLink>
                    ) : (
                      <span className={styles.navLink}>{content}</span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className={styles.user}>
        <span className={styles.userAvatar}>{initials || 'U'}</span>

        <span className={styles.userCopy}>
          <span className={styles.userName}>{displayName}</span>
          <span className={styles.userRole}>{displayRole}</span>
        </span>

        <button
          type="button"
          aria-label="Sign out"
          title="Sign out"
          className={styles.signOutBtn}
          onClick={handleLogout}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M10 17l5-5-5-5M15 12H4" />
          </svg>
        </button>
      </div>
    </aside>
  );
}