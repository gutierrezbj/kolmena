import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { env } from '../config/env.js';
import { randomUUID } from 'node:crypto';
import path from 'node:path';
import fs from 'node:fs/promises';

const USE_R2 = !!(env.R2_ACCOUNT_ID && env.R2_ACCESS_KEY_ID && env.R2_SECRET_ACCESS_KEY);

const LOCAL_UPLOAD_DIR = path.join(process.cwd(), 'uploads');

let s3: S3Client | null = null;

if (USE_R2) {
  s3 = new S3Client({
    region: 'auto',
    endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: env.R2_ACCESS_KEY_ID!,
      secretAccessKey: env.R2_SECRET_ACCESS_KEY!,
    },
  });
}

function generateKey(originalName: string): string {
  const ext = path.extname(originalName).toLowerCase() || '.bin';
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '/');
  return `${date}/${randomUUID()}${ext}`;
}

export async function uploadFile(
  buffer: Buffer,
  originalName: string,
  contentType: string,
): Promise<string> {
  const key = generateKey(originalName);

  if (USE_R2 && s3) {
    await s3.send(new PutObjectCommand({
      Bucket: env.R2_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    }));
    // Return the R2 public URL or key — adjust domain when CDN is configured
    return `r2://${env.R2_BUCKET_NAME}/${key}`;
  }

  // Local filesystem fallback for development
  const filePath = path.join(LOCAL_UPLOAD_DIR, key);
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, buffer);
  return `/uploads/${key}`;
}

export async function deleteFile(fileUrl: string): Promise<void> {
  if (fileUrl.startsWith('r2://') && s3) {
    const key = fileUrl.replace(`r2://${env.R2_BUCKET_NAME}/`, '');
    await s3.send(new DeleteObjectCommand({
      Bucket: env.R2_BUCKET_NAME,
      Key: key,
    }));
    return;
  }

  if (fileUrl.startsWith('/uploads/')) {
    const filePath = path.join(LOCAL_UPLOAD_DIR, fileUrl.replace('/uploads/', ''));
    await fs.unlink(filePath).catch(() => {});
  }
}
