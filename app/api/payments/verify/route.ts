import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const reference = searchParams.get("reference");

    if (!reference) {
      return NextResponse.redirect(
        new URL("/browse?error=missing_reference", request.url)
      );
    }

    // Verify transaction with Paystack
    const paystackResponse = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const paystackData = await paystackResponse.json();

    if (!paystackData.status || paystackData.data.status !== "success") {
      // Update contribution status to failed
      await prisma.contribution.updateMany({
        where: { reference },
        data: { status: "FAILED" },
      });

      return NextResponse.redirect(
        new URL("/browse?error=payment_failed", request.url)
      );
    }

    // Get the contribution
    const contribution = await prisma.contribution.findUnique({
      where: { reference },
    });

    if (!contribution) {
      return NextResponse.redirect(
        new URL("/browse?error=contribution_not_found", request.url)
      );
    }

    // Update contribution to success
    await prisma.contribution.update({
      where: { reference },
      data: {
        status: "SUCCESS",
        paystackRef: paystackData.data.reference,
        paidAt: new Date(paystackData.data.paid_at),
      },
    });

    // Update pool's currentAmount and currentContributors
    await prisma.pool.update({
      where: { id: contribution.poolId },
      data: {
        currentAmount: { increment: contribution.amount },
        currentContributors: { increment: contribution.slots },
      },
    });

    // Update user's totalContributed
    if (contribution.userId) {
      await prisma.user.update({
        where: { id: contribution.userId },
        data: {
          totalContributed: { increment: contribution.amount },
        },
      });
    }

    // Redirect to contributor dashboard with success message
    return NextResponse.redirect(
      new URL("/dashboard?payment=success", request.url)
    );
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.redirect(
      new URL("/browse?error=verification_failed", request.url)
    );
  }
}

// Webhook handler for Paystack
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const event = body.event;

    if (event === "charge.success") {
      const { reference } = body.data;

      // Check if already processed
      const contribution = await prisma.contribution.findUnique({
        where: { reference },
      });

      if (contribution && contribution.status === "PENDING") {
        // Update contribution to success
        await prisma.contribution.update({
          where: { reference },
          data: {
            status: "SUCCESS",
            paystackRef: body.data.reference,
            paidAt: new Date(body.data.paid_at),
          },
        });

        // Update pool's currentAmount and currentContributors
        await prisma.pool.update({
          where: { id: contribution.poolId },
          data: {
            currentAmount: { increment: contribution.amount },
            currentContributors: { increment: contribution.slots },
          },
        });

        // Update user's totalContributed
        if (contribution.userId) {
          await prisma.user.update({
            where: { id: contribution.userId },
            data: {
              totalContributed: { increment: contribution.amount },
            },
          });
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook error" }, { status: 500 });
  }
}

