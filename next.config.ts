/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['lh3.googleusercontent.com', 'img.youtube.com'], // Added 'img.youtube.com'
  },
};

module.exports = nextConfig;