/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental:{appDocumentPreloading:true,viewTransition:true},
    reactStrictMode:false,
    images: {
        remotePatterns: [
          {
            protocol: 'http',
            hostname: '192.168.30.153',
            port: process.env.NEXT_PUBLIC_API_PORT, // или '3000' если у тебя сервер на порту
            pathname: '/**',
          },
        ],
      },
};

export default nextConfig;
