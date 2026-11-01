import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature") || "";
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: any;

  try {
    if (webhookSecret) {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } else {
      event = JSON.parse(body);
    }
  } catch (err: any) {
    console.error(`Stripe webhook signature error: ${err.message}`);
    return NextResponse.json({ error: "Webhook signature verification failed" }, { status: 400 });
  }

  // Handle successful checkout
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const orderId = session.metadata?.orderId;

    if (orderId) {
      try {
        await prisma.order.update({
          where: { id: orderId },
          data: {
            paymentStatus: "PAID",
            status: "ACCEPTED",
            payments: {
              create: {
                stripePaymentId: session.id,
                amount: (session.amount_total || 0) / 100,
                status: "PAID",
              },
            },
            updates: {
              create: {
                authorId: session.metadata?.userId || "system",
                message: `Payment confirmed via Stripe ($${((session.amount_total || 0) / 100).toFixed(2)}). Project status transitioned to ACCEPTED.`,
              },
            },
          },
        });
      } catch (dbErr) {
        console.warn("DB payment status update notice:", dbErr);
      }
    }
  }

  return NextResponse.json({ received: true });
}
