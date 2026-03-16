import { z } from 'zod';

export const userRoleSchema = z.enum(['admin', 'president', 'resident', 'provider', 'inquiry']);
export type UserRole = z.infer<typeof userRoleSchema>;

export const userResponseSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string(),
  role: userRoleSchema,
  avatarUrl: z.string().nullable(),
});
export type UserResponse = z.infer<typeof userResponseSchema>;
