module.exports = function metadata (configData) {
  return {
    language: "en",
    title: "Bookmarklets",
    environment: process.env.NODE_ENV || 'production',
    isDev: process.env.NODE_ENV === 'development',
    isProd: process.env.NODE_ENV === 'production',
  };
};
