'use server';

import { Collections, dbConnect } from '../../lib/dbConnect';
import { ObjectId } from 'mongodb';

export const getAllUsers = async () => {
  try {
    const collection = await dbConnect(Collections.USER || 'user');
    const users = await collection.find({}, { projection: { password: 0 } }).toArray();
    return JSON.parse(JSON.stringify(users));
  } catch (error) {
    return [];
  }
};

export const updateUserRole = async (userId, role) => {
  if (!userId || userId.length !== 24) return { success: false, error: 'Invalid User ID' };
  if (!['admin', 'user'].includes(role)) return { success: false, error: 'Invalid Role' };

  try {
    const collection = await dbConnect(Collections.USER || 'user');
    const result = await collection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { role } }
    );
    if (result.modifiedCount > 0 || result.matchedCount > 0) {
      return { success: true };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
  return { success: false, error: 'Failed to update user role' };
};

export const getUserProfile = async (email) => {
  if (!email) return null;
  try {
    const collection = await dbConnect(Collections.USER || 'user');
    const user = await collection.findOne({ email }, { projection: { password: 0 } });
    if (user) {
      return JSON.parse(JSON.stringify(user));
    }
  } catch (error) {
  }
  return null;
};

export const updateUserProfile = async (email, data) => {
  if (!email) return { success: false, error: 'Email is required' };
  try {
    const collection = await dbConnect(Collections.USER || 'user');
    const result = await collection.updateOne(
      { email },
      {
        $set: {
          name: data.name,
          image: data.image,
          phone: data.phone,
          bio: data.bio,
        },
      }
    );
    if (result.matchedCount > 0) {
      return { success: true };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
  return { success: false, error: 'Failed to update user profile' };
};

export const upgradeToAdmin = async (email) => {
  if (!email) return { success: false, error: 'Email is required' };
  try {
    const collection = await dbConnect(Collections.USER || 'user');
    const result = await collection.updateOne(
      { email },
      { $set: { role: 'admin' } }
    );
    if (result.matchedCount > 0) {
      return { success: true };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
  return { success: false, error: 'Failed to upgrade user' };
};
