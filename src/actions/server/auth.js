'use server';

import { Collections, dbConnect } from '../../lib/dbConnect';
import bcrypt from 'bcrypt';

export const postUser = async (payload) => {
  const { email, password, name, image } = payload;
  console.log("SERVER postUser: Received payload:", { email, name, image, passwordLength: password ? password.length : 0 });

  // check payload
  if (!email || !password || !name) {
    console.log("SERVER postUser: Failed due to missing required fields");
    return {
      success: false,
      error: 'Missing required fields',
    };
  }

  try {
    //check user
    const collection = await dbConnect(Collections.USER);
    const isExist = await collection.findOne({ email });
    console.log("SERVER postUser: Checking if user exists:", isExist);
    if (isExist) {
      console.log("SERVER postUser: Failed because email already exists");
      return {
        success: false,
        error: 'User already exists',
      };
    }

    //create user
    const hashPassword = await bcrypt.hash(password, 10);
    console.log("SERVER postUser: Password hashed successfully");

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
    console.log("SERVER postUser: DB insert result:", result);

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
    console.error("SERVER postUser error:", error);
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
  console.log("SERVER loginUser: Received credentials:", { email, passwordLength: password ? password.length : 0 });

  if (!email || !password) {
    console.log("SERVER loginUser: Missing email or password");
    return null;
  }

  try {
    const collection = await dbConnect(Collections.USER);
    const user = await collection.findOne({ email });
    console.log("SERVER loginUser: DB queried user:", user ? { id: user._id, email: user.email, hasHash: !!user.password } : "Not found");

    if (!user) {
      console.log("SERVER loginUser: User not found in DB");
      return null;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("SERVER loginUser: Password match result:", isMatch);

    if (!isMatch) {
      console.log("SERVER loginUser: Password mismatch");
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
    console.error("SERVER loginUser error:", error);
    return null;
  }
};


