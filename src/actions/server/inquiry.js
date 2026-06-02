'use server';

import { Collections, dbConnect } from '../../lib/dbConnect';
import {
  sendInquiryUserNotificationEmail,
  sendInquiryAdminNotificationEmail,
} from '../../lib/email';

export const addAgentInquiry = async (payload) => {
  const { name, email, phone, message, agentName } = payload;

  if (!name || !email || !message || !agentName) {
    return { success: false, error: 'Required fields are missing.' };
  }

  try {
    const collection = await dbConnect(Collections.INQUIRY || 'inquiry');
    
    const newInquiry = {
      name,
      email,
      phone: phone || '',
      message,
      agentName,
      createdAt: new Date(),
    };

    const result = await collection.insertOne(newInquiry);
    
    if (result.acknowledged) {
      try {
        await sendInquiryUserNotificationEmail({
          name,
          email,
          phone,
          message,
          agentName,
        });

        await sendInquiryAdminNotificationEmail({
          name,
          email,
          phone,
          message,
          agentName,
        });
      } catch (e) {
        // Suppress email errors to maintain silent execution as requested
      }

      return {
        success: true,
        insertedId: result.insertedId.toString(),
      };
    }
  } catch (err) {
    return { success: false, error: err.message };
  }

  return { success: false, error: 'Failed to record agent inquiry.' };
};
