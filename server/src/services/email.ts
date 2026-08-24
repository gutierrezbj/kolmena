/**
 * Kolmena — Email service (Resend)
 * Falls back to console logging in dev if RESEND_API_KEY is not set.
 */
import { Resend } from 'resend';
import { env } from '../config/env.js';
import { logger } from '../shared/utils/logger.js';

const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(opts: SendEmailOptions): Promise<void> {
  if (!resend) {
    logger.info({ to: opts.to, subject: opts.subject }, '[EMAIL DEV] Would send email (no RESEND_API_KEY)');
    return;
  }

  const { error } = await resend.emails.send({
    from: env.EMAIL_FROM,
    to: opts.to,
    subject: opts.subject,
    html: opts.html,
    text: opts.text,
  });

  if (error) {
    logger.error({ error, to: opts.to }, 'Failed to send email');
    throw new Error(`Email send failed: ${error.message}`);
  }

  logger.info({ to: opts.to, subject: opts.subject }, 'Email sent');
}

// --- Email templates ---

export function buildWelcomeEmail(name: string, communityName: string) {
  return {
    subject: `Bienvenido a ${communityName} en Kolmena`,
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px;">
        <h1 style="color: #F5A623; font-size: 24px; margin-bottom: 8px;">Bienvenido a Kolmena</h1>
        <p style="color: #3D2E1E; font-size: 16px; line-height: 1.6;">
          Hola <strong>${name}</strong>, ya eres parte de <strong>${communityName}</strong>.
        </p>
        <p style="color: #7C6E58; font-size: 14px; line-height: 1.6;">
          Desde la app puedes ver el muro de la comunidad, reportar incidencias,
          hacer reservas de espacios comunes y mucho más.
        </p>
        <a href="${env.APP_URL}" style="display: inline-block; margin-top: 24px; padding: 12px 24px; background: #F5A623; color: #fff; border-radius: 8px; text-decoration: none; font-weight: 600;">
          Abrir Kolmena
        </a>
      </div>
    `,
    text: `Bienvenido a ${communityName}. Hola ${name}, ya eres parte de la comunidad en Kolmena.`,
  };
}

export function buildIncidentUpdateEmail(
  recipientName: string,
  incidentTitle: string,
  newStatus: string,
  note?: string,
) {
  const statusLabels: Record<string, string> = {
    assigned: 'Asignada a un técnico',
    in_progress: 'En progreso',
    waiting_parts: 'Esperando material',
    resolved: 'Resuelta',
    closed: 'Cerrada',
  };

  const statusLabel = statusLabels[newStatus] ?? newStatus;

  return {
    subject: `Incidencia actualizada: ${incidentTitle}`,
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px;">
        <h1 style="color: #F5A623; font-size: 20px;">Actualización de incidencia</h1>
        <p style="color: #3D2E1E;">Hola <strong>${recipientName}</strong>,</p>
        <p style="color: #3D2E1E;">
          La incidencia <strong>${incidentTitle}</strong> ha cambiado de estado a:
        </p>
        <p style="display: inline-block; padding: 6px 14px; background: #FFF3E0; color: #B87200; border-radius: 20px; font-weight: 600; font-size: 14px;">
          ${statusLabel}
        </p>
        ${note ? `<p style="color: #7C6E58; font-size: 14px; margin-top: 16px;"><em>Nota: ${note}</em></p>` : ''}
        <a href="${env.APP_URL}" style="display: inline-block; margin-top: 24px; padding: 12px 24px; background: #F5A623; color: #fff; border-radius: 8px; text-decoration: none; font-weight: 600;">
          Ver en Kolmena
        </a>
      </div>
    `,
    text: `Tu incidencia "${incidentTitle}" está ahora: ${statusLabel}${note ? `. Nota: ${note}` : ''}.`,
  };
}

export function buildPasswordResetEmail(name: string, resetUrl: string) {
  return {
    subject: 'Restablecer contraseña — Kolmena',
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px;">
        <h1 style="color: #F5A623; font-size: 20px;">Restablecer contraseña</h1>
        <p style="color: #3D2E1E;">Hola <strong>${name}</strong>,</p>
        <p style="color: #3D2E1E;">Recibiste este correo porque solicitaste restablecer tu contraseña en Kolmena.</p>
        <a href="${resetUrl}" style="display: inline-block; margin-top: 16px; padding: 12px 24px; background: #F5A623; color: #fff; border-radius: 8px; text-decoration: none; font-weight: 600;">
          Restablecer contraseña
        </a>
        <p style="color: #9E8E77; font-size: 12px; margin-top: 24px;">
          Este enlace expira en 1 hora. Si no solicitaste este cambio, ignora este correo.
        </p>
      </div>
    `,
    text: `Para restablecer tu contraseña visita: ${resetUrl}. Expira en 1 hora.`,
  };
}
