import { Session } from "next-auth";
import { JWT } from "next-auth/jwt";

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
    refreshToken?: string;
    expiresIn?: number;
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
    refreshToken?: string;
    expiresAt?: number;
    first_name: string;
    last_name: string;
    position_id: number;
    position_name: string;
    phone_number?: string;
    birth_date?: string;
    start_date?: string;
  }
}
