import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const pools = await prisma.pool.findMany({
      orderBy: {
        createdAt: "desc",
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

    return NextResponse.json(pools);
  } catch (error) {
    console.error("Error fetching pools:", error);
    return NextResponse.json(
      { error: "Failed to fetch pools" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
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
      creatorId,
    } = body;

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      + "-" + Date.now().toString(36);

    const pool = await prisma.pool.create({
      data: {
        slug,
        image,
        title,
        description,
        category,
        goal: parseFloat(goal),
        contributors: parseInt(contributors),
        location,
        localGovernment,
        town,
        street,
        deadline: new Date(deadline),
        creatorId: creatorId || "system",
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

    return NextResponse.json(pool, { status: 201 });
  } catch (error) {
    console.error("Error creating pool:", error);
    return NextResponse.json(
      { error: "Failed to create pool" },
      { status: 500 }
    );
  }
}
