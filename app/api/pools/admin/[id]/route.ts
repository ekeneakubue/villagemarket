import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET - Get pool by ID (admin)
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const pool = await prisma.pool.findUnique({
      where: { id },
      select: {
        id: true,
        slug: true,
        image: true,
        title: true,
        description: true,
        category: true,
        goal: true,
        contributors: true,
        currentAmount: true,
        currentContributors: true,
        location: true,
        localGovernment: true,
        town: true,
        street: true,
        deadline: true,
        status: true,
        creatorId: true,
        createdAt: true,
      },
    });

    if (!pool) {
      return NextResponse.json(
        { error: "Pool not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(pool);
  } catch (error) {
    console.error("Error fetching pool:", error);
    return NextResponse.json(
      { error: "Failed to fetch pool" },
      { status: 500 }
    );
  }
}

// PUT - Update pool by ID (admin)
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const {
      image,
      title,
      description,
      category,
      goal,
      contributors,
      location,
      localGovernment,
      town,
      street,
      deadline,
    } = body;

    // Check if pool exists
    const existingPool = await prisma.pool.findUnique({
      where: { id },
    });

    if (!existingPool) {
      return NextResponse.json(
        { error: "Pool not found" },
        { status: 404 }
      );
    }

    // Update pool
    const updatedPool = await prisma.pool.update({
      where: { id },
      data: {
        image: image || null,
        title,
        description,
        category,
        goal,
        contributors,
        location,
        localGovernment,
        town: town || null,
        street: street || null,
        deadline: new Date(deadline),
      },
      select: {
        id: true,
        slug: true,
        image: true,
        title: true,
        description: true,
        category: true,
        goal: true,
        contributors: true,
        currentAmount: true,
        currentContributors: true,
        location: true,
        localGovernment: true,
        town: true,
        street: true,
        deadline: true,
        status: true,
        creatorId: true,
        createdAt: true,
      },
    });

    return NextResponse.json(updatedPool);
  } catch (error) {
    console.error("Error updating pool:", error);
    return NextResponse.json(
      { error: "Failed to update pool" },
      { status: 500 }
    );
  }
}

// DELETE - Delete pool by ID (admin)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if pool exists
    const existingPool = await prisma.pool.findUnique({
      where: { id },
    });

    if (!existingPool) {
      return NextResponse.json(
        { error: "Pool not found" },
        { status: 404 }
      );
    }

    // Delete pool
    await prisma.pool.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Pool deleted successfully" });
  } catch (error) {
    console.error("Error deleting pool:", error);
    return NextResponse.json(
      { error: "Failed to delete pool" },
      { status: 500 }
    );
  }
}




