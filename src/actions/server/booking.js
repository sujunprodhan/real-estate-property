'use server';

import { Collections, dbConnect } from '../../lib/dbConnect';
import { ObjectId } from 'mongodb';
import { sendBookingNotificationEmail, sendBookingConfirmationEmail } from '../../lib/email';

export const addBooking = async (payload) => {
  const {
    propertyId,
    propertyTitle,
    propertyImage,
    propertyPrice,
    propertyLocation,
    userEmail,
    userName,
    date,
    time,
    phone,
    message,
    agent,
  } = payload;

  if (!propertyId || !userEmail || !date || !time) {
    return { success: false, error: 'Missing required fields' };
  }

  try {
    const collection = await dbConnect(Collections.BOOKING || 'booking');
    const newBooking = {
      propertyId: new ObjectId(propertyId),
      propertyTitle,
      propertyImage: propertyImage || '',
      propertyPrice: propertyPrice || 0,
      propertyLocation: propertyLocation || {},
      userEmail,
      userName: userName || '',
      date,
      time,
      phone: phone || '',
      message: message || '',
      agent: agent || { name: 'Expert Agent', email: 'agent@realestate.com', phone: '+1 (555) 000-0000' },
      status: 'Pending',
      createdAt: new Date(),
    };

    const result = await collection.insertOne(newBooking);
    if (result.acknowledged) {
      try {
        await sendBookingNotificationEmail({
          userEmail,
          userName,
          propertyTitle,
          date,
          time,
          phone: phone || '',
          message,
        });
      } catch (emailErr) {
        console.error('Failed to send booking notification email:', emailErr);
      }

      return {
        success: true,
        insertedId: result.insertedId.toString(),
      };
    }
  } catch (error) {
    return { success: false, error: error.message || 'Database error occurred' };
  }

  return { success: false, error: 'Failed to create booking' };
};

export const getBookings = async (email) => {
  if (!email) return [];
  try {
    const collection = await dbConnect(Collections.BOOKING || 'booking');
    const bookings = await collection.find({ userEmail: email }).sort({ createdAt: -1 }).toArray();
    return JSON.parse(JSON.stringify(bookings));
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return [];
  }
};

export const deleteBooking = async (id) => {
  if (!id || id.length !== 24) return { success: false, error: 'Invalid Booking ID' };
  try {
    const collection = await dbConnect(Collections.BOOKING || 'booking');
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount > 0) {
      return { success: true };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
  return { success: false, error: 'Failed to delete booking' };
};

export const getAllBookings = async () => {
  try {
    const collection = await dbConnect(Collections.BOOKING || 'booking');
    const bookings = await collection.find().sort({ createdAt: -1 }).toArray();
    return JSON.parse(JSON.stringify(bookings));
  } catch (error) {
    console.error('Error fetching all bookings:', error);
    return [];
  }
};

export const updateBookingStatus = async (id, status) => {
  if (!id || id.length !== 24) return { success: false, error: 'Invalid Booking ID' };
  try {
    const collection = await dbConnect(Collections.BOOKING || 'booking');
    const booking = await collection.findOne({ _id: new ObjectId(id) });

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { status } }
    );
    if (result.modifiedCount > 0 || result.matchedCount > 0) {
      if (status === 'Confirmed' && booking) {
        try {
          await sendBookingConfirmationEmail({
            userEmail: booking.userEmail,
            userName: booking.userName,
            propertyTitle: booking.propertyTitle,
            date: booking.date,
            time: booking.time,
            phone: booking.phone || '',
          });
        } catch (emailErr) {
          console.error('Failed to send booking confirmation invoice email:', emailErr);
        }
      }
      return { success: true };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
  return { success: false, error: 'Failed to update booking status' };
};
