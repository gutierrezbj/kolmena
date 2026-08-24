import { useEffect, useState } from 'react';
import { api } from '../api';
import { c, sp, r, font, shadow, priorityDot, statusStyle } from '../theme/tokens';

type Incident = {
  id: string;
  title: string;
  category: string;
  priority: string;
  status: string;
  communityId: string;
  createdAt: string;
};

const statusLabels: Record<string, string> = {
  open: 'Abierta', assigned: 'Asignada', in_progress: 'En curso',
  waiting_parts: 'Esperando material', resolved: 'Resuelta', closed: 'Cerrada',
};

const categoryLabels: Record<string, string> = {
  plumbing: 'Fontaneria', electrical: 'Electricidad', elevator: 'Ascensor',
  structural: 'Estructura', cleaning: 'Limpieza', garden: 'Jardineria',
  security: 'Seguridad', other: 'Otros',
};

export function IncidentsPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api<{ incidents: Incident[] }>('/admin/incidents/recent')
      .then((r) => setIncidents(r.incidents))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={{ color: c.textMuted, fontFamily: font.body }}>Cargando...</p>;

  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: sp[5], fontFamily: font.display, color: c.textPrimary, letterSpacing: '-0.02em' }}>
        Incidencias recientes
      </h1>

      <div style={{ backgroundColor: c.surface, borderRadius: r.lg, boxShadow: shadow.sm, border: `1px solid ${c.surfaceBorder}`, overflow: 'hidden' }}>
        <table style={table}>
          <thead>
            <tr style={{ backgroundColor: c.surfaceOverlay }}>
              <th style={{ ...th, width: 32 }}></th>
              <th style={th}>Titulo</th>
              <th style={th}>Categoria</th>
              <th style={th}>Estado</th>
              <th style={th}>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {incidents.map((inc) => {
              const dotColor = priorityDot[inc.priority as keyof typeof priorityDot] ?? c.textMuted;
              const st = statusStyle[inc.status as keyof typeof statusStyle] ?? statusStyle.open;
              return (
                <tr
                  key={inc.id}
                  style={{ borderBottom: `1px solid ${c.surfaceBorder}` }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = c.surfaceOverlay; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}
                >
                  <td style={{ ...td, textAlign: 'center' }}>
                    <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', backgroundColor: dotColor }} />
                  </td>
                  <td style={{ ...td, fontWeight: 500, color: c.textPrimary }}>{inc.title}</td>
                  <td style={td}>
                    <span style={catBadge}>{categoryLabels[inc.category] ?? inc.category}</span>
                  </td>
                  <td style={td}>
                    <span style={{ ...statusBadge, ...st }}>{statusLabels[inc.status] ?? inc.status}</span>
                  </td>
                  <td style={{ ...td, fontFamily: font.mono, color: c.textMuted }}>
                    {new Date(inc.createdAt).toLocaleDateString('es-ES')}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {incidents.length === 0 && (
          <p style={{ textAlign: 'center', color: c.textMuted, padding: sp[8], fontFamily: font.body }}>
            No hay incidencias
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

const catBadge: React.CSSProperties = {
  padding: `2px ${sp[2]}`,
  borderRadius: r.sm,
  fontSize: 11,
  fontWeight: 600,
  fontFamily: font.mono,
  backgroundColor: c.surfaceOverlay,
  color: c.textSecondary,
  border: `1px solid ${c.surfaceBorder}`,
};

const statusBadge: React.CSSProperties = {
  padding: `2px ${sp[2]}`,
  borderRadius: r.full,
  fontSize: 11,
  fontWeight: 600,
  fontFamily: font.mono,
};
