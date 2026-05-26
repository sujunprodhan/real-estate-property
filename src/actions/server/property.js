'use server';

import { Collection, ObjectId } from 'mongodb';
import { Collections, dbConnect } from '../../lib/dbConnect';


export const getProperty = async () => {
  const collection = await dbConnect(Collections.PROPERTY);
  const properties = await collection.find().toArray();
  return JSON.parse(JSON.stringify(properties));
};

export const getSingleProperty = async (id) => {
  if (!id || id.length != 24) {
    return {};
  }

  const query = { _id: new ObjectId(id) };
  const collection = await dbConnect(Collections.PROPERTY);
  const property = await collection.findOne(query);
  return JSON.parse(JSON.stringify(property)) || {};
};
