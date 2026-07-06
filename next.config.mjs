/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "namami-infotech.com",
        pathname: "/Stepkaro/**",
      },
    ],
  },
};

export default nextConfig;
