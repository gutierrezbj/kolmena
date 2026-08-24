import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { setToken } from './api';
import { c, sp, r, font, motion, hexTexture } from './theme/tokens';

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
    <div style={{ display: 'flex', minHeight: '100vh', background: c.bg }}>
      <aside style={sidebar}>
        <h2 style={{
          fontSize: 20,
          fontWeight: 700,
          marginBottom: sp[6],
          color: c.primary,
          fontFamily: font.display,
          letterSpacing: '-0.02em',
        }}>
          Kolmena Admin
        </h2>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: sp[1] }}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              style={({ isActive }) => ({
                ...navLink,
                backgroundColor: isActive ? c.navActiveBg : 'transparent',
                color: isActive ? c.navActiveText : c.navInactiveText,
                fontWeight: isActive ? 600 : 400,
                transition: `background-color ${motion.durationFast} ${motion.easing}, color ${motion.durationFast} ${motion.easing}`,
              })}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <button
          onClick={logout}
          style={logoutBtn}
          onMouseEnter={(e) => { (e.target as HTMLElement).style.opacity = '0.8'; }}
          onMouseLeave={(e) => { (e.target as HTMLElement).style.opacity = '1'; }}
        >
          Cerrar sesion
        </button>
      </aside>
      <main style={{ flex: 1, padding: sp[6], overflowY: 'auto' }}>
        <Outlet />
      </main>
    </div>
  );
}

const sidebar: React.CSSProperties = {
  width: 240,
  backgroundColor: c.sidebarBg,
  borderRight: `1px solid ${c.sidebarBorder}`,
  padding: sp[5],
  display: 'flex',
  flexDirection: 'column',
  backgroundImage: hexTexture,
  backgroundSize: '28px 49px',
};

const navLink: React.CSSProperties = {
  padding: `${sp[2]} ${sp[3]}`,
  borderRadius: r.md,
  textDecoration: 'none',
  fontSize: 14,
  fontFamily: font.body,
};

const logoutBtn: React.CSSProperties = {
  marginTop: 'auto',
  padding: `${sp[2]} ${sp[3]}`,
  border: `1px solid ${c.errorBorder}`,
  borderRadius: r.md,
  backgroundColor: c.errorBg,
  color: c.errorText,
  fontSize: 14,
  fontWeight: 500,
  cursor: 'pointer',
  fontFamily: font.body,
  transition: `opacity 180ms ease`,
};
