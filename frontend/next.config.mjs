/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standalone output for Docker — réduit l'image de ~300 MB
  output: 'standalone',
};

export default nextConfig;
