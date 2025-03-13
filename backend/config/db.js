const { ServerApiVersion } = require('mongodb');

module.exports = {
  uri: process.env.MONGODB_URL,
  options: {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  }
};
