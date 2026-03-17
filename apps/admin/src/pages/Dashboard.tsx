import { useEffect, useState } from 'react';
import { api } from '../api';

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

  if (!stats) return <p style={{ color: '#9CA3AF' }}>Cargando...</p>;

  const cards = [
    { label: 'Comunidades', value: stats.communities, color: '#F5A623' },
    { label: 'Usuarios', value: stats.users, color: '#2196F3' },
    { label: 'Incidencias', value: stats.incidents, color: '#FF5722' },
    { label: 'Posts', value: stats.posts, color: '#4CAF50' },
    { label: 'Votaciones', value: stats.polls, color: '#9C27B0' },
    { label: 'Reservas', value: stats.bookings, color: '#FF9800' },
  ];

  return (
    <div>
      <h1 style={title}>Dashboard</h1>

      <div style={grid}>
        {cards.map((c) => (
          <div key={c.label} style={statCard}>
            <p style={{ fontSize: 13, color: '#6B7280', marginBottom: 4 }}>{c.label}</p>
            <p style={{ fontSize: 32, fontWeight: 700, color: c.color }}>{c.value}</p>
          </div>
        ))}
      </div>

      {breakdown.length > 0 && (
        <div style={{ marginTop: 32 }}>
          <h2 style={subtitle}>Incidencias por estado</h2>
          <div style={{ ...statCard, display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            {breakdown.map((b) => (
              <div key={b.status} style={{ textAlign: 'center' }}>
                <p style={{ fontSize: 24, fontWeight: 700, color: '#1F2937' }}>{b.count}</p>
                <p style={{ fontSize: 12, color: '#6B7280' }}>{statusLabels[b.status] ?? b.status}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const title: React.CSSProperties = { fontSize: 24, fontWeight: 700, marginBottom: 24 };
const subtitle: React.CSSProperties = { fontSize: 18, fontWeight: 600, marginBottom: 12 };
const grid: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 };
const statCard: React.CSSProperties = {
  backgroundColor: '#FFF', padding: 20, borderRadius: 12,
  boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
};
