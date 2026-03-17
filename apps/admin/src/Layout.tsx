import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { setToken } from './api';

const navItems = [
  { to: '/', label: 'Dashboard' },
  { to: '/communities', label: 'Comunidades' },
  { to: '/incidents', label: 'Incidencias' },
];

export function Layout() {
  const navigate = useNavigate();

  const logout = () => {
    setToken(null);
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside style={sidebar}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 32, color: '#F5A623' }}>Kolmena Admin</h2>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              style={({ isActive }) => ({
                ...navLink,
                backgroundColor: isActive ? '#FFF3E0' : 'transparent',
                color: isActive ? '#E8930C' : '#6B7280',
                fontWeight: isActive ? 600 : 400,
              })}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <button onClick={logout} style={logoutBtn}>Cerrar sesion</button>
      </aside>
      <main style={{ flex: 1, padding: 32, overflowY: 'auto' }}>
        <Outlet />
      </main>
    </div>
  );
}

const sidebar: React.CSSProperties = {
  width: 240,
  backgroundColor: '#FFFFFF',
  borderRight: '1px solid #E5E7EB',
  padding: 24,
  display: 'flex',
  flexDirection: 'column',
};

const navLink: React.CSSProperties = {
  padding: '10px 14px',
  borderRadius: 8,
  textDecoration: 'none',
  fontSize: 14,
};

const logoutBtn: React.CSSProperties = {
  marginTop: 'auto',
  padding: '10px 14px',
  border: 'none',
  borderRadius: 8,
  backgroundColor: '#FEE2E2',
  color: '#DC2626',
  fontSize: 14,
  fontWeight: 500,
  cursor: 'pointer',
};
