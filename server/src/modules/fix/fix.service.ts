import { eq, and, desc } from 'drizzle-orm';
import { db } from '../../shared/db/client.js';
import { incidents, incidentComments, incidentStatusLog } from '../../shared/db/schema.js';
import { generateId } from '../../shared/utils/uuid.js';
import { AppError } from '../../shared/errors/app-error.js';
import { ErrorCode } from '../../shared/errors/error-codes.js';
import { logger } from '../../shared/utils/logger.js';
import { sendNotification, notifyCommunityMembers } from '../notify/notify.service.js';

type IncidentStatus = 'open' | 'assigned' | 'in_progress' | 'waiting_parts' | 'resolved' | 'closed';

// Valid status transitions — closed is terminal, no skipping open -> resolved
const VALID_TRANSITIONS: Record<IncidentStatus, IncidentStatus[]> = {
  open: ['assigned', 'in_progress', 'closed'],
  assigned: ['in_progress', 'waiting_parts', 'open', 'closed'],
  in_progress: ['waiting_parts', 'resolved', 'assigned'],
  waiting_parts: ['in_progress', 'resolved'],
  resolved: ['closed', 'in_progress'],
  closed: [],
};

const STATUS_LABEL: Record<IncidentStatus, string> = {
  open: 'abierta',
  assigned: 'asignada',
  in_progress: 'en progreso',
  waiting_parts: 'esperando repuestos',
  resolved: 'resuelta',
  closed: 'cerrada',
};
type IncidentPriority = 'low' | 'medium' | 'high' | 'urgent';
type IncidentCategory = 'plumbing' | 'electrical' | 'elevator' | 'structural' | 'cleaning' | 'garden' | 'security' | 'other';

interface CreateIncident {
  title: string;
  description: string;
  category?: IncidentCategory;
  priority?: IncidentPriority;
  location?: string;
  imageUrls?: string[];
}

export async function listIncidents(communityId: string) {
  return db.select().from(incidents)
    .where(eq(incidents.communityId, communityId))
    .orderBy(desc(incidents.createdAt));
}

export async function getIncident(id: string) {
  const [incident] = await db.select().from(incidents).where(eq(incidents.id, id)).limit(1);
  if (!incident) {
    throw new AppError(ErrorCode.NOT_FOUND, 'Incident not found');
  }
  return incident;
}

export async function createIncident(communityId: string, reporterId: string, data: CreateIncident) {
  const id = generateId();
  const [incident] = await db.insert(incidents).values({
    id,
    communityId,
    reporterId,
    title: data.title,
    description: data.description,
    category: data.category ?? 'other',
    priority: data.priority ?? 'medium',
    location: data.location,
    imageUrls: data.imageUrls ? JSON.stringify(data.imageUrls) : null,
  }).returning();

  // Notify community managers so they can triage — never blocks the request
  try {
    await notifyCommunityMembers({
      communityId,
      roles: ['admin', 'president'],
      excludeUserId: reporterId,
      title: 'Nueva incidencia',
      body: `${data.title}${data.location ? ` — ${data.location}` : ''}`,
      resource: 'incident',
      resourceId: id,
    });
  } catch (err) {
    logger.error({ err, incidentId: id }, 'Failed to notify managers of new incident');
  }

  return incident;
}

export async function updateIncidentStatus(
  incidentId: string,
  newStatus: IncidentStatus,
  changedById: string,
  note?: string,
  resolutionPhotoUrl?: string,
) {
  const incident = await getIncident(incidentId);
  const oldStatus = incident.status;

  if (oldStatus === newStatus) {
    throw new AppError(ErrorCode.VALIDATION_ERROR, 'Status is already ' + newStatus);
  }

  if (!VALID_TRANSITIONS[oldStatus].includes(newStatus)) {
    throw new AppError(
      ErrorCode.VALIDATION_ERROR,
      `Cannot transition from ${oldStatus} to ${newStatus}`,
    );
  }

  // US-050: resolving requires photo evidence of the finished work
  if (newStatus === 'resolved' && !resolutionPhotoUrl) {
    throw new AppError(
      ErrorCode.VALIDATION_ERROR,
      'A resolution photo is required to mark an incident as resolved',
    );
  }

  const isResolved = newStatus === 'resolved' || newStatus === 'closed';

  const [updated] = await db.update(incidents)
    .set({
      status: newStatus,
      updatedAt: new Date(),
      ...(isResolved ? { resolvedAt: new Date() } : {}),
      ...(resolutionPhotoUrl ? { resolutionPhotoUrl } : {}),
    })
    .where(eq(incidents.id, incidentId))
    .returning();

  // Log the transition
  await db.insert(incidentStatusLog).values({
    id: generateId(),
    incidentId,
    changedById,
    fromStatus: oldStatus,
    toStatus: newStatus,
    note,
  });

  // Push to the reporter ("Amazon tracking", US-041) — never blocks the request
  if (incident.reporterId !== changedById) {
    try {
      await sendNotification({
        userId: incident.reporterId,
        communityId: incident.communityId,
        channel: 'push',
        title: 'Actualización de incidencia',
        body: `Tu incidencia "${incident.title}" está ahora ${STATUS_LABEL[newStatus]}.`,
        resource: 'incident',
        resourceId: incidentId,
      });
    } catch (err) {
      logger.error({ err, incidentId }, 'Failed to notify reporter of status change');
    }
  }

  return updated;
}

export async function assignIncident(incidentId: string, assigneeId: string, changedById: string) {
  const incident = await getIncident(incidentId);

  const [updated] = await db.update(incidents)
    .set({ assigneeId, status: 'assigned', updatedAt: new Date() })
    .where(eq(incidents.id, incidentId))
    .returning();

  await db.insert(incidentStatusLog).values({
    id: generateId(),
    incidentId,
    changedById,
    fromStatus: incident.status,
    toStatus: 'assigned',
    note: `Assigned to ${assigneeId}`,
  });

  // Notify the assignee (actionable) and the reporter (tracking) — never blocks
  try {
    await sendNotification({
      userId: assigneeId,
      communityId: incident.communityId,
      channel: 'push',
      title: 'Incidencia asignada',
      body: `Te han asignado: "${incident.title}"`,
      resource: 'incident',
      resourceId: incidentId,
    });
    if (incident.reporterId !== changedById && incident.reporterId !== assigneeId) {
      await sendNotification({
        userId: incident.reporterId,
        communityId: incident.communityId,
        channel: 'push',
        title: 'Actualización de incidencia',
        body: `Tu incidencia "${incident.title}" está ahora asignada.`,
        resource: 'incident',
        resourceId: incidentId,
      });
    }
  } catch (err) {
    logger.error({ err, incidentId }, 'Failed to send assignment notifications');
  }

  return updated;
}

// --- Comments ---

export async function listComments(incidentId: string) {
  return db.select().from(incidentComments)
    .where(eq(incidentComments.incidentId, incidentId))
    .orderBy(incidentComments.createdAt);
}

export async function addComment(incidentId: string, authorId: string, body: string, isInternal = false) {
  // Verify incident exists
  await getIncident(incidentId);

  const [comment] = await db.insert(incidentComments).values({
    id: generateId(),
    incidentId,
    authorId,
    body,
    isInternal,
  }).returning();
  return comment;
}

// --- Status log ---

export async function getStatusLog(incidentId: string) {
  return db.select().from(incidentStatusLog)
    .where(eq(incidentStatusLog.incidentId, incidentId))
    .orderBy(incidentStatusLog.createdAt);
}
