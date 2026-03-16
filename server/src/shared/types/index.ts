export type UserRole = 'admin' | 'president' | 'resident' | 'provider' | 'inquiry';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  communityId?: string;
}

declare module 'fastify' {
  interface FastifyRequest {
    user?: AuthUser;
  }
}
