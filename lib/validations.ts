import { z } from "zod";

export const CreateOrderSchema = z.object({
  serviceId: z.string().min(1, "Service ID is required"),
  packageId: z.string().min(1, "Package ID is required"),
  addonIds: z.array(z.string()).default([]),
  requirements: z.string().min(10, "Requirements must be at least 10 characters long").max(5000),
  turnstileToken: z.string().optional(),
  uploadedFiles: z
    .array(
      z.object({
        name: z.string(),
        url: z.string().url(),
        type: z.string(),
        size: z.number().optional(),
      })
    )
    .default([]),
});

export const OrderStatusEnum = z.enum([
  "PENDING",
  "UNDER_REVIEW",
  "ACCEPTED",
  "IN_PROGRESS",
  "AWAITING_RESPONSE",
  "REVISION",
  "COMPLETED",
  "CANCELLED",
]);

export const UpdateOrderStatusSchema = z.object({
  status: OrderStatusEnum,
  updateNote: z.string().max(1000).optional(),
});

export const CreateServiceSchema = z.object({
  title: z.string().min(3).max(100),
  slug: z.string().min(3).max(100).regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  description: z.string().min(10),
  basePrice: z.number().positive(),
  category: z.string().min(2),
  isActive: z.boolean().default(true),
  packages: z.array(
    z.object({
      name: z.string().min(2),
      description: z.string(),
      price: z.number().positive(),
      deliveryDays: z.number().int().positive(),
      features: z.array(z.string()),
    })
  ).min(1, "At least one package is required"),
  addons: z
    .array(
      z.object({
        name: z.string().min(2),
        price: z.number().positive(),
      })
    )
    .optional(),
});

export const RevisionRequestSchema = z.object({
  orderId: z.string().min(1),
  message: z.string().min(10, "Please describe the requested revisions with enough detail").max(2000),
});

export const ProjectMessageSchema = z.object({
  orderId: z.string().min(1),
  message: z.string().min(1).max(2000),
});
