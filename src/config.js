module.exports = {
  // API
  api: {
    development: 'http://localhost:4000',
    // development: 'http://192.168.1.100:4000',
    // development: 'https://blindtus.cl3tus.com',
    production: 'https://blindtus.cl3tus.com',
  },
  socketApi: {
    development: 'http://localhost:4001',
    // development: 'http://192.168.1.100:4001',
    // development: 'https://blindtus.cl3tus.com',
    production: 'https://blindtus.cl3tus.com',
  },
  tmdb: {
    image_path: 'https://image.tmdb.org/t/p/original',
  },
  requestHeader: {
    headers: { Authorization: `Bearer ${process.env.REACT_APP_API_TOKEN}` }
  }
};