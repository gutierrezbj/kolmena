import { useEffect, useState } from 'react';
import { api } from '../api';

type Community = {
  id: string;
  name: string;
  city: string;
  tier: string;
  createdAt: string;
  memberCount: number;
};

const tierColors: Record<string, string> = {
  free: '#9CA3AF',
  basic: '#2196F3',
  pro: '#F5A623',
};

export function CommunitiesPage() {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api<{ communities: Community[] }>('/admin/communities')
      .then((r) => setCommunities(r.communities))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={{ color: '#9CA3AF' }}>Cargando...</p>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>Comunidades</h1>
        <span style={{ fontSize: 14, color: '#6B7280' }}>{communities.length} total</span>
      </div>

      <table style={table}>
        <thead>
          <tr>
            <th style={th}>Nombre</th>
            <th style={th}>Ciudad</th>
            <th style={th}>Tier</th>
            <th style={th}>Miembros</th>
            <th style={th}>Creada</th>
          </tr>
        </thead>
        <tbody>
          {communities.map((c) => (
            <tr key={c.id}>
              <td style={td}>{c.name}</td>
              <td style={td}>{c.city}</td>
              <td style={td}>
                <span style={{ ...badge, backgroundColor: `${tierColors[c.tier] ?? '#9CA3AF'}20`, color: tierColors[c.tier] ?? '#9CA3AF' }}>
                  {c.tier.toUpperCase()}
                </span>
              </td>
              <td style={td}>{c.memberCount}</td>
              <td style={td}>{new Date(c.createdAt).toLocaleDateString('es-ES')}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {communities.length === 0 && <p style={{ textAlign: 'center', color: '#9CA3AF', marginTop: 32 }}>No hay comunidades</p>}
    </div>
  );
}

const table: React.CSSProperties = { width: '100%', borderCollapse: 'collapse', backgroundColor: '#FFF', borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' };
const th: React.CSSProperties = { textAlign: 'left', padding: '12px 16px', fontSize: 12, fontWeight: 600, color: '#6B7280', borderBottom: '1px solid #E5E7EB', textTransform: 'uppercase' };
const td: React.CSSProperties = { padding: '12px 16px', fontSize: 14, borderBottom: '1px solid #F3F4F6' };
const badge: React.CSSProperties = { padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600 };
