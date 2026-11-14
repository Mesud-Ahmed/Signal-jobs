import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const startTime = Date.now();
  let dbStatus = "healthy";

  try {
    // Quick probe to ensure database connectivity with timeout
    const probe = db.$queryRaw`SELECT 1`;
    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("DB probe timeout")), 2500)
    );
    await Promise.race([probe, timeout]);
  } catch (error) {
    dbStatus = "unreachable";
    console.error("Health check DB error:", error);
  }

  const responseTimeMs = Date.now() - startTime;

  const healthData = {
    name: "Signal Job API",
    status: dbStatus === "healthy" ? "healthy" : "degraded",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: dbStatus,
    responseTimeMs,
    version: "0.1.0-mvp",
    features: {
      ai_extraction: true,
      telegram_bot: true,
      matching_engine: true,
    },
  };

  return NextResponse.json(healthData, {
    status: dbStatus === "healthy" ? 200 : 503,
  });
}
