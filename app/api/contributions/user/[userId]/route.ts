import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Get all successful contributions for this user
    const contributions = await prisma.contribution.findMany({
      where: {
        userId,
        status: "SUCCESS",
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Get unique pool IDs
    const poolIds = [...new Set(contributions.map((c) => c.poolId))];

    // Fetch all pools for these contributions
    const pools = await prisma.pool.findMany({
      where: {
        id: {
          in: poolIds,
        },
      },
    });

    // Create a map of pools for easy lookup
    const poolMap = new Map(pools.map((p) => [p.id, p]));

    // Combine contributions with pool data
    const contributionsWithPools = contributions.map((contribution) => {
      const pool = poolMap.get(contribution.poolId);
      return {
        ...contribution,
        pool: pool || null,
      };
    });

    // Calculate statistics
    const totalContributed = contributions.reduce((sum, c) => sum + c.amount, 0);
    const totalSlots = contributions.reduce((sum, c) => sum + c.slots, 0);
    const activePools = pools.filter((p) => p.status === "ACTIVE").length;
    const completedPools = pools.filter((p) => p.status === "COMPLETED").length;
    const pendingDeliveries = contributions.filter(
      (c) => c.deliveryStatus === "PENDING" || c.deliveryStatus === "PROCESSING"
    ).length;
    const deliveredCount = contributions.filter(
      (c) => c.deliveryStatus === "DELIVERED"
    ).length;

    return NextResponse.json({
      contributions: contributionsWithPools,
      stats: {
        totalContributed,
        totalSlots,
        totalPools: pools.length,
        activePools,
        completedPools,
        pendingDeliveries,
        deliveredCount,
      },
    });
  } catch (error) {
    console.error("Error fetching user contributions:", error);
    return NextResponse.json(
      { error: "Failed to fetch contributions" },
      { status: 500 }
    );
  }
}

