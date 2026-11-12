import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function DELETE() {
  try {
    const session = await getAdminSession();
    if (!session || session.role === "DATA_ENTRY") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    const fiveDaysAgo = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000);

    const result = await db.userJobInteraction.deleteMany({
      where: {
        createdAt: {
          lt: fiveDaysAgo,
        },
      },
    });

    // Record admin log
    await db.adminLog.create({
      data: {
        adminId: session.adminId,
        action: "CLEANUP_INTERACTIONS",
        details: `Deleted ${result.count} interaction logs older than 5 days (prior to ${fiveDaysAgo.toISOString().split("T")[0]}).`,
      },
    });

    return NextResponse.json({
      success: true,
      count: result.count,
      message: `Successfully deleted ${result.count} logs older than 5 days.`,
    });
  } catch (error) {
    console.error("Interactions cleanup API error:", error);
    return NextResponse.json(
      { error: "Failed to cleanup interaction logs" },
      { status: 500 }
    );
  }
}

