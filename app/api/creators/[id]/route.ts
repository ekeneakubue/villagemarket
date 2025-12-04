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

    // Determine if this is a status-only update or a full profile update
    const updateData: any = {};

    // If status is provided alone, it's a status update
    if (body.status && Object.keys(body).length === 1) {
      const validStatuses = ["PENDING", "VERIFIED", "SUSPENDED"];
      if (!validStatuses.includes(body.status)) {
        return NextResponse.json(
          { error: "Invalid status" },
          { status: 400 }
        );
      }
      updateData.status = body.status;
    } else {
      // Full profile update
      if (body.name) updateData.name = body.name;
      if (body.email) updateData.email = body.email;
      if (body.phone) updateData.phone = body.phone;
      if (body.organization !== undefined) updateData.organization = body.organization || null;
      if (body.address !== undefined) updateData.address = body.address || null;
      if (body.idType) updateData.idType = body.idType;
      if (body.idNumber) updateData.idNumber = body.idNumber;
      if (body.avatar !== undefined) updateData.avatar = body.avatar || null;
      if (body.status) {
        const validStatuses = ["PENDING", "VERIFIED", "SUSPENDED"];
        if (validStatuses.includes(body.status)) {
          updateData.status = body.status;
        }
      }
    }

    const creator = await prisma.creator.update({
      where: { id },
      data: updateData,
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

