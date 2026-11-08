import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET || "dev-super-secret-key-for-local-testing-min-32-chars-long",
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    // 1. Google Provider for regular clients
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "missing-google-client-id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "missing-google-client-secret",
      allowDangerousEmailAccountLinking: true,
    }),

    // 2. Dedicated Secure Admin Provider (only used on /kernel)
    CredentialsProvider({
      id: "admin-credentials",
      name: "Admin Control",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const configuredAdminEmail = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
        const configuredAdminPassword = process.env.ADMIN_PASSWORD || "";

        if (!configuredAdminEmail || !configuredAdminPassword) {
          return null;
        }

        const inputEmail = credentials.email.trim().toLowerCase();
        const inputPassword = credentials.password;

        if (inputEmail !== configuredAdminEmail || inputPassword !== configuredAdminPassword) {
          return null;
        }

        // Ensure Admin user exists in DB with ADMIN role
        let adminUser = await prisma.user.findUnique({
          where: { email: configuredAdminEmail },
        });

        if (!adminUser) {
          adminUser = await prisma.user.create({
            data: {
              email: configuredAdminEmail,
              name: "Nexora Studio Director",
              role: "ADMIN",
            },
          });
        } else if (adminUser.role !== "ADMIN") {
          adminUser = await prisma.user.update({
            where: { email: configuredAdminEmail },
            data: { role: "ADMIN" },
          });
        }

        return {
          id: adminUser.id,
          name: adminUser.name || "Nexora Studio Director",
          email: adminUser.email,
          role: "ADMIN",
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = (user as any).role || "CUSTOMER";
      }

      if (trigger === "update" && session?.name) {
        token.name = session.name;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id as string) || (token.sub as string) || "user-id";
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
