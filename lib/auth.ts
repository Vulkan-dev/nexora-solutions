import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET || "dev-super-secret-key-for-local-testing-min-32-chars-long",
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "placeholder_client_id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "placeholder_client_secret",
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      id: "simulated-auth",
      name: "Simulated Testing Login",
      credentials: {
        role: { label: "Role", type: "text" },
        email: { label: "Email", type: "email" },
        name: { label: "Name", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        const role: "CUSTOMER" | "ADMIN" = credentials.role === "ADMIN" ? "ADMIN" : "CUSTOMER";
        const email =
          credentials.email ||
          (role === "ADMIN" ? "director@radiant-atelier.com" : "alexandra.vance@atelier-client.com");
        const name =
          credentials.name || (role === "ADMIN" ? "Lead Studio Director" : "Alexandra Vance");

        const simulatedUser = {
          id: role === "ADMIN" ? "usr_admin_sim_01" : "usr_customer_sim_01",
          name,
          email,
          role,
        };

        // Non-blocking attempt to persist in DB (will never block login if DB is offline)
        prisma.user
          .upsert({
            where: { email },
            update: { name, role },
            create: { id: simulatedUser.id, email, name, role },
          })
          .catch(() => {
            // DB connection offline/pooling error - safely ignored for simulation
          });

        return simulatedUser as any;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || "CUSTOMER";
        token.name = user.name;
        token.email = user.email;
      }

      if (trigger === "update" && session?.name) {
        token.name = session.name;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id as string) || "user-id";
        session.user.role = (token.role as "CUSTOMER" | "ADMIN") || "CUSTOMER";
        if (token.name) session.user.name = token.name;
        if (token.email) session.user.email = token.email;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/signin",
  },
};
