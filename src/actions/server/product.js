'use server';

import { Collection, ObjectId } from 'mongodb';
import { Collections, dbConnect } from '../../lib/dbConnect';
import { Exo } from 'next/font/google';

import propertiesData from '../../data/property.json';

export const getProduct = async () => {
  try {
    const products = await dbConnect(Collections.PRODUCT).find().toArray();
    // If database is empty, return the local JSON data instead
    if (!products || products.length === 0) {
      return propertiesData;
    }
    return products;
  } catch (error) {
    console.error("Database error, falling back to local JSON:", error);
    return propertiesData;
  }
};

export const getSingleProduct = async (id) => {
  if (!id || id.length != 24) {
    return {};
  }
  const query = { _id: new ObjectId(id) };
  const product = await dbConnect(Collections.PRODUCT).findOne(query);
  return product || {};
};
