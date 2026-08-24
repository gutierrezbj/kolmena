import { useEffect, useState } from 'react';
import { api } from '../api';
import { c, sp, r, font, shadow, motion, statusStyle } from '../theme/tokens';

type Stats = {
  users: number;
  communities: number;
  incidents: number;
  posts: number;
  polls: number;
  bookings: number;
};

type StatusBreakdown = { status: string; count: number };

const statusLabels: Record<string, string> = {
  open: 'Abiertas',
  assigned: 'Asignadas',
  in_progress: 'En curso',
  waiting_parts: 'Esperando material',
  resolved: 'Resueltas',
  closed: 'Cerradas',
};

export function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [breakdown, setBreakdown] = useState<StatusBreakdown[]>([]);

  useEffect(() => {
    api<{ stats: Stats }>('/admin/stats').then((r) => setStats(r.stats));
    api<{ breakdown: StatusBreakdown[] }>('/admin/incidents/by-status').then((r) => setBreakdown(r.breakdown));
  }, []);

  if (!stats) return <p style={{ color: c.textMuted, fontFamily: font.body }}>Cargando...</p>;

  const cards = [
    { label: 'Comunidades',  value: stats.communities, color: c.primary,      bgColor: c.primaryLight },
    { label: 'Usuarios',     value: stats.users,       color: c.info,         bgColor: c.infoBg },
    { label: 'Incidencias',  value: stats.incidents,   color: c.error,        bgColor: c.errorBg },
    { label: 'Posts',        value: stats.posts,       color: c.success,      bgColor: c.successBg },
    { label: 'Votaciones',   value: stats.polls,       color: '#5B3DAE',      bgColor: '#F5F0FF' },
    { label: 'Reservas',     value: stats.bookings,    color: c.warning,      bgColor: c.warningBg },
  ];

  return (
    <div>
      <h1 style={title}>Dashboard</h1>

      <div style={grid}>
        {cards.map((card) => (
          <div
            key={card.label}
            style={{ ...statCard, borderTop: `3px solid ${card.color}` }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.transform = motion.springLift;
              (e.currentTarget as HTMLElement).style.boxShadow = shadow.md;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform = 'none';
              (e.currentTarget as HTMLElement).style.boxShadow = shadow.sm;
            }}
          >
            <p style={{ fontSize: 11, fontWeight: 600, color: c.textMuted, marginBottom: sp[1], fontFamily: font.mono, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {card.label}
            </p>
            <p style={{ fontSize: 36, fontWeight: 800, color: card.color, fontFamily: font.display, lineHeight: 1 }}>
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {breakdown.length > 0 && (
        <div style={{ marginTop: sp[6] }}>
          <h2 style={subtitle}>Incidencias por estado</h2>
          <div style={{ ...statCard, display: 'flex', gap: sp[5], flexWrap: 'wrap' }}>
            {breakdown.map((b) => {
              const st = statusStyle[b.status as keyof typeof statusStyle] ?? statusStyle.open;
              return (
                <div key={b.status} style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: 28, fontWeight: 800, color: c.textPrimary, fontFamily: font.display }}>{b.count}</p>
                  <span style={{
                    fontSize: 11,
                    fontWeight: 600,
                    fontFamily: font.mono,
                    ...st,
                    padding: `2px ${sp[2]}`,
                    borderRadius: r.full,
                  }}>
                    {statusLabels[b.status] ?? b.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

const title: React.CSSProperties = {
  fontSize: 28,
  fontWeight: 800,
  marginBottom: sp[5],
  fontFamily: font.display,
  color: c.textPrimary,
  letterSpacing: '-0.02em',
};

const subtitle: React.CSSProperties = {
  fontSize: 16,
  fontWeight: 700,
  marginBottom: sp[3],
  fontFamily: font.display,
  color: c.textPrimary,
};

const grid: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
  gap: sp[4],
};

const statCard: React.CSSProperties = {
  backgroundColor: c.surface,
  padding: sp[5],
  borderRadius: r.lg,
  boxShadow: shadow.sm,
  border: `1px solid ${c.surfaceBorder}`,
  transition: `transform ${motion.durationNormal} ${motion.easing}, box-shadow ${motion.durationNormal} ${motion.easing}`,
  cursor: 'default',
};
