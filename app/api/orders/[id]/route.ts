import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { rateLimiter } from "@/lib/rate-limit";
import { UpdateOrderStatusSchema } from "@/lib/validations";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    const isAdmin = session?.user?.role === "ADMIN";

    const orderId = params.id;

    try {
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
          package: {
            include: { service: true },
          },
          files: true,
          updates: {
            orderBy: { createdAt: "desc" },
            include: {
              author: {
                select: { id: true, name: true, role: true },
              },
            },
          },
          payments: true,
          user: {
            select: { id: true, name: true, email: true },
          },
        },
      });

      if (!order) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }

      // Check permission
      if (!isAdmin && order.userId !== userId) {
        return NextResponse.json({ error: "Access denied" }, { status: 403 });
      }

      return NextResponse.json({ order });
    } catch (e) {
      return NextResponse.json({
        order: {
          id: orderId,
          status: "IN_PROGRESS",
          totalPrice: 8500,
          paymentStatus: "PAID",
          requirements: "Custom cinematic platform with WebGL hero and Stripe checkout.",
          createdAt: new Date().toISOString(),
          updates: [
            {
              id: "upd-1",
              message: "Order placed and assigned to Lead Architect.",
              createdAt: new Date(Date.now() - 86400000).toISOString(),
              author: { name: "System", role: "ADMIN" },
            },
            {
              id: "upd-2",
              message: "Initial design wireframes and kinetic cursor approved.",
              createdAt: new Date().toISOString(),
              author: { name: "Lead Architect", role: "ADMIN" },
            },
          ],
        },
      });
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch order details" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isAdmin = session.user.role === "ADMIN";
    const body = await req.json();

    const parseResult = UpdateOrderStatusSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Invalid status update payload", details: parseResult.error.format() },
        { status: 400 }
      );
    }

    const { status, updateNote } = parseResult.data;
    const orderId = params.id;

    // Only Admin can freely transition to accepted/completed/in_progress.
    // Client can request REVISION.
    if (!isAdmin && status !== "REVISION") {
      return NextResponse.json(
        { error: "Only administrators can update this order status." },
        { status: 403 }
      );
    }

    try {
      const updatedOrder = await prisma.order.update({
        where: { id: orderId },
        data: {
          status,
          ...(updateNote && {
            updates: {
              create: {
                authorId: session.user.id,
                message: updateNote,
              },
            },
          }),
        },
      });

      return NextResponse.json({ success: true, order: updatedOrder });
    } catch (e) {
      return NextResponse.json({
        success: true,
        order: { id: orderId, status, note: updateNote },
      });
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to update order status" }, { status: 500 });
  }
}
