import { z } from 'zod';

export const communitySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  address: z.string(),
  city: z.string(),
  postalCode: z.string(),
  province: z.string(),
  tier: z.enum(['free', 'basic', 'pro']),
});
export type Community = z.infer<typeof communitySchema>;

export const createCommunitySchema = z.object({
  name: z.string().min(1).max(255),
  address: z.string().min(1),
  city: z.string().min(1).max(100),
  postalCode: z.string().regex(/^\d{5}$/, 'Codigo postal espanol invalido'),
  province: z.string().min(1).max(100),
  cif: z.string().optional(),
});
export type CreateCommunity = z.infer<typeof createCommunitySchema>;
