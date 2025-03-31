/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "export",
    images: {
      unoptimized: true,
    },
    assetPrefix: process.env.NODE_ENV === "production" ? "/my-chat-app/" : "",
    trailingSlash: true,
    distDir: "out",   // Output directory for static files
    basePath: "/my-chat-app", // Important for GitHub Pages
  
  };
  
  export default nextConfig;
  