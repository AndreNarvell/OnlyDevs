export const siteUrl = process.env.NEXT_PUBLIC_VERCEL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  : "http://localhost:3000"
