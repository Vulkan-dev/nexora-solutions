import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProjectMessageSchema } from "@/lib/validations";
import { fallbackOrders } from "@/lib/fallback-store";

export const dynamic = "force-dynamic";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const result = ProjectMessageSchema.safeParse({
      orderId: params.id,
      message: body.message,
    });

    if (!result.success) {
      return NextResponse.json({ error: "Invalid message payload" }, { status: 400 });
    }

    const { message } = result.data;
    const orderId = params.id;
    const authorName = session.user.name || (session.user.role === "ADMIN" ? "Studio Director" : "Client");

    try {
      const update = await prisma.projectUpdate.create({
        data: {
          orderId,
          authorId: session.user.id,
          authorName,
          message,
        },
        include: {
          author: {
            select: { id: true, name: true, role: true },
          },
        },
      });

      return NextResponse.json({ success: true, message: update });
    } catch (e) {
      const fallbackMsg = {
        id: `msg_${Date.now()}`,
        orderId,
        message,
        createdAt: new Date().toISOString(),
        author: { name: authorName, role: session.user.role },
      };

      const memoryOrder = fallbackOrders.find((o) => o.id === orderId);
      if (memoryOrder) {
        if (!memoryOrder.updates) memoryOrder.updates = [];
        memoryOrder.updates.unshift(fallbackMsg);
      }

      return NextResponse.json({
        success: true,
        message: fallbackMsg,
      });
    }
  } catch (err) {
    return NextResponse.json({ error: "Failed to dispatch message" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const orderId = params.id;

    try {
      await prisma.projectUpdate.deleteMany({
        where: { orderId },
      });
    } catch (dbErr) {
      console.warn("DB delete updates error:", dbErr);
    }

    // Also clear from fallback memory
    const memoryOrder = fallbackOrders.find((o) => o.id === orderId);
    if (memoryOrder) {
      memoryOrder.updates = [];
    }

    return NextResponse.json({ success: true, message: "Chat history completely deleted." });
  } catch (err) {
    return NextResponse.json({ error: "Failed to delete chat history" }, { status: 500 });
  }
}
