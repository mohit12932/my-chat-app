/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "export",
    images: {
      unoptimized: true,
    },
    assetPrefix: process.env.NODE_ENV === "production" ? "/my-chat-app/" : "",
    trailingSlash: true,
  };
  
  export default nextConfig;
  