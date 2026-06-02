'use server';

import { ObjectId } from 'mongodb';
import { Collections, dbConnect } from '../../lib/dbConnect';
import seedBlogs from '../../data/blogs.json';

export const getBlogs = async () => {
  try {
    const collection = await dbConnect(Collections.BLOG);
    let blogs = await collection.find().toArray();
    
    // Seed database if empty
    if (blogs.length === 0 && seedBlogs.length > 0) {
      await collection.insertMany(
        seedBlogs.map(b => ({
          ...b,
          createdAt: new Date(),
        }))
      );
      blogs = await collection.find().toArray();
    }
    
    return JSON.parse(JSON.stringify(blogs));
  } catch (err) {
    return [];
  }
};

export const getSingleBlog = async (slug) => {
  try {
    const collection = await dbConnect(Collections.BLOG);
    const blog = await collection.findOne({ slug });
    if (blog) {
      return JSON.parse(JSON.stringify(blog));
    }
    
    // Fallback search in seed data if not found in db yet
    const fallback = seedBlogs.find(b => b.slug === slug);
    return fallback ? JSON.parse(JSON.stringify(fallback)) : {};
  } catch (err) {
    return {};
  }
};

export const addBlog = async (data) => {
  try {
    const collection = await dbConnect(Collections.BLOG);
    
    // Generate slug from title
    const slug = (data.title || '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');
      
    const result = await collection.insertOne({
      ...data,
      slug,
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
      }),
      createdAt: new Date(),
    });
    
    if (result.acknowledged) {
      return { success: true, id: result.insertedId.toString(), slug };
    }
  } catch (err) {
    return { success: false, error: err.message };
  }
  return { success: false, error: 'Failed to add blog.' };
};

export const updateBlog = async (id, data) => {
  if (!id || id.length !== 24) return { success: false, error: 'Invalid ID' };
  try {
    const collection = await dbConnect(Collections.BLOG);
    
    // Re-generate slug from title
    const slug = (data.title || '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...data,
          slug,
          updatedAt: new Date(),
        },
      }
    );
    if (result.modifiedCount > 0 || result.matchedCount > 0) {
      return { success: true, slug };
    }
  } catch (err) {
    return { success: false, error: err.message };
  }
  return { success: false, error: 'Failed to update blog.' };
};

export const deleteBlog = async (id) => {
  if (!id || id.length !== 24) return { success: false, error: 'Invalid ID' };
  try {
    const collection = await dbConnect(Collections.BLOG);
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount > 0) {
      return { success: true };
    }
  } catch (err) {
    return { success: false, error: err.message };
  }
  return { success: false, error: 'Failed to delete blog.' };
};
