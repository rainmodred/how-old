module.exports = {
  reactStrictMode: true,
  env: {
    apiKey: process.env.API_KEY,
  },
  images: {
    domains: ['image.tmdb.org'],
  },
  experimental: { esmExternals: false },
};
