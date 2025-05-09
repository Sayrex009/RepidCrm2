// types/next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
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
      birth_date?: string;
      start_date?: string;
    };
  }

  interface User {
    id: string;
    accessToken: string;
    first_name: string;
    last_name: string;
    position_id: number;
    position_name: string;
    phone_number?: string;
    birth_date?: string;
    start_date?: string;
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
    birth_date?: string;
    start_date?: string;
  }
}
