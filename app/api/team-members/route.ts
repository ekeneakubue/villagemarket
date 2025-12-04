import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const teamMembers = await prisma.teamMember.findMany({
      orderBy: [
        { displayOrder: "asc" },
        { createdAt: "asc" },
      ],
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

    return NextResponse.json(teamMembers);
  } catch (error) {
    console.error("Error fetching team members:", error);
    return NextResponse.json(
      { error: "Failed to fetch team members" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, role, bio, avatar, displayOrder } = body;

    if (!name || !role || !bio) {
      return NextResponse.json(
        { error: "Name, role, and bio are required" },
        { status: 400 }
      );
    }

    const member = await prisma.teamMember.create({
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

    return NextResponse.json(member, { status: 201 });
  } catch (error) {
    console.error("Error creating team member:", error);
    return NextResponse.json(
      { error: "Failed to create team member" },
      { status: 500 }
    );
  }
}


