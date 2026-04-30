// app/api/auth/[...nextauth]/route.ts

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        const BACKEND_URL = process.env.API_URL;

        const res = await fetch(`${BACKEND_URL}/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials),
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.message);

        return data;
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user, account }) {
      // ✅ Premier appel après login Credentials
      if (user && account?.provider === "credentials") {
        token.user = user.user;
        token.accessToken = user.token;
      }

      // ✅ Premier appel après login Google
      if (account?.provider === "google" && user) {
        try {
          const res = await fetch(`${process.env.API_URL}/social-login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: user.name,
              email: user.email,
              google_id: account.providerAccountId,
            }),
          });

          if (!res.ok) {
            console.error("Backend social-login failed:", res.status);
            return token; // évite de crasher
          }

          const data = await res.json();
          console.log("Backend social-login response:", data);

          token.user = data.user;
          token.accessToken = data.token;
        } catch (err) {
          console.error("Erreur appel backend social-login:", err);
        }
      }

      return token;
    },

    async session({ session, token }) {
      session.user = token.user;
      session.accessToken = token.accessToken;
      return session;
    },

    // ✅ FIX CRITIQUE : retourner true, pas une string
    async signIn() {
      return true;
    },

    // ✅ Gérer la redirection séparément
    async redirect({ url, baseUrl }) {
      // Si c'est un callback Google, forcer /home
      if (url.includes('/api/auth/callback/google')) {
        return `${baseUrl}/home`;
      }
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (url.startsWith(baseUrl)) return url;
      return `${baseUrl}/home`;
    },
  },
});

export { handler as GET, handler as POST };