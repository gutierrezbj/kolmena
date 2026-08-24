import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, setToken } from '../api';
import { c, sp, r, font, shadow, motion, hexTexture } from '../theme/tokens';

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api<{ accessToken: string }>('/auth/login', {
        method: 'POST',
        body: { email, password },
      });
      setToken(res.accessToken);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={container}>
      <form onSubmit={handleSubmit} style={card}>
        <h1 style={{
          fontSize: 28,
          fontWeight: 800,
          color: c.primary,
          marginBottom: sp[1],
          fontFamily: font.display,
          letterSpacing: '-0.03em',
        }}>
          Kolmena Admin
        </h1>
        <p style={{ color: c.textMuted, marginBottom: sp[5], fontSize: 14, fontFamily: font.body }}>
          Panel de administracion
        </p>

        {error && (
          <p style={{
            color: c.errorText,
            fontSize: 13,
            marginBottom: sp[3],
            padding: `${sp[2]} ${sp[3]}`,
            backgroundColor: c.errorBg,
            borderRadius: r.md,
            border: `1px solid ${c.errorBorder}`,
          }}>
            {error}
          </p>
        )}

        <label style={labelStyle}>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={inputStyle}
          onFocus={(e) => { e.target.style.borderColor = c.primary; e.target.style.boxShadow = `0 0 0 3px ${c.primaryLight}`; }}
          onBlur={(e) => { e.target.style.borderColor = c.surfaceBorder; e.target.style.boxShadow = 'none'; }}
        />

        <label style={labelStyle}>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={inputStyle}
          onFocus={(e) => { e.target.style.borderColor = c.primary; e.target.style.boxShadow = `0 0 0 3px ${c.primaryLight}`; }}
          onBlur={(e) => { e.target.style.borderColor = c.surfaceBorder; e.target.style.boxShadow = 'none'; }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{ ...submitBtn, opacity: loading ? 0.6 : 1 }}
          onMouseEnter={(e) => { if (!loading) (e.target as HTMLElement).style.backgroundColor = c.primaryHover; }}
          onMouseLeave={(e) => { (e.target as HTMLElement).style.backgroundColor = c.primary; }}
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}

const container: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  backgroundColor: c.bg,
  backgroundImage: hexTexture,
  backgroundSize: '28px 49px',
};

const card: React.CSSProperties = {
  backgroundColor: c.surface,
  padding: sp[7],
  borderRadius: r.xl,
  width: 380,
  boxShadow: shadow.lg,
  border: `1px solid ${c.surfaceBorder}`,
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 12,
  fontWeight: 600,
  color: c.textSecondary,
  marginBottom: sp[1],
  fontFamily: font.mono,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: `${sp[2]} ${sp[3]}`,
  borderRadius: r.md,
  border: `1px solid ${c.surfaceBorder}`,
  fontSize: 15,
  marginBottom: sp[4],
  outline: 'none',
  fontFamily: font.body,
  color: c.textPrimary,
  backgroundColor: c.bg,
  transition: `border-color ${motion.durationFast} ${motion.easing}, box-shadow ${motion.durationFast} ${motion.easing}`,
};

const submitBtn: React.CSSProperties = {
  width: '100%',
  padding: sp[3],
  border: 'none',
  borderRadius: r.md,
  backgroundColor: c.primary,
  color: c.textOnPrimary,
  fontSize: 15,
  fontWeight: 600,
  cursor: 'pointer',
  fontFamily: font.body,
  transition: `background-color ${motion.durationFast} ${motion.easing}, transform ${motion.durationFast} ${motion.easing}`,
};
