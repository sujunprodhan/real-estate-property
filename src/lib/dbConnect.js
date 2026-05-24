const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_NAME;
export const Collections = {
  PRODUCT: 'product',
};

export const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Get Collection
export const dbConnect = (cname) => {
  return client.db(dbName).collection(cname);
};
