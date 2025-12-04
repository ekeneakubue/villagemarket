import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const pool = await prisma.pool.findUnique({
      where: {
        slug,
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
