import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { UpdateOrderStatusSchema } from "@/lib/validations";
import { fallbackOrders } from "@/lib/fallback-store";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    const userEmail = session?.user?.email;
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
        // Check fallback memory store
        const memoryOrder = fallbackOrders.find((o) => o.id === orderId);
        if (memoryOrder) {
          if (!isAdmin && memoryOrder.userId !== userId && memoryOrder.clientEmail !== userEmail) {
            return NextResponse.json({ error: "Access denied" }, { status: 403 });
          }
          return NextResponse.json({ order: memoryOrder });
        }
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }

      // Check permission
      if (!isAdmin && order.userId !== userId && order.clientEmail !== userEmail) {
        return NextResponse.json({ error: "Access denied" }, { status: 403 });
      }

      return NextResponse.json({ order });
    } catch (e) {
      const memoryOrder = fallbackOrders.find((o) => o.id === orderId);
      if (memoryOrder) {
        if (!isAdmin && memoryOrder.userId !== userId && memoryOrder.clientEmail !== userEmail) {
          return NextResponse.json({ error: "Access denied" }, { status: 403 });
        }
        return NextResponse.json({ order: memoryOrder });
      }
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
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
    const authorName = session.user.name || (isAdmin ? "Admin" : "Client");

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
                authorName,
                message: updateNote,
              },
            },
          }),
        },
      });

      return NextResponse.json({ success: true, order: updatedOrder });
    } catch (e) {
      const memoryOrder = fallbackOrders.find((o) => o.id === orderId);
      if (memoryOrder) {
        memoryOrder.status = status;
        if (updateNote) {
          memoryOrder.updates.unshift({
            id: `upd_${Date.now()}`,
            message: updateNote,
            createdAt: new Date().toISOString(),
            author: { name: authorName, role: session.user.role },
          });
        }
      }
      return NextResponse.json({
        success: true,
        order: { id: orderId, status, note: updateNote },
      });
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to update order status" }, { status: 500 });
  }
}
