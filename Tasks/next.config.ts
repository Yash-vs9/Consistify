import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false, // 👈 turn off double useEffect in dev

  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
