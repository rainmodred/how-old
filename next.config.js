require('dotenv').config();

module.exports = {
  reactStrictMode: true,
  env: {
    apiKey: process.env.API_KEY,
  },
  images: {
    domains: ['image.tmdb.org'],
  },
};
