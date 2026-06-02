'use server';

import { Collections, dbConnect } from '../../lib/dbConnect';
import { ObjectId } from 'mongodb';

export const getAllUsers = async () => {
  try {
    const collection = await dbConnect(Collections.USER || 'user');
    const users = await collection.find({}, { projection: { password: 0 } }).toArray();
    return JSON.parse(JSON.stringify(users));
  } catch (error) {
    console.error('Error fetching all users:', error);
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
