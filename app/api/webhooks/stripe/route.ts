import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  // If Stripe integration is disabled / skipped
  if (!stripe) {
    return NextResponse.json({ message: "Stripe payment gateway disabled" }, { status: 200 });
  }

  const body = await req.text();
  const signature = req.headers.get("stripe-signature") || "";
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: any;

  try {
    if (webhookSecret && signature) {
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
      const amountPaid = (session.amount_total || 0) / 100;
      try {
        // Record payment idempotently
        await prisma.payment.upsert({
          where: { stripePaymentId: session.id },
          update: {
            status: "PAID",
            amount: amountPaid,
          },
          create: {
            orderId,
            stripePaymentId: session.id,
            amount: amountPaid,
            status: "PAID",
          },
        });

        await prisma.order.update({
          where: { id: orderId },
          data: {
            paymentStatus: "PAID",
            status: "ACCEPTED",
            updates: {
              create: {
                authorName: "System",
                message: `Payment confirmed via Stripe ($${amountPaid.toFixed(2)}). Project status transitioned to ACCEPTED.`,
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
