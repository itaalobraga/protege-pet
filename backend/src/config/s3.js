import { S3Client } from "@aws-sdk/client-s3";

const region = process.env.AWS_REGION;

if (!region) {
  throw new Error("AWS_REGION não configurada");
}

// Alguns buckets obrigam endpoint regional específico (erro PermanentRedirect 301).
// Você pode configurar explicitamente via AWS_S3_ENDPOINT, ex:
// https://protegepet-uploads.s3.us-east-2.amazonaws.com
const endpoint = process.env.AWS_S3_ENDPOINT || undefined;

// Credenciais são lidas automaticamente de:
// - AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY (e opcional AWS_SESSION_TOKEN)
// - ou IAM Role (ECS/EC2)
// - ou outras fontes suportadas pelo AWS SDK
export const s3 = new S3Client({ region, endpoint });
