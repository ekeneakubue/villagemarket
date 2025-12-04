import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    const creators = await prisma.creator.findMany({
      orderBy: {
        createdAt: "desc",
      },
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
      },
    });

    return NextResponse.json(creators);
  } catch (error) {
    console.error("Error fetching creators:", error);
    return NextResponse.json(
      { error: "Failed to fetch creators" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { avatar, name, email, phone, organization, address, idType, idNumber, password } = body;

    // Validate required fields
    if (!name || !email || !phone || !idType || !idNumber || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if creator already exists with this email
    const existingByEmail = await prisma.creator.findUnique({
      where: { email },
    });

    if (existingByEmail) {
      return NextResponse.json(
        { error: "A creator with this email already exists" },
        { status: 409 }
      );
    }

    // Check if creator already exists with this phone
    const existingByPhone = await prisma.creator.findUnique({
      where: { phone },
    });

    if (existingByPhone) {
      return NextResponse.json(
        { error: "A creator with this phone number already exists" },
        { status: 409 }
      );
    }

    // Map idType to enum value
    const idTypeMap: Record<string, "NIN" | "VOTERS_CARD" | "DRIVERS_LICENSE" | "PASSPORT"> = {
      "NIN": "NIN",
      "Voters Card": "VOTERS_CARD",
      "Drivers License": "DRIVERS_LICENSE",
      "Passport": "PASSPORT",
    };

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const creator = await prisma.creator.create({
      data: {
        avatar: avatar || null,
        name,
        email,
        phone,
        organization: organization || null,
        address: address || null,
        idType: idTypeMap[idType] || "NIN",
        idNumber,
        password: hashedPassword,
        status: "PENDING",
        poolsCreated: 0,
        totalRaised: 0,
      },
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
      },
    });

    return NextResponse.json(creator, { status: 201 });
  } catch (error) {
    console.error("Error creating creator:", error);
    return NextResponse.json(
      { error: "Failed to create creator" },
      { status: 500 }
    );
  }
}

