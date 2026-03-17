import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, setToken } from '../api';

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
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#F5A623', marginBottom: 8 }}>Kolmena Admin</h1>
        <p style={{ color: '#6B7280', marginBottom: 24, fontSize: 14 }}>Panel de administracion</p>

        {error && <p style={{ color: '#DC2626', fontSize: 13, marginBottom: 12 }}>{error}</p>}

        <label style={label}>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={input} />

        <label style={label}>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={input} />

        <button type="submit" disabled={loading} style={{ ...submitBtn, opacity: loading ? 0.6 : 1 }}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}

const container: React.CSSProperties = {
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  minHeight: '100vh', backgroundColor: '#FAFAFA',
};
const card: React.CSSProperties = {
  backgroundColor: '#FFF', padding: 40, borderRadius: 16, width: 380,
  boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
};
const label: React.CSSProperties = { display: 'block', fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 4 };
const input: React.CSSProperties = {
  width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #D1D5DB',
  fontSize: 15, marginBottom: 16, outline: 'none',
};
const submitBtn: React.CSSProperties = {
  width: '100%', padding: 12, border: 'none', borderRadius: 10,
  backgroundColor: '#F5A623', color: '#FFF', fontSize: 15, fontWeight: 600, cursor: 'pointer',
};
