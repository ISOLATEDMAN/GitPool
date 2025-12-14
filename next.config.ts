import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 1. Trust the Ngrok tunnel
  experimental: {
    serverActions: {
      allowedOrigins: ["*.ngrok-free.app"],
    },
  },
  // 2. Allow requests from anywhere during dev
  async headers() {
    return [
      {
        source: "/api/webhooks/github",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,POST,OPTIONS" },
        ],
      },
    ];
  },
};

export default nextConfig;
