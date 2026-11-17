import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    '192.168.1.63',
    '192.168.1.*',
    '192.168.0.*',
    '10.0.0.*',
    'localhost:3002'
  ],
};

export default nextConfig;
