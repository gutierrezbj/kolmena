import { scrypt, randomBytes, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import { SignJWT, jwtVerify } from 'jose';
import { eq } from 'drizzle-orm';
import { db } from '../../shared/db/client.js';
import { users, refreshTokens } from '../../shared/db/schema.js';
import { env } from '../../config/env.js';
import { generateId } from '../../shared/utils/uuid.js';
import { AppError } from '../../shared/errors/app-error.js';
import { ErrorCode } from '../../shared/errors/error-codes.js';
import type { AuthUser } from '../../shared/types/index.js';

const scryptAsync = promisify(scrypt);
const SECRET = new TextEncoder().encode(env.JWT_SECRET);

// --- Password hashing (scrypt, no external deps) ---

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex');
  const derived = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${salt}:${derived.toString('hex')}`;
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const parts = hash.split(':');
  const salt = parts[0]!;
  const key = parts[1]!;
  const derived = (await scryptAsync(password, salt, 64)) as Buffer;
  return timingSafeEqual(Buffer.from(key, 'hex'), derived);
}

// --- JWT ---

function parseDuration(duration: string): number {
  const match = duration.match(/^(\d+)([smhd])$/);
  if (!match) return 900; // fallback 15m
  const value = parseInt(match[1]!);
  const unit = match[2]!;
  const multipliers: Record<string, number> = { s: 1, m: 60, h: 3600, d: 86400 };
  return value * (multipliers[unit] ?? 60);
}

export async function signAccessToken(user: AuthUser): Promise<string> {
  return new SignJWT({ sub: user.id, email: user.email, name: user.name, role: user.role, communityId: user.communityId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${parseDuration(env.JWT_ACCESS_EXPIRES_IN)}s`)
    .setIssuer('kolmena')
    .sign(SECRET);
}

export async function signRefreshToken(userId: string): Promise<string> {
  const tokenId = generateId();
  const expiresInSec = parseDuration(env.JWT_REFRESH_EXPIRES_IN);
  const expiresAt = new Date(Date.now() + expiresInSec * 1000);

  const token = await new SignJWT({ sub: userId, jti: tokenId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${expiresInSec}s`)
    .setIssuer('kolmena')
    .sign(SECRET);

  // Store hash of refresh token for revocation support
  const hash = (await scryptAsync(token, tokenId, 32) as Buffer).toString('hex');
  await db.insert(refreshTokens).values({
    id: tokenId,
    userId,
    tokenHash: hash,
    expiresAt,
  });

  return token;
}

export async function verifyAccessToken(token: string): Promise<AuthUser> {
  try {
    const { payload } = await jwtVerify(token, SECRET, { issuer: 'kolmena' });
    return {
      id: payload.sub!,
      email: payload['email'] as string,
      name: payload['name'] as string,
      role: payload['role'] as AuthUser['role'],
      communityId: payload['communityId'] as string | undefined,
    };
  } catch {
    throw new AppError(ErrorCode.TOKEN_EXPIRED, 'Invalid or expired access token');
  }
}

export async function rotateRefreshToken(token: string): Promise<{ accessToken: string; refreshToken: string }> {
  let payload;
  try {
    const result = await jwtVerify(token, SECRET, { issuer: 'kolmena' });
    payload = result.payload;
  } catch {
    throw new AppError(ErrorCode.TOKEN_EXPIRED, 'Invalid or expired refresh token');
  }

  const tokenId = payload.jti!;
  const userId = payload.sub!;

  // Delete used refresh token (rotation = single use)
  const deleted = await db.delete(refreshTokens).where(eq(refreshTokens.id, tokenId)).returning();
  if (deleted.length === 0) {
    throw new AppError(ErrorCode.UNAUTHORIZED, 'Refresh token already used or revoked');
  }

  // Look up user for new access token
  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!user || !user.isActive) {
    throw new AppError(ErrorCode.UNAUTHORIZED, 'User not found or inactive');
  }

  const authUser: AuthUser = { id: user.id, email: user.email, name: user.name, role: 'resident' };
  const accessToken = await signAccessToken(authUser);
  const refreshToken = await signRefreshToken(userId);

  return { accessToken, refreshToken };
}

// --- User operations ---

export async function registerUser(email: string, password: string, name: string) {
  const existing = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
  if (existing.length > 0) {
    throw new AppError(ErrorCode.CONFLICT, 'Email already registered');
  }

  const id = generateId();
  const passwordHash = await hashPassword(password);

  const [user] = await db.insert(users).values({ id, email, passwordHash, name }).returning();
  return user;
}

export async function loginUser(email: string, password: string) {
  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (!user || !user.passwordHash) {
    throw new AppError(ErrorCode.INVALID_CREDENTIALS, 'Invalid email or password');
  }

  if (!user.isActive) {
    throw new AppError(ErrorCode.FORBIDDEN, 'Account is deactivated');
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    throw new AppError(ErrorCode.INVALID_CREDENTIALS, 'Invalid email or password');
  }

  const authUser: AuthUser = { id: user.id, email: user.email, name: user.name, role: 'resident' };
  const accessToken = await signAccessToken(authUser);
  const refreshToken = await signRefreshToken(user.id);

  return { user: authUser, accessToken, refreshToken };
}
