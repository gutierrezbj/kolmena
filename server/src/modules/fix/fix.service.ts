import { eq, and, desc } from 'drizzle-orm';
import { db } from '../../shared/db/client.js';
import { incidents, incidentComments, incidentStatusLog } from '../../shared/db/schema.js';
import { generateId } from '../../shared/utils/uuid.js';
import { AppError } from '../../shared/errors/app-error.js';
import { ErrorCode } from '../../shared/errors/error-codes.js';

type IncidentStatus = 'open' | 'assigned' | 'in_progress' | 'waiting_parts' | 'resolved' | 'closed';
type IncidentPriority = 'low' | 'medium' | 'high' | 'urgent';
type IncidentCategory = 'plumbing' | 'electrical' | 'elevator' | 'structural' | 'cleaning' | 'garden' | 'security' | 'other';

interface CreateIncident {
  title: string;
  description: string;
  category?: IncidentCategory;
  priority?: IncidentPriority;
  location?: string;
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
  }).returning();
  return incident;
}

export async function updateIncidentStatus(
  incidentId: string,
  newStatus: IncidentStatus,
  changedById: string,
  note?: string,
) {
  const incident = await getIncident(incidentId);
  const oldStatus = incident.status;

  if (oldStatus === newStatus) {
    throw new AppError(ErrorCode.VALIDATION_ERROR, 'Status is already ' + newStatus);
  }

  const isResolved = newStatus === 'resolved' || newStatus === 'closed';

  const [updated] = await db.update(incidents)
    .set({
      status: newStatus,
      updatedAt: new Date(),
      ...(isResolved ? { resolvedAt: new Date() } : {}),
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
