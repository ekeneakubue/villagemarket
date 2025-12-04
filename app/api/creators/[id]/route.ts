import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const creator = await prisma.creator.findUnique({
      where: { id },
      select: {
        id: true,
        avatar: true,
        name: true,
        email: true,
        phone: true,
        organization: true,
        address: true,
        idType: true,
        idNumber: true,
        status: true,
        poolsCreated: true,
        totalRaised: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!creator) {
      return NextResponse.json(
        { error: "Creator not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(creator);
  } catch (error) {
    console.error("Error fetching creator:", error);
    return NextResponse.json(
      { error: "Failed to fetch creator" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { error: "Status is required" },
        { status: 400 }
      );
    }

    const validStatuses = ["PENDING", "VERIFIED", "SUSPENDED"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }

    const creator = await prisma.creator.update({
      where: { id },
      data: { status },
      select: {
        id: true,
        avatar: true,
        name: true,
        email: true,
        phone: true,
        organization: true,
        address: true,
        idType: true,
        idNumber: true,
        status: true,
        poolsCreated: true,
        totalRaised: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(creator);
  } catch (error) {
    console.error("Error updating creator:", error);
    return NextResponse.json(
      { error: "Failed to update creator" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if creator has any pools
    const pools = await prisma.pool.findMany({
      where: { creatorId: id },
    });

    if (pools.length > 0) {
      return NextResponse.json(
        { error: "Cannot delete creator with existing pools. Please delete or transfer pools first." },
        { status: 400 }
      );
    }

    await prisma.creator.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting creator:", error);
    return NextResponse.json(
      { error: "Failed to delete creator" },
      { status: 500 }
    );
  }
}

