import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Fetch all statistics in parallel for better performance
    const [
      totalPools,
      activePools,
      completedPools,
      pendingPools,
      cancelledPools,
      totalUsers,
      totalContributions,
      pendingCreators,
      recentPools,
      recentUsers,
    ] = await Promise.all([
      // Total pools
      prisma.pool.count(),
      
      // Active pools
      prisma.pool.count({
        where: { status: "ACTIVE" },
      }),
      
      // Completed pools
      prisma.pool.count({
        where: { status: "COMPLETED" },
      }),
      
      // Pending pools
      prisma.pool.count({
        where: { status: "PENDING" },
      }),
      
      // Cancelled pools
      prisma.pool.count({
        where: { status: "CANCELLED" },
      }),
      
      // Total users
      prisma.user.count(),
      
      // Total contributions with sum
      prisma.contribution.aggregate({
        where: { status: "SUCCESS" },
        _sum: { amount: true },
        _count: true,
      }),
      
      // Pending creator approvals
      prisma.creator.count({
        where: { status: "PENDING" },
      }),
      
      // Recent pools (last 5) with creator info
      prisma.pool.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          slug: true,
          title: true,
          category: true,
          goal: true,
          currentAmount: true,
          currentContributors: true,
          status: true,
          image: true,
          creatorId: true,
          createdAt: true,
        },
      }),
      
      // Recent users (last 5)
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          status: true,
          totalContributed: true,
          createdAt: true,
          avatar: true,
        },
      }),
    ]);

    // Calculate stats
    const stats = {
      totalPools,
      activePools,
      completedPools,
      pendingPools,
      cancelledPools,
      totalUsers,
      totalTransactions: totalContributions._count,
      totalAmount: totalContributions._sum.amount || 0,
      pendingApprovals: pendingCreators,
    };

    // Debug logging
    console.log("Admin Stats:", {
      totalPools,
      activePools,
      completedPools,
      pendingPools,
      cancelledPools,
      verification: activePools + completedPools + pendingPools + cancelledPools,
      pendingCreators,
      totalUsers,
      totalTransactions: totalContributions._count,
    });

    // Fetch creator names for recent pools
    const creatorIds = recentPools.map(pool => pool.creatorId);
    const creators = await prisma.creator.findMany({
      where: { id: { in: creatorIds } },
      select: { id: true, name: true },
    });
    const creatorMap = Object.fromEntries(creators.map(c => [c.id, c.name]));

    // Format recent pools
    const formattedRecentPools = recentPools.map((pool) => ({
      id: pool.id,
      slug: pool.slug,
      title: pool.title,
      category: pool.category === "FOOD_STUFFS" ? "Food Stuffs" : "Livestock",
      creator: creatorMap[pool.creatorId] || "Unknown Creator",
      goal: pool.goal,
      current: pool.currentAmount,
      contributors: pool.currentContributors,
      status: pool.status.toLowerCase(),
      image: pool.image || "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=200&q=80",
      creatorId: pool.creatorId,
      createdAt: pool.createdAt.toISOString().split('T')[0],
    }));

    // Format recent users
    const formattedRecentUsers = recentUsers.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role === "ADMIN" ? "Admin" : "Contributor",
      status: user.status.toLowerCase(),
      totalContributed: user.totalContributed,
      joinedAt: user.createdAt.toISOString().split('T')[0],
      avatar: user.avatar,
    }));

    return NextResponse.json({
      stats,
      recentPools: formattedRecentPools,
      recentUsers: formattedRecentUsers,
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch admin statistics" },
      { status: 500 }
    );
  }
}

