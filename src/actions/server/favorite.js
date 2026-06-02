'use server';

import { Collections, dbConnect } from '../../lib/dbConnect';
import { ObjectId } from 'mongodb';

export const toggleFavorite = async (payload) => {
  const {
    propertyId,
    userEmail,
    propertyTitle,
    propertyPrice,
    propertyLocation,
    propertyImage,
    propertyBeds,
    propertyBaths,
    propertySqft,
    propertyType,
  } = payload;

  if (!propertyId || !userEmail) {
    return { success: false, error: 'Missing required fields' };
  }

  try {
    const collection = await dbConnect(Collections.FAVORITE || 'favorite');
    const query = { propertyId: new ObjectId(propertyId), userEmail };

    const isExist = await collection.findOne(query);

    if (isExist) {
      const result = await collection.deleteOne(query);
      if (result.deletedCount > 0) {
        return { success: true, action: 'removed' };
      }
    } else {
      const newFav = {
        propertyId: new ObjectId(propertyId),
        userEmail,
        title: propertyTitle || '',
        price: propertyPrice || 0,
        location: propertyLocation || '',
        image: propertyImage || '',
        beds: propertyBeds || 0,
        baths: propertyBaths || 0,
        sqft: propertySqft || 0,
        type: propertyType || 'House',
        createdAt: new Date(),
      };
      const result = await collection.insertOne(newFav);
      if (result.acknowledged) {
        return { success: true, action: 'added' };
      }
    }
  } catch (error) {
    return { success: false, error: error.message };
  }

  return { success: false, error: 'Operation failed' };
};

export const getFavorites = async (email) => {
  if (!email) return [];
  try {
    const collection = await dbConnect(Collections.FAVORITE || 'favorite');
    const favorites = await collection.find({ userEmail: email }).sort({ createdAt: -1 }).toArray();
    return JSON.parse(JSON.stringify(favorites));
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return [];
  }
};

export const checkIfFavorite = async (propertyId, email) => {
  if (!propertyId || !email) return false;
  try {
    const collection = await dbConnect(Collections.FAVORITE || 'favorite');
    const isExist = await collection.findOne({
      propertyId: new ObjectId(propertyId),
      userEmail: email,
    });
    return !!isExist;
  } catch (error) {
    return false;
  }
};
