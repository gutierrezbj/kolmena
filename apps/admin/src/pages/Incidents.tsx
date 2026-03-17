import { useEffect, useState } from 'react';
import { api } from '../api';

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

const priorityColors: Record<string, string> = {
  low: '#2196F3', medium: '#FF9800', high: '#FF5722', urgent: '#F44336',
};

export function IncidentsPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api<{ incidents: Incident[] }>('/admin/incidents/recent')
      .then((r) => setIncidents(r.incidents))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={{ color: '#9CA3AF' }}>Cargando...</p>;

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}>Incidencias recientes</h1>

      <table style={table}>
        <thead>
          <tr>
            <th style={th}>Prioridad</th>
            <th style={th}>Titulo</th>
            <th style={th}>Categoria</th>
            <th style={th}>Estado</th>
            <th style={th}>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {incidents.map((inc) => (
            <tr key={inc.id}>
              <td style={td}>
                <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', backgroundColor: priorityColors[inc.priority] ?? '#9CA3AF' }} />
              </td>
              <td style={td}>{inc.title}</td>
              <td style={td}>
                <span style={catBadge}>{categoryLabels[inc.category] ?? inc.category}</span>
              </td>
              <td style={td}>
                <span style={statusBadge}>{statusLabels[inc.status] ?? inc.status}</span>
              </td>
              <td style={td}>{new Date(inc.createdAt).toLocaleDateString('es-ES')}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {incidents.length === 0 && <p style={{ textAlign: 'center', color: '#9CA3AF', marginTop: 32 }}>No hay incidencias</p>}
    </div>
  );
}

const table: React.CSSProperties = { width: '100%', borderCollapse: 'collapse', backgroundColor: '#FFF', borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' };
const th: React.CSSProperties = { textAlign: 'left', padding: '12px 16px', fontSize: 12, fontWeight: 600, color: '#6B7280', borderBottom: '1px solid #E5E7EB', textTransform: 'uppercase' };
const td: React.CSSProperties = { padding: '12px 16px', fontSize: 14, borderBottom: '1px solid #F3F4F6' };
const catBadge: React.CSSProperties = { padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600, backgroundColor: '#F3F4F6', color: '#6B7280' };
const statusBadge: React.CSSProperties = { padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600, backgroundColor: '#FFF3E0', color: '#E8930C' };
