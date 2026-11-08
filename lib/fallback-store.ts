// Shared memory fallback store for orders and updates when PostgreSQL is offline or initializing

export interface FallbackOrder {
  id: string;
  userId: string;
  packageId?: string | null;
  serviceId?: string | null;
  serviceTitle?: string | null;
  packageName?: string | null;
  appType?: string | null;
  customAppType?: string | null;
  colorThemeMode?: string | null;
  customColors?: string[];
  referenceLinks?: string | null;
  clientName?: string | null;
  clientEmail?: string | null;
  totalPrice: number;
  status: string;
  paymentStatus: string;
  requirements?: string | null;
  selectedAddons?: any[];
  files: any[];
  updates: any[];
  payments?: any[];
  createdAt: string;
  updatedAt?: string;
  package?: any;
  user?: any;
}

const globalForStore = globalThis as unknown as {
  __fallbackOrders: FallbackOrder[] | undefined;
};

export const fallbackOrders: FallbackOrder[] =
  globalForStore.__fallbackOrders ?? [];

if (process.env.NODE_ENV !== "production") {
  globalForStore.__fallbackOrders = fallbackOrders;
}
