import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request, context: any) {
  const params = await context.params;
  const { id } = params as { id: string };

  try {
    const member = await prisma.teamMember.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        role: true,
        bio: true,
        avatar: true,
        displayOrder: true,
        createdAt: true,
      },
    });

    if (!member) {
      return NextResponse.json(
        { error: "Team member not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(member);
  } catch (error) {
    console.error("Error fetching team member:", error);
    return NextResponse.json(
      { error: "Failed to fetch team member" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, context: any) {
  const params = await context.params;
  const { id } = params as { id: string };

  try {
    const body = await request.json();
    const { name, role, bio, avatar, displayOrder } = body;

    if (!name || !role || !bio) {
      return NextResponse.json(
        { error: "Name, role, and bio are required" },
        { status: 400 }
      );
    }

    const updated = await prisma.teamMember.update({
      where: { id },
      data: {
        name,
        role,
        bio,
        avatar: avatar || null,
        displayOrder: typeof displayOrder === "number" ? displayOrder : 0,
      },
      select: {
        id: true,
        name: true,
        role: true,
        bio: true,
        avatar: true,
        displayOrder: true,
        createdAt: true,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating team member:", error);
    return NextResponse.json(
      { error: "Failed to update team member" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, context: any) {
  const params = await context.params;
  const { id } = params as { id: string };

  try {
    await prisma.teamMember.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting team member:", error);
    return NextResponse.json(
      { error: "Failed to delete team member" },
      { status: 500 }
    );
  }
}


