import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { rateLimiter } from "@/lib/rate-limit";
import { CreateOrderSchema } from "@/lib/validations";
import { verifyTurnstileToken } from "@/lib/turnstile";
import { getAllServices } from "@/lib/catalog";
import { fallbackOrders } from "@/lib/fallback-store";
import { ensureDatabaseSeeded } from "@/lib/db-seed";

export const dynamic = "force-dynamic";

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

    // 4. Session & Identity Check
    const session = await getServerSession(authOptions);
    const user = session?.user;

    if (!user && !data.clientEmail) {
      return NextResponse.json(
        { error: "Authentication or client email is required to submit an order." },
        { status: 401 }
      );
    }

    const userEmail = user?.email || data.clientEmail!;
    const userName = user?.name || data.clientName || "Client";
    const userId = user?.id || `guest_${userEmail.replace(/[^a-zA-Z0-9]/g, "_")}`;

    // 5. Calculate Server-Side Pricing (Prevent tampering)
    const allServices = getAllServices();
    const service = allServices.find((s) => s.id === data.serviceId) || allServices[0];
    const selectedPkg = service?.packages.find((p) => p.id === data.packageId) || service?.packages[0];

    let calculatedTotal = selectedPkg?.price || 0;
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
      // Ensure database services are seeded
      await ensureDatabaseSeeded();

      // Ensure user exists in database to guarantee valid foreign key
      let dbUserId = userId;
      try {
        const dbUser = await prisma.user.upsert({
          where: { email: userEmail },
          update: { name: userName },
          create: {
            id: userId,
            email: userEmail,
            name: userName,
            role: user?.role === "ADMIN" ? "ADMIN" : "CUSTOMER",
          },
        });
        dbUserId = dbUser.id;
      } catch (userErr) {
        console.warn("User upsert notice:", (userErr as any)?.message || userErr);
      }

      createdOrder = await prisma.order.create({
        data: {
          userId: dbUserId,
          packageId: selectedPkg ? selectedPkg.id : undefined,
          serviceId: service ? service.id : undefined,
          serviceTitle: service?.title || "Custom Service",
          packageName: selectedPkg?.name || "Standard Package",
          appType: data.appType || service?.title,
          customAppType: data.customAppType || "",
          colorThemeMode: data.colorThemeMode || "DEV_CHOOSES",
          customColors: data.customColors || [],
          referenceLinks: data.referenceLinks || "",
          clientName: userName,
          clientEmail: userEmail,
          totalPrice: calculatedTotal,
          status: "PENDING",
          paymentStatus: "UNPAID",
          requirements: data.requirements,
          selectedAddons: resolvedAddons,
          files: {
            create: data.uploadedFiles.map((f) => ({
              uploaderId: dbUserId,
              fileName: f.name,
              fileUrl: f.url,
              fileType: f.type,
              fileSize: f.size || 0,
            })),
          },
          updates: {
            create: {
              authorId: dbUserId,
              authorName: userName,
              message: `Order submitted successfully. Selected package: ${selectedPkg.name} (${service.title}).`,
            },
          },
        },
        include: {
          files: true,
          updates: true,
          package: {
            include: {
              service: true,
            },
          },
        },
      });
    } catch (dbError) {
      console.warn("Prisma order insert fell back to local memory store:", (dbError as any)?.message || dbError);
      createdOrder = {
        id: `ord_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        userId,
        clientEmail: userEmail,
        clientName: userName,
        serviceTitle: service.title,
        packageName: selectedPkg.name,
        packageId: data.packageId,
        serviceId: service.id,
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
            author: { name: userName, role: user?.role || "CUSTOMER" },
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
    const userEmail = session?.user?.email;
    const isAdmin = session?.user?.role === "ADMIN";

    // Rate limit checks
    const ip = req.headers.get("x-forwarded-for") || req.ip || "127.0.0.1";
    await rateLimiter.limit(`orders:get:${ip}`);

    if (!session?.user) {
      return NextResponse.json({ orders: [] });
    }

    try {
      const orders = await prisma.order.findMany({
        where: isAdmin
          ? {}
          : {
              OR: [
                { userId: userId },
                ...(userEmail ? [{ clientEmail: userEmail }] : []),
              ],
            },
        include: {
          package: {
            include: {
              service: true,
            },
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
            (o) =>
              (userId && o.userId === userId) ||
              (userEmail && o.clientEmail === userEmail)
          );
      return NextResponse.json({ orders: filtered });
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to retrieve orders" }, { status: 500 });
  }
}
