import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { userService } from "@/services/telegram/userService";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: jobId } = await params;
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("u");

    const job = await db.job.findUnique({
      where: { id: jobId },
      select: { id: true, sourceUrl: true, applicationUrl: true },
    });

    if (!job) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // Log the meaningful interaction: user tapped "View & Apply"
    if (userId) {
      userService.trackInteraction(userId, job.id, "JOB_APPLIED").catch(() => null);
    }

    const destination = job.applicationUrl || job.sourceUrl || "/";
    return NextResponse.redirect(destination, 307);
  } catch (error) {
    console.error("View & Apply redirect error:", error);
    return NextResponse.redirect(new URL("/", req.url));
  }
}

