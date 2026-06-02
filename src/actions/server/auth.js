'use server';

import { Collections, dbConnect } from '../../lib/dbConnect';
import bcrypt from 'bcrypt';

export const postUser = async (payload) => {
  const { email, password, name, image } = payload;

  // check payload
  if (!email || !password || !name) {
    return {
      success: false,
      error: 'Missing required fields',
    };
  }

  try {
    //check user
    const collection = await dbConnect(Collections.USER);
    const isExist = await collection.findOne({ email });
    if (isExist) {
      return {
        success: false,
        error: 'User already exists',
      };
    }

    //create user
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = {
      provider: 'credentials',
      name,
      email,
      password: hashPassword,
      image: image || '',
      role: 'user',
    };

    //insert user
    const result = await collection.insertOne(newUser);

    if (result.acknowledged) {
      return {
        acknowledged: true,
        insertedId: result.insertedId.toString(),
        user: {
          id: result.insertedId.toString(),
          name: newUser.name,
          email: newUser.email,
          image: newUser.image,
          role: newUser.role,
        },
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Database error occurred',
    };
  }

  return {
    success: false,
    error: 'Failed to register user',
  };
};

export const loginUser = async (payload) => {
  const { email, password } = payload;
  if (!email || !password) {
    return null;
  }

  try {
    const collection = await dbConnect(Collections.USER);
    const user = await collection.findOne({ email });
    if (!user) {
      return null;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return null;
    }

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      image: user.image,
      role: user.role,
    };
  } catch (error) {
    return null;
  }
};


