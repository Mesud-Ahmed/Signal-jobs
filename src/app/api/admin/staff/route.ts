import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession, hashPassword } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getAdminSession();
    if (!session || session.role === "DATA_ENTRY") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    const staffUsers = await db.adminUser.findMany({
      where: { role: "DATA_ENTRY" },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      staffUsers,
      staffUser: staffUsers[0] || null,
    });
  } catch (error) {
    console.error("GET staff API error:", error);
    return NextResponse.json({ error: "Failed to fetch staff accounts" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session || session.role === "DATA_ENTRY") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    const body = await req.json();
    const { username, email, password } = body;

    if (!username?.trim() || !password || password.length < 6) {
      return NextResponse.json(
        { error: "Username and password (min 6 characters) are required." },
        { status: 400 }
      );
    }

    const cleanUsername = username.trim();
    const cleanEmail = (email?.trim() || `${cleanUsername.toLowerCase()}@signaljob.et`).toLowerCase();
    const passwordHash = await hashPassword(password);

    // Check if a staff account already exists
    const existingStaff = await db.adminUser.findFirst({
      where: {
        OR: [
          { role: "DATA_ENTRY" },
          { username: cleanUsername },
          { email: cleanEmail },
        ],
      },
    });

    let updatedUser;
    let actionType = "STAFF_USER_UPDATED";

    if (existingStaff) {
      // Prevent overwriting SUPERADMIN/ADMIN if username clashes
      if (existingStaff.role !== "DATA_ENTRY") {
        return NextResponse.json(
          { error: "A primary administrator already uses this username or email." },
          { status: 400 }
        );
      }

      updatedUser = await db.adminUser.update({
        where: { id: existingStaff.id },
        data: {
          username: cleanUsername,
          email: cleanEmail,
          passwordHash,
          role: "DATA_ENTRY",
        },
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
          lastLoginAt: true,
          createdAt: true,
        },
      });
    } else {
      actionType = "STAFF_USER_CREATED";
      updatedUser = await db.adminUser.create({
        data: {
          username: cleanUsername,
          email: cleanEmail,
          passwordHash,
          role: "DATA_ENTRY",
        },
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
          lastLoginAt: true,
          createdAt: true,
        },
      });
    }

    // Log admin action
    await db.adminLog.create({
      data: {
        adminId: session.adminId,
        action: actionType,
        details: `Configured Data Entry account credentials for "${cleanUsername}" (${cleanEmail}).`,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Staff account "${cleanUsername}" updated successfully.`,
      user: updatedUser,
    });
  } catch (error: any) {
    console.error("POST staff API error:", error);
    if (error?.code === "P2002") {
      return NextResponse.json(
        { error: "Username or email is already in use by another account." },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: "Failed to update staff credentials" }, { status: 500 });
  }
}

