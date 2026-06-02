'use server';

import { ObjectId } from 'mongodb';
import { Collections, dbConnect } from '../../lib/dbConnect';

export const getProperty = async () => {
  try {
    const collection = await dbConnect(Collections.PROPERTY);
    const properties = await collection.find().toArray();
    return JSON.parse(JSON.stringify(properties));
  } catch (err) {
    return [];
  }
};

export const getSingleProperty = async (id) => {
  if (!id || id.length !== 24) {
    return {};
  }

  try {
    const query = { _id: new ObjectId(id) };
    const collection = await dbConnect(Collections.PROPERTY);
    const property = await collection.findOne(query);
    return JSON.parse(JSON.stringify(property)) || {};
  } catch (err) {
    return {};
  }
};

export const addProperty = async (data) => {
  try {
    const collection = await dbConnect(Collections.PROPERTY);
    const result = await collection.insertOne({
      ...data,
      price: Number(data.price) || 0,
      beds: Number(data.beds) || 0,
      baths: Number(data.baths) || 0,
      sqft: Number(data.sqft) || 0,
      createdAt: new Date(),
    });
    if (result.acknowledged) {
      return { success: true, id: result.insertedId.toString() };
    }
  } catch (err) {
    return { success: false, error: err.message };
  }
  return { success: false, error: 'Failed to add property.' };
};

export const updateProperty = async (id, data) => {
  if (!id || id.length !== 24) return { success: false, error: 'Invalid ID' };
  try {
    const collection = await dbConnect(Collections.PROPERTY);
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...data,
          price: Number(data.price) || 0,
          beds: Number(data.beds) || 0,
          baths: Number(data.baths) || 0,
          sqft: Number(data.sqft) || 0,
          updatedAt: new Date(),
        },
      }
    );
    if (result.modifiedCount > 0 || result.matchedCount > 0) {
      return { success: true };
    }
  } catch (err) {
    return { success: false, error: err.message };
  }
  return { success: false, error: 'Failed to update property.' };
};

export const deleteProperty = async (id) => {
  if (!id || id.length !== 24) return { success: false, error: 'Invalid ID' };
  try {
    const collection = await dbConnect(Collections.PROPERTY);
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount > 0) {
      return { success: true };
    }
  } catch (err) {
    return { success: false, error: err.message };
  }
  return { success: false, error: 'Failed to delete property.' };
};
