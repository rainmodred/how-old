const nextConfig = {
  reactStrictMode: true,
  env: {
    apiKey: process.env.API_KEY,
  },
  images: {
    domains: ['image.tmdb.org'],
  },
};

module.exports = nextConfig;
