import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { rateLimiter } from "@/lib/rate-limit";
import { CreateOrderSchema } from "@/lib/validations";
import { verifyTurnstileToken } from "@/lib/turnstile";
import { getAllServices } from "@/lib/catalog";

// In-memory fallback for local demo when DB URL isn't configured
const fallbackOrders: any[] = [];

export async function POST(req: NextRequest) {
  try {
    // 1. Upstash Redis Rate Limiting
    const ip = req.headers.get("x-forwarded-for") || req.ip || "127.0.0.1";
    const rateLimitResult = await rateLimiter.limit(`orders:create:${ip}`);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a minute before creating another order." },
        { status: 429 }
      );
    }

    // 2. Parse & Zod Validate Body
    const body = await req.json();
    const validationResult = CreateOrderSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validationResult.error.format() },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // 3. Bot Protection: Cloudflare Turnstile
    if (data.turnstileToken) {
      const isHuman = await verifyTurnstileToken(data.turnstileToken, ip);
      if (!isHuman) {
        return NextResponse.json(
          { error: "Bot detection triggered. Turnstile verification failed." },
          { status: 403 }
        );
      }
    }

    // 4. Session Check
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id || (data.clientEmail ? `usr_${data.clientEmail.replace(/[^a-zA-Z0-9]/g, "_")}` : "usr_customer_sim_01");
    const userEmail = session?.user?.email || data.clientEmail || "alexandra.vance@atelier-client.com";
    const userName = session?.user?.name || data.clientName || "Alexandra Vance";

    // 5. Calculate Server-Side Pricing (Prevent tampering)
    const allServices = getAllServices();
    const service = allServices.find((s) => s.id === data.serviceId);
    if (!service) {
      return NextResponse.json({ error: "Invalid service selected" }, { status: 400 });
    }

    const selectedPkg = service.packages.find((p) => p.id === data.packageId);
    if (!selectedPkg) {
      return NextResponse.json({ error: "Invalid package tier selected" }, { status: 400 });
    }

    let calculatedTotal = selectedPkg.price;
    const resolvedAddons: any[] = [];

    if (data.addonIds && data.addonIds.length > 0) {
      for (const addonId of data.addonIds) {
        const foundAddon = service.addons.find((a) => a.id === addonId);
        if (foundAddon) {
          calculatedTotal += foundAddon.price;
          resolvedAddons.push(foundAddon);
        }
      }
    }

    // 6. Persistence: Try Prisma DB first, fallback smoothly
    let createdOrder: any = null;

    try {
      createdOrder = await prisma.order.create({
        data: {
          userId,
          packageId: data.packageId,
          totalPrice: calculatedTotal,
          status: "PENDING",
          paymentStatus: "UNPAID",
          requirements: data.requirements,
          selectedAddons: resolvedAddons,
          files: {
            create: data.uploadedFiles.map((f) => ({
              uploaderId: userId,
              fileName: f.name,
              fileUrl: f.url,
              fileType: f.type,
              fileSize: f.size || 0,
            })),
          },
          updates: {
            create: {
              authorId: userId,
              message: `Order submitted successfully. Selected package: ${selectedPkg.name} (${service.title}).`,
            },
          },
        },
        include: {
          files: true,
          updates: true,
        },
      });
    } catch (dbError) {
      console.warn("Prisma order insert fell back to local memory store:", dbError);
      createdOrder = {
        id: `ord_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        userId,
        userEmail,
        serviceTitle: service.title,
        packageName: selectedPkg.name,
        packageId: data.packageId,
        package: {
          id: selectedPkg.id,
          name: selectedPkg.name,
          deliveryDays: selectedPkg.deliveryDays,
          service: {
            id: service.id,
            title: service.title,
            category: service.category,
          },
        },
        user: {
          id: userId,
          name: userName,
          email: userEmail,
        },
        totalPrice: calculatedTotal,
        status: "PENDING",
        paymentStatus: "UNPAID",
        requirements: data.requirements,
        appType: data.appType || service.title,
        customAppType: data.customAppType || "",
        colorThemeMode: data.colorThemeMode || "DEV_CHOOSES",
        customColors: data.customColors || [],
        referenceLinks: data.referenceLinks || "",
        selectedAddons: resolvedAddons,
        files: data.uploadedFiles.map((f: any) => ({
          id: `file_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
          fileName: f.name,
          fileUrl: f.url,
          fileType: f.type,
          fileSize: f.size || 0,
        })),
        createdAt: new Date().toISOString(),
        updates: [
          {
            id: `upd_${Date.now()}`,
            message: `Order submitted successfully. Selected package: ${selectedPkg.name} (${service.title}).`,
            createdAt: new Date().toISOString(),
            author: "System",
          },
        ],
      };
      fallbackOrders.unshift(createdOrder);
    }

    return NextResponse.json(
      {
        success: true,
        orderId: createdOrder.id,
        totalPrice: calculatedTotal,
        status: createdOrder.status,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Order creation fatal error:", error);
    return NextResponse.json(
      { error: "Internal server error occurred while processing order." },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    const isAdmin = session?.user?.role === "ADMIN";

    // Rate limit checks
    const ip = req.headers.get("x-forwarded-for") || req.ip || "127.0.0.1";
    await rateLimiter.limit(`orders:get:${ip}`);

    try {
      const orders = await prisma.order.findMany({
        where: isAdmin ? {} : { userId: userId || "undefined" },
        include: {
          package: {
            include: {
              service: true,
            },
          },
          files: true,
          updates: {
            orderBy: { createdAt: "desc" },
          },
          user: {
            select: { id: true, name: true, email: true, image: true },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      return NextResponse.json({ orders });
    } catch (dbError) {
      // In-memory fallback
      const filtered = isAdmin
        ? fallbackOrders
        : fallbackOrders.filter(
            (o) => !userId || o.userId === userId || o.userEmail === session?.user?.email
          );
      return NextResponse.json({ orders: filtered.length > 0 ? filtered : fallbackOrders });
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to retrieve orders" }, { status: 500 });
  }
}
