<<<<<<< HEAD
import { Session } from "next-auth";
import { JWT } from "next-auth/jwt";
=======
// types/next-auth.d.ts
import NextAuth from "next-auth";
>>>>>>> 2edad81bff20d2c1ac35e5a47c3a3fa6c4b54297

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
<<<<<<< HEAD
    refreshToken?: string;
    expiresIn?: number;
=======
>>>>>>> 2edad81bff20d2c1ac35e5a47c3a3fa6c4b54297
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
<<<<<<< HEAD
    refreshToken?: string;
    expiresAt?: number;
=======
>>>>>>> 2edad81bff20d2c1ac35e5a47c3a3fa6c4b54297
    first_name: string;
    last_name: string;
    position_id: number;
    position_name: string;
    phone_number?: string;
    birth_date?: string;
    start_date?: string;
  }
}
