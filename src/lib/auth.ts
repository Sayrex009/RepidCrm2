import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        login: { label: "Login", type: "text", placeholder: "username" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.login || !credentials?.password) {
            throw new Error("Login and password are required");
          }

          // 1. Get access token
          const tokenFormData = new URLSearchParams();
          tokenFormData.append("username", credentials.login);
          tokenFormData.append("password", credentials.password);
          tokenFormData.append("grant_type", "password");

          const tokenResponse = await fetch(
            "https://crmm.repid.uz/login/access_token",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
              body: tokenFormData,
            },
          );

          if (!tokenResponse.ok) {
            const errorData = await tokenResponse.json();
            throw new Error(errorData.detail || "Authentication failed");
          }

          const { access_token: accessToken } = await tokenResponse.json();

          // 2. Get current user data
          const userResponse = await fetch(
            "https://crmm.repid.uz/login/get-current-user",
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
              },
            },
          );

          if (!userResponse.ok) {
            throw new Error("Failed to fetch user data");
          }

          const userData = await userResponse.json();

          // 3. Return user object in the expected format
          return {
            id: userData.id.toString(),
            accessToken,
            username: userData.username,
            email: userData.username, // NextAuth requires email
            name: `${userData.first_name} ${userData.last_name}`.trim(),
            first_name: userData.first_name,
            last_name: userData.last_name,
            position_id: userData.position_id,
            position_name: userData.position?.name || "Xodim", // Adjust based on actual API
            image: userData.image || null,
            phone_number: userData.phone_number,
            birth_date: userData.date_of_birth,
            start_date: userData.date_of_jobstarted,
          };
        } catch (error) {
          console.error("Authentication error:", error);
          throw new Error(
            error instanceof Error ? error.message : "Authentication failed",
          );
        }
      },
    }),
  ],

  pages: {
    signIn: "/login",
    error: "/login",
  },

  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.id = user.id;
        token.first_name = user.first_name;
        token.last_name = user.last_name;
        token.position_id = user.position_id;
        token.position_name = user.position_name;
        token.image = user.image;
        token.phone_number = user.phone_number;
        token.birth_date = user.birth_date;
        token.start_date = user.start_date;
      }
      return token;
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.user = {
        id: token.id,
        name: token.name,
        email: token.email,
        image: token.image,
        first_name: token.first_name,
        last_name: token.last_name,
        position_id: token.position_id,
        position_name: token.position_name,
        phone_number: token.phone_number,
        birth_date: token.birth_date, // ✅ Добавлено
        start_date: token.start_date, // ✅ Добавлено
      };
      return session;
    },
  },
};

// Extend types for TypeScript
declare module "next-auth" {
  interface User {
    id: string;
    accessToken: string;
    first_name: string;
    last_name: string;
    position_id: number;
    position_name: string;
    phone_number?: string;
  }

  interface Session {
    accessToken: string;
    user: {
      id: string;
      name: string;
      email: string;
      image?: string;
      first_name: string;
      last_name: string;
      position_id: number;
      position_name: string;
      phone_number?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    accessToken: string;
    first_name: string;
    last_name: string;
    position_id: number;
    position_name: string;
    phone_number?: string;
  }
}
