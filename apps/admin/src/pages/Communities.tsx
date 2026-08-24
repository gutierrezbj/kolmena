import { useEffect, useState } from 'react';
import { api } from '../api';
import { c, sp, r, font, shadow, tierStyle } from '../theme/tokens';

type Community = {
  id: string;
  name: string;
  city: string;
  tier: string;
  createdAt: string;
  memberCount: number;
};

export function CommunitiesPage() {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api<{ communities: Community[] }>('/admin/communities')
      .then((r) => setCommunities(r.communities))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={{ color: c.textMuted, fontFamily: font.body }}>Cargando...</p>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: sp[5] }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: c.textPrimary, fontFamily: font.display, letterSpacing: '-0.02em' }}>
          Comunidades
        </h1>
        <span style={{ fontSize: 12, color: c.textMuted, fontFamily: font.mono }}>
          {communities.length} total
        </span>
      </div>

      <div style={{ backgroundColor: c.surface, borderRadius: r.lg, boxShadow: shadow.sm, border: `1px solid ${c.surfaceBorder}`, overflow: 'hidden' }}>
        <table style={table}>
          <thead>
            <tr style={{ backgroundColor: c.surfaceOverlay }}>
              <th style={th}>Nombre</th>
              <th style={th}>Ciudad</th>
              <th style={th}>Tier</th>
              <th style={th}>Miembros</th>
              <th style={th}>Creada</th>
            </tr>
          </thead>
          <tbody>
            {communities.map((comm) => {
              const ts = tierStyle[comm.tier.toUpperCase() as keyof typeof tierStyle] ?? tierStyle.FREE;
              return (
                <tr
                  key={comm.id}
                  style={{ borderBottom: `1px solid ${c.surfaceBorder}` }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = c.surfaceOverlay; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}
                >
                  <td style={{ ...td, fontWeight: 500, color: c.textPrimary }}>{comm.name}</td>
                  <td style={{ ...td, color: c.textSecondary }}>{comm.city}</td>
                  <td style={td}>
                    <span style={{ ...badge, ...ts }}>{comm.tier.toUpperCase()}</span>
                  </td>
                  <td style={{ ...td, fontFamily: font.mono, color: c.textSecondary }}>{comm.memberCount}</td>
                  <td style={{ ...td, fontFamily: font.mono, color: c.textMuted }}>
                    {new Date(comm.createdAt).toLocaleDateString('es-ES')}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {communities.length === 0 && (
          <p style={{ textAlign: 'center', color: c.textMuted, padding: sp[8], fontFamily: font.body }}>
            No hay comunidades
          </p>
        )}
      </div>
    </div>
  );
}

const table: React.CSSProperties = { width: '100%', borderCollapse: 'collapse' };

const th: React.CSSProperties = {
  textAlign: 'left',
  padding: `${sp[3]} ${sp[4]}`,
  fontSize: 11,
  fontWeight: 600,
  color: c.textMuted,
  borderBottom: `1px solid ${c.surfaceBorder}`,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  fontFamily: font.mono,
};

const td: React.CSSProperties = {
  padding: `${sp[3]} ${sp[4]}`,
  fontSize: 14,
  fontFamily: font.body,
  color: c.textSecondary,
};

const badge: React.CSSProperties = {
  padding: `2px ${sp[2]}`,
  borderRadius: r.sm,
  fontSize: 11,
  fontWeight: 700,
  fontFamily: font.mono,
  letterSpacing: '0.04em',
};
