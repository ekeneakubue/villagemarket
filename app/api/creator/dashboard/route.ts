import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const creatorId = searchParams.get("creatorId");

    if (!creatorId) {
      return NextResponse.json(
        { error: "Creator ID is required" },
        { status: 400 }
      );
    }

    // Get all pools created by this creator
    const pools = await prisma.pool.findMany({
      where: { creatorId },
      orderBy: { createdAt: "desc" },
    });

    const poolIds = pools.map((p) => p.id);

    // Get all contributions for these pools
    const contributions = await prisma.contribution.findMany({
      where: {
        poolId: { in: poolIds },
        status: "SUCCESS",
      },
      orderBy: { createdAt: "desc" },
    });

    // Create pool map for easy lookup
    const poolMap = new Map(pools.map((p) => [p.id, p]));

    // Combine contributions with pool data
    const contributionsWithPools = contributions.map((c) => ({
      ...c,
      pool: poolMap.get(c.poolId) || null,
    }));

    // Calculate stats
    const totalRaised = contributions.reduce((sum, c) => sum + c.amount, 0);
    const totalContributors = contributions.length;
    const totalSlots = contributions.reduce((sum, c) => sum + c.slots, 0);
    const activePools = pools.filter((p) => p.status === "ACTIVE").length;
    const completedPools = pools.filter((p) => p.status === "COMPLETED").length;
    const pendingDeliveries = contributions.filter(
      (c) => c.deliveryStatus === "PENDING" || c.deliveryStatus === "PROCESSING"
    ).length;
    const completedDeliveries = contributions.filter(
      (c) => c.deliveryStatus === "DELIVERED"
    ).length;

    // Get recent transactions (last 10)
    const recentTransactions = contributionsWithPools.slice(0, 10);

    // Get pending deliveries
    const pendingDeliveryList = contributionsWithPools.filter(
      (c) => c.deliveryStatus !== "DELIVERED" && c.deliveryStatus !== "CANCELLED"
    );

    return NextResponse.json({
      pools,
      contributions: contributionsWithPools,
      recentTransactions,
      pendingDeliveries: pendingDeliveryList,
      stats: {
        totalPools: pools.length,
        activePools,
        completedPools,
        totalRaised,
        totalContributors,
        totalSlots,
        pendingDeliveries,
        completedDeliveries,
      },
    });
  } catch (error) {
    console.error("Error fetching creator dashboard:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}

