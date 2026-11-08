import { prisma } from "@/lib/prisma";
import { INITIAL_SERVICES } from "@/lib/catalog";

export async function ensureDatabaseSeeded() {
  try {
    const serviceCount = await prisma.service.count();
    if (serviceCount > 0) return;

    for (const s of INITIAL_SERVICES) {
      await prisma.service.upsert({
        where: { slug: s.slug },
        update: {
          title: s.title,
          category: s.category,
          description: s.description,
          basePrice: s.basePrice,
          isActive: s.isActive,
        },
        create: {
          id: s.id,
          slug: s.slug,
          title: s.title,
          category: s.category,
          description: s.description,
          basePrice: s.basePrice,
          isActive: s.isActive,
          packages: {
            create: s.packages.map((pkg) => ({
              id: pkg.id,
              name: pkg.name,
              description: pkg.description,
              price: pkg.price,
              deliveryDays: pkg.deliveryDays,
              features: pkg.features,
            })),
          },
          addons: {
            create: s.addons.map((a) => ({
              id: a.id,
              name: a.name,
              price: a.price,
            })),
          },
        },
      });
    }
  } catch (err) {
    // If DB is offline or table does not exist yet, log quietly without breaking request flow
    console.warn("Auto-seed notice (DB connection or push pending):", (err as any)?.message || err);
  }
}
