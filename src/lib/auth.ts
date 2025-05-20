import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        login: { label: "Login", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.login || !credentials?.password) {
          throw new Error("Login and password are required");
        }

        // Получаем токен
        const tokenFormData = new URLSearchParams();
        tokenFormData.append("username", credentials.login);
        tokenFormData.append("password", credentials.password);
        tokenFormData.append("grant_type", "password");

        const tokenResponse = await fetch("https://crmm.repid.uz/login/access_token", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: tokenFormData,
        });

        if (!tokenResponse.ok) {
          const err = await tokenResponse.json();
          throw new Error(err.detail || "Authentication failed");
        }

        const { access_token } = await tokenResponse.json();

        // Получаем данные пользователя
        const userResponse = await fetch("https://crmm.repid.uz/login/get-current-user", {
          headers: { Authorization: `Bearer ${access_token}` },
        });

        if (!userResponse.ok) {
          throw new Error("Failed to fetch user data");
        }

        const user = await userResponse.json();

        return {
          id: user.id.toString(),
          accessToken: access_token,
          name: `${user.first_name} ${user.last_name}`.trim(),
          email: user.username,
          first_name: user.first_name,
          last_name: user.last_name,
          position_id: user.position_id,
          position_name: user.position?.name || "Xodim",
          image: user.image || null,
          phone_number: user.phone_number,
          birth_date: user.date_of_birth,
          start_date: user.date_of_jobstarted,
        };
      },
    }),
  ],

  pages: {
    signIn: "/login",
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
        name: session.user?.name || "",
        email: session.user?.email || "",
        image: token.image,
        first_name: token.first_name,
        last_name: token.last_name,
        position_id: token.position_id,
        position_name: token.position_name,
        phone_number: token.phone_number,
        birth_date: token.birth_date,
        start_date: token.start_date,
      };
      return session;
    },
  },
};
