/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  assetPrefix: process.env.NODE_ENV === 'production' ? '/aptos-audit' : '',
  basePath: process.env.NODE_ENV === 'production' ? '/aptos-audit' : '',
}

module.exports = nextConfig