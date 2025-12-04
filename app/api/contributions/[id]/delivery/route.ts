import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { deliveryStatus, deliveryNote } = body;

    if (!deliveryStatus) {
      return NextResponse.json(
        { error: "Delivery status is required" },
        { status: 400 }
      );
    }

    const validStatuses = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];
    if (!validStatuses.includes(deliveryStatus)) {
      return NextResponse.json(
        { error: "Invalid delivery status" },
        { status: 400 }
      );
    }

    const updateData: any = {
      deliveryStatus,
      deliveryNote: deliveryNote || null,
    };

    // Set deliveredAt timestamp if status is DELIVERED
    if (deliveryStatus === "DELIVERED") {
      updateData.deliveredAt = new Date();
    }

    const contribution = await prisma.contribution.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(contribution);
  } catch (error) {
    console.error("Error updating delivery status:", error);
    return NextResponse.json(
      { error: "Failed to update delivery status" },
      { status: 500 }
    );
  }
}

