import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "occudule.com" }],
        destination: "https://www.occudule.com/:path*",
        permanent: true,
      },
      {
        source: "/waitlist",
        destination: "/download",
        permanent: true,
      },
      {
        source: "/documentation/how-tos/How_to_Set_Up_Your_Free_Occudule_Account",
        destination: "/documentation/how-tos/how-to-set-up-your-free-occudule-account",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
