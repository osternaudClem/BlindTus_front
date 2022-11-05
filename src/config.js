module.exports = {
  // API
  api: {
    development: 'http://localhost:4000',
    production: 'https://api.blindtus.com',
  },
  socketApi: {
    development: 'http://localhost:4001',
    production: 'https://api.blindtus.com',
  },
  tmdb: {
    image_path: 'https://image.tmdb.org/t/p/original',
  },
  requestHeader: {
    headers: { Authorization: `Bearer ${process.env.REACT_APP_API_TOKEN}` },
  },
};
