import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

export async function POST(request: NextRequest) {
  try {
    // Ensure Paystack secret key is configured
    if (!PAYSTACK_SECRET_KEY) {
      console.error("PAYSTACK_SECRET_KEY is not set in the environment");
      return NextResponse.json(
        { error: "Payment configuration error. Please contact support." },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { poolId, userId, email, name, phone, amount, slots = 1 } = body;

    // Validate required fields
    if (!poolId || !userId || !email || !name || !amount) {
      return NextResponse.json(
        { error: "Missing required fields: poolId, userId, email, name, amount" },
        { status: 400 }
      );
    }

    // Validate amount is positive
    if (amount <= 0) {
      return NextResponse.json(
        { error: "Amount must be greater than 0" },
        { status: 400 }
      );
    }

    // Validate slots is a positive integer
    if (!Number.isInteger(slots) || slots < 1) {
      return NextResponse.json(
        { error: "Slots must be a positive integer" },
        { status: 400 }
      );
    }

    // Verify user exists and is active
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found. Please sign in again." },
        { status: 401 }
      );
    }

    if (user.status !== "ACTIVE") {
      return NextResponse.json(
        { error: "Your account is not active. Please contact support." },
        { status: 403 }
      );
    }

    // Verify email matches the user
    if (user.email !== email) {
      return NextResponse.json(
        { error: "Email mismatch. Please sign in again." },
        { status: 400 }
      );
    }

    // Check if pool exists and is active
    const pool = await prisma.pool.findUnique({
      where: { id: poolId },
    });

    if (!pool) {
      return NextResponse.json({ error: "Pool not found" }, { status: 404 });
    }

    if (pool.status !== "ACTIVE") {
      return NextResponse.json(
        { error: "This pool is not accepting contributions" },
        { status: 400 }
      );
    }

    // Check if user has already contributed to this pool
    const existingContribution = await prisma.contribution.findFirst({
      where: {
        poolId,
        userId,
        status: "SUCCESS",
      },
    });

    if (existingContribution) {
      return NextResponse.json(
        { error: "You have already contributed to this pool" },
        { status: 400 }
      );
    }

    // Check if enough slots are available
    const availableSlots = pool.contributors - pool.currentContributors;
    if (slots > availableSlots) {
      return NextResponse.json(
        { error: `Only ${availableSlots} slot(s) available in this pool` },
        { status: 400 }
      );
    }

    // Generate unique reference
    const reference = `VM-${poolId.slice(-6)}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    // Create pending contribution record
    const contribution = await prisma.contribution.create({
      data: {
        poolId,
        userId,
        email,
        name,
        phone: phone || null,
        amount,
        slots,
        reference,
        status: "PENDING",
      },
    });

    // Determine app base URL for redirects (fallbacks for safety)
    const appOrigin =
      request.nextUrl.origin ||
      process.env.NEXT_PUBLIC_APP_URL ||
      "http://localhost:3000";

    // Initialize Paystack transaction
    const paystackResponse = await fetch(
      "https://api.paystack.co/transaction/initialize",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          amount: Math.round(amount * 100), // Paystack expects amount in kobo
          reference,
          // Where Paystack redirects the user after payment
          callback_url: `${appOrigin}/api/payments/verify?reference=${reference}`,
          metadata: {
            poolId,
            contributionId: contribution.id,
            poolTitle: pool.title,
            contributorName: name,
            slots,
          },
        }),
      }
    );

    let paystackData: any = null;
    try {
      paystackData = await paystackResponse.json();
    } catch (err) {
      console.error("Paystack init response parse error:", err);
    }

    if (!paystackResponse.ok || !paystackData?.status) {
      // Delete the pending contribution if Paystack initialization fails
      await prisma.contribution.delete({
        where: { id: contribution.id },
      });

      console.error("Paystack init failed", {
        httpStatus: paystackResponse.status,
        message: paystackData?.message,
        errors: paystackData?.errors,
      });

      return NextResponse.json(
        { error: paystackData?.message || "Failed to initialize payment" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        authorization_url: paystackData.data.authorization_url,
        access_code: paystackData.data.access_code,
        reference: paystackData.data.reference,
      },
    });
  } catch (error) {
    console.error("Payment initialization error:", error);
    return NextResponse.json(
      { error: "Failed to initialize payment" },
      { status: 500 }
    );
  }
}

