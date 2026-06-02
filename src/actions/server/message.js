'use server';

import { ObjectId } from 'mongodb';
import { Collections, dbConnect } from '../../lib/dbConnect';

export const getMessages = async (userEmail) => {
  if (!userEmail) return [];
  try {
    const collection = await dbConnect(Collections.MESSAGE);
    const messages = await collection.find({
      $or: [{ senderEmail: userEmail }, { receiverEmail: userEmail }]
    }).sort({ createdAt: 1 }).toArray();
    return JSON.parse(JSON.stringify(messages));
  } catch (err) {
    return [];
  }
};

export const getAllMessageThreads = async () => {
  try {
    const collection = await dbConnect(Collections.MESSAGE);
    const messages = await collection.find().sort({ createdAt: -1 }).toArray();
    
    // Group by user email
    const threadsMap = {};
    messages.forEach(msg => {
      const userEmail = msg.senderRole === 'admin' ? msg.receiverEmail : msg.senderEmail;
      const userName = msg.senderRole === 'admin' ? msg.receiverName : msg.senderName;
      const userImage = msg.senderRole === 'admin' ? msg.receiverImage : msg.senderImage;
      
      if (!threadsMap[userEmail]) {
        threadsMap[userEmail] = {
          userEmail,
          userName: userName || userEmail,
          userImage: userImage || null,
          lastMessage: msg.text || (msg.attachment ? 'Attachment sent' : ''),
          updatedAt: msg.createdAt,
          unreadCount: 0,
          messages: []
        };
      }
      if (msg.senderRole === 'user' && !msg.read) {
        threadsMap[userEmail].unreadCount += 1;
      }
      threadsMap[userEmail].messages.unshift(msg); // prepend since we fetched desc
    });
    
    return JSON.parse(JSON.stringify(Object.values(threadsMap)));
  } catch (err) {
    return [];
  }
};

export const sendMessage = async (data) => {
  try {
    const collection = await dbConnect(Collections.MESSAGE);
    const result = await collection.insertOne({
      ...data,
      read: false,
      createdAt: new Date(),
    });
    if (result.acknowledged) {
      return { success: true, id: result.insertedId.toString() };
    }
  } catch (err) {
    return { success: false, error: err.message };
  }
  return { success: false, error: 'Failed to send message.' };
};

export const markThreadAsRead = async (receiverEmail, isReadingAdminMessages = false) => {
  try {
    const collection = await dbConnect(Collections.MESSAGE);
    
    // If admin is reading, they are marking user messages as read
    // If user is reading, they are marking admin messages as read
    const filter = isReadingAdminMessages 
      ? { receiverEmail, senderRole: 'admin', read: false }
      : { senderEmail: receiverEmail, senderRole: 'user', read: false }; // admin reads messages sent by userEmail

    await collection.updateMany(filter, { $set: { read: true } });
    return { success: true };
  } catch (err) {
    return { success: false };
  }
};

export const getUnreadCount = async (userEmail, isAdmin = false) => {
  try {
    const collection = await dbConnect(Collections.MESSAGE);
    const filter = isAdmin
      ? { senderRole: 'user', read: false } // Admin counts all unread user messages
      : { receiverEmail: userEmail, senderRole: 'admin', read: false }; // User counts their unread admin messages
      
    const count = await collection.countDocuments(filter);
    return count;
  } catch (err) {
    return 0;
  }
};
