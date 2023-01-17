/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["unsplash.it", "fjtuvaikvjxuufpzuhxi.supabase.co"],
  },
}

module.exports = nextConfig
