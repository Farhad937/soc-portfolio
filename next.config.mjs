/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // Uploads are capped at 10 MB in application validation. Leave room for
    // multipart form-data metadata so a valid maximum-size file reaches the
    // Server Action instead of being rejected by Next.js first.
    serverActions: {
      bodySizeLimit: "12mb",
    },
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
};

export default nextConfig;
