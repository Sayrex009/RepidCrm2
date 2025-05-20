import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trustHost: true,

  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: false,
        secure: false,
      },
    },
  },

  images: {
    domains: ["crmm.repid.uz"],
  },
};

export default nextConfig;
