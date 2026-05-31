import { MongoClient, ServerApiVersion } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_NAME;

export const Collections = {
  PROPERTY: 'property',
  USER: 'user',
};

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

export const dbConnect = async (cname) => {
  await client.connect();

  return client.db(dbName).collection(cname);
};
