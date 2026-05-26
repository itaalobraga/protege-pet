import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../config/s3.js";

function requiredEnv(name) {
  const v = process.env[name];
  if (!v) throw new Error(`${name} não configurada`);
  return v;
}

const BUCKET = () => requiredEnv("AWS_S3_BUCKET");

function safeFilename(name) {
  return String(name || "arquivo")
    .trim()
    .replace(/[\\/\0]/g, "-")
    .slice(0, 150);
}

export async function uploadParaS3({ buffer, mimeType, originalName, idPrefix }) {
  const bucket = BUCKET();
  const prefix = String(idPrefix || "uploads").replace(/^\/+|\/+$/g, "");
  const key = `${prefix}/${Date.now()}-${safeFilename(originalName)}`;

  const cmd = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: buffer,
    ContentType: mimeType,
  });

  const result = await s3.send(cmd);

  return {
    bucket,
    key,
    etag: result?.ETag ? String(result.ETag).replace(/"/g, "") : null,
  };
}

export async function baixarDoS3({ bucket, key }) {
  const cmd = new GetObjectCommand({ Bucket: bucket, Key: key });
  return s3.send(cmd);
}
