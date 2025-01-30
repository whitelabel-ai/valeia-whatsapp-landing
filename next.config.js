const nextConfig = {
  output: 'standalone',
  eslint: { ignoreDuringBuilds: true },
  images: { unoptimized: true },
  trailingSlash: false, // <-- Cambia esto a false o elimínalo
};

module.exports = nextConfig;
