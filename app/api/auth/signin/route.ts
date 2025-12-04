import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, accountType } = body;

    if (!email || !password || !accountType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Handle Creator sign in
    if (accountType === "creator") {
      const creator = await prisma.creator.findUnique({
        where: { email },
        select: {
          id: true,
          email: true,
          name: true,
          avatar: true,
          phone: true,
          organization: true,
          status: true,
          password: true,
        },
      });

      if (!creator) {
        return NextResponse.json(
          { error: "Invalid email or password" },
          { status: 401 }
        );
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, creator.password);

      if (!isPasswordValid) {
        return NextResponse.json(
          { error: "Invalid email or password" },
          { status: 401 }
        );
      }

      // Check if creator account is verified
      if (creator.status === "PENDING") {
        return NextResponse.json(
          { error: "Your account is not yet verified. Please contact Admin." },
          { status: 403 }
        );
      }

      if (creator.status === "SUSPENDED") {
        return NextResponse.json(
          { error: "Your account has been suspended. Please contact Admin." },
          { status: 403 }
        );
      }

      // Remove password from response
      const { password: _, ...creatorWithoutPassword } = creator;

      return NextResponse.json({
        success: true,
        user: {
          ...creatorWithoutPassword,
          role: "CREATOR",
        },
        message: "Sign in successful",
      });
    }

    // Handle User sign in
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        role: true,
        status: true,
        phone: true,
        password: true,
      },
    });

    if (!user) {
      // Check if email exists in creator table
      const creatorExists = await prisma.creator.findUnique({
        where: { email },
        select: { id: true },
      });

      if (creatorExists) {
        return NextResponse.json(
          { error: "This account does not exist in user portal. Please sign up or try signing in as creator." },
          { status: 401 }
        );
      }

      return NextResponse.json(
        { error: "This account does not exist in user portal. Please sign up or try signing in as creator." },
        { status: 401 }
      );
    }

    // Check if account is active
    if (user.status !== "ACTIVE") {
      return NextResponse.json(
        { error: "Your account is not active. Please contact support." },
        { status: 403 }
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
      message: "Sign in successful",
    });
  } catch (error) {
    console.error("Sign in error:", error);
    return NextResponse.json(
      { error: "An error occurred during sign in" },
      { status: 500 }
    );
  }
}




