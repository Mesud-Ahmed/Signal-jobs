import { PrismaClient } from "@prisma/client";

function getDatabaseUrl(): string | undefined {
  let url = process.env.DATABASE_URL;
  if (!url) return undefined;

  // Optimize connection pool & timeout parameters for Railway PostgreSQL proxy
  if (url.startsWith("postgres://") || url.startsWith("postgresql://")) {
    const hasParams = url.includes("?");
    const separator = hasParams ? "&" : "?";

    let paramsToAdd = "";
    if (!url.includes("connection_limit")) {
      paramsToAdd += `${paramsToAdd ? "&" : separator}connection_limit=15`;
    }
    if (!url.includes("pool_timeout")) {
      paramsToAdd += `${paramsToAdd ? "&" : separator}pool_timeout=20`;
    }
    if (!url.includes("connect_timeout")) {
      paramsToAdd += `${paramsToAdd ? "&" : separator}connect_timeout=15`;
    }

    if (paramsToAdd) {
      url += paramsToAdd;
    }
  }

  return url;
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const databaseUrl = getDatabaseUrl();

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: databaseUrl ? { db: { url: databaseUrl } } : undefined,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

// Cache the instance on globalThis in all environments to prevent
// connection pool exhaustion on hot reloads or crash restarts.
globalForPrisma.prisma = db;
