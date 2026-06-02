import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * 1. User Booking Request: Sent to USER
 */
export const sendBookingNotificationEmail = async (bookingData) => {
  const { userEmail, userName, propertyTitle, date, time, phone, message } = bookingData;

  const htmlContent = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #f3f4f6; padding: 40px 20px; color: #1f2937; line-height: 1.6;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border: 1px solid #e5e7eb;">
        <div style="background: linear-gradient(135deg, #3b82f6, #6366f1); padding: 40px; text-align: center; color: #ffffff;">
          <h1 style="margin: 0; font-size: 24px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">Showing Booked!</h1>
          <p style="margin: 10px 0 0 0; font-size: 14px; opacity: 0.9;">We have received your appointment request.</p>
        </div>
        
        <div style="padding: 40px;">
          <p style="margin-top: 0; font-size: 16px; font-weight: 600;">Hello ${userName || 'Valued Client'},</p>
          <p style="font-size: 14px; color: #4b5563;">Thank you for choosing <strong>EstateEase</strong>. We have successfully registered your request to book a showing tour. Here are your booking details:</p>
          
          <div style="background-color: #f9fafb; border-radius: 16px; padding: 25px; margin: 30px 0; border: 1px solid #f3f4f6;">
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr style="border-bottom: 1px solid #f3f4f6;">
                <td style="padding: 10px 0; color: #6b7280; font-weight: 600;">Property:</td>
                <td style="padding: 10px 0; font-weight: 800; text-align: right; color: #111827;">${propertyTitle}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f3f4f6;">
                <td style="padding: 10px 0; color: #6b7280; font-weight: 600;">Date:</td>
                <td style="padding: 10px 0; font-weight: 700; text-align: right; color: #111827;">${date}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f3f4f6;">
                <td style="padding: 10px 0; color: #6b7280; font-weight: 600;">Time:</td>
                <td style="padding: 10px 0; font-weight: 700; text-align: right; color: #3b82f6;">${time}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f3f4f6;">
                <td style="padding: 10px 0; color: #6b7280; font-weight: 600;">Contact Phone:</td>
                <td style="padding: 10px 0; font-weight: 700; text-align: right;">${phone || 'N/A'}</td>
              </tr>
              ${message ? `
              <tr>
                <td style="padding: 10px 0; color: #6b7280; font-weight: 600;">Your Message:</td>
                <td style="padding: 10px 0; font-style: italic; text-align: right; color: #4b5563;">"${message}"</td>
              </tr>
              ` : ''}
            </table>
          </div>
          
          <div style="background-color: #eff6ff; border-radius: 12px; padding: 15px; border-left: 4px solid #3b82f6; font-size: 13px; color: #1e3a8a;">
            <strong>Status: Awaiting Admin Confirmation.</strong> An agent will review your showing slot and notify you as soon as it is approved.
          </div>
        </div>
        
        <div style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #f3f4f6; font-size: 12px; color: #9ca3af;">
          <p style="margin: 0;">&copy; ${new Date().getFullYear()} EstateEase Real Estate Ltd. All rights reserved.</p>
        </div>
      </div>
    </div>
  `;

  try {
    const mailOptions = {
      from: `"EstateEase" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: `Showing Requested: ${propertyTitle}`,
      html: htmlContent,
    };
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * 2. User Booking Request Notification: Sent to ADMIN
 */
export const sendAdminNewBookingNotificationEmail = async (bookingData) => {
  const { userEmail, userName, propertyTitle, date, time, phone, message } = bookingData;
  const adminEmail = process.env.EMAIL_USER; // Sent to admin email address

  const htmlContent = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #f3f4f6; padding: 40px 20px; color: #1f2937; line-height: 1.6;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border: 1px solid #e5e7eb;">
        <div style="background: linear-gradient(135deg, #111827, #374151); padding: 40px; text-align: center; color: #ffffff;">
          <h1 style="margin: 0; font-size: 20px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">[ACTION REQUIRED] New Booking</h1>
          <p style="margin: 10px 0 0 0; font-size: 13px; opacity: 0.9;">A client has requested a property showing walkthrough.</p>
        </div>
        
        <div style="padding: 40px;">
          <p style="margin-top: 0; font-size: 15px; font-weight: 600; color: #111827;">Hello Administrator,</p>
          <p style="font-size: 14px; color: #4b5563;">A new showing visit tour request has been submitted by a registered investor client. Please review the details below:</p>
          
          <div style="background-color: #f9fafb; border-radius: 16px; padding: 25px; margin: 30px 0; border: 1px solid #e5e7eb;">
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr style="border-bottom: 1px solid #f3f4f6;">
                <td style="padding: 10px 0; color: #6b7280; font-weight: 600;">Client Name:</td>
                <td style="padding: 10px 0; font-weight: 700; text-align: right; color: #111827;">${userName || 'VIP Investor'}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f3f4f6;">
                <td style="padding: 10px 0; color: #6b7280; font-weight: 600;">Client Email:</td>
                <td style="padding: 10px 0; font-weight: 700; text-align: right; color: #3b82f6;">${userEmail}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f3f4f6;">
                <td style="padding: 10px 0; color: #6b7280; font-weight: 600;">Client Phone:</td>
                <td style="padding: 10px 0; font-weight: 700; text-align: right; color: #111827;">${phone || 'N/A'}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f3f4f6;">
                <td style="padding: 10px 0; color: #6b7280; font-weight: 600;">Target Property:</td>
                <td style="padding: 10px 0; font-weight: 800; text-align: right; color: #111827;">${propertyTitle}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f3f4f6;">
                <td style="padding: 10px 0; color: #6b7280; font-weight: 600;">Requested Date:</td>
                <td style="padding: 10px 0; font-weight: 700; text-align: right; color: #111827;">${date}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f3f4f6;">
                <td style="padding: 10px 0; color: #6b7280; font-weight: 600;">Requested Time:</td>
                <td style="padding: 10px 0; font-weight: 700; text-align: right; color: #10b981;">${time}</td>
              </tr>
              ${message ? `
              <tr>
                <td style="padding: 10px 0; color: #6b7280; font-weight: 600;">Client Message:</td>
                <td style="padding: 10px 0; font-style: italic; text-align: right; color: #4b5563;">"${message}"</td>
              </tr>
              ` : ''}
            </table>
          </div>
          
          <div style="text-align: center; margin-top: 35px;">
            <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/dashboard" style="background: linear-gradient(135deg, #111827, #374151); color: #ffffff; text-decoration: none; padding: 15px 35px; border-radius: 50px; font-size: 13px; font-weight: 800; uppercase; tracking-wider; display: inline-block; box-shadow: 0 5px 15px rgba(0,0,0,0.15);">Open Admin Dashboard</a>
          </div>
        </div>
        
        <div style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #f3f4f6; font-size: 12px; color: #9ca3af;">
          <p style="margin: 0;">&copy; ${new Date().getFullYear()} EstateEase Operations. Internal Notification.</p>
        </div>
      </div>
    </div>
  `;

  try {
    const mailOptions = {
      from: `"EstateEase System" <${process.env.EMAIL_USER}>`,
      to: adminEmail,
      subject: `[NEW SHOWING REQUEST] ${userName || 'Client'} - ${propertyTitle}`,
      html: htmlContent,
    };
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * 3. Booking Approved Invoice: Sent to USER
 */
export const sendBookingConfirmationEmail = async (bookingData) => {
  const { userEmail, userName, propertyTitle, date, time, phone } = bookingData;

  const htmlContent = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #f3f4f6; padding: 40px 20px; color: #1f2937; line-height: 1.6;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 15px 35px rgba(0,0,0,0.08); border: 1px solid #e5e7eb;">
        <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 40px; text-align: center; color: #ffffff;">
          <div style="width: 60px; height: 60px; background-color: rgba(255, 255, 255, 0.2); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 15px; font-size: 30px;">✓</div>
          <h1 style="margin: 0; font-size: 24px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">Showing Confirmed!</h1>
          <p style="margin: 10px 0 0 0; font-size: 14px; opacity: 0.9;">Your showing visit has been approved by the Administrator.</p>
        </div>
        
        <div style="padding: 40px;">
          <p style="margin-top: 0; font-size: 16px; font-weight: 600;">Dear ${userName || 'VIP Client'},</p>
          <p style="font-size: 14px; color: #4b5563;">We are thrilled to confirm your scheduled tour! An executive real estate advisor will meet you at the property. Here is your **Official Showing Confirmation Invoice**:</p>
          
          <div style="border: 2px dashed #e5e7eb; border-radius: 16px; padding: 25px; margin: 30px 0; background-color: #fafbfc;">
            <div style="border-bottom: 2px solid #f3f4f6; padding-bottom: 15px; margin-bottom: 15px; display: flex; justify-content: space-between;">
              <span style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #9ca3af;">INVOICE TYPE: SHOWING TICKET</span>
              <span style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #10b981;">STATUS: CONFIRMED</span>
            </div>
            
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr style="border-bottom: 1px solid #f3f4f6;">
                <td style="padding: 10px 0; color: #6b7280;">Confirmed Property:</td>
                <td style="padding: 10px 0; font-weight: 800; text-align: right; color: #111827;">${propertyTitle}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f3f4f6;">
                <td style="padding: 10px 0; color: #6b7280;">Tour Date:</td>
                <td style="padding: 10px 0; font-weight: 700; text-align: right; color: #111827;">${date}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f3f4f6;">
                <td style="padding: 10px 0; color: #6b7280;">Tour Arrival Time:</td>
                <td style="padding: 10px 0; font-weight: 800; text-align: right; color: #10b981;">${time}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #6b7280;">Assigned Contact:</td>
                <td style="padding: 10px 0; font-weight: 700; text-align: right; color: #111827;">${phone || 'N/A'}</td>
              </tr>
            </table>
            
            <div style="border-top: 2px solid #f3f4f6; margin-top: 15px; padding-top: 15px; text-align: center; font-size: 11px; color: #9ca3af;">
              Please present a print or digital copy of this confirmation email to the showing advisor.
            </div>
          </div>
          
          <p style="font-size: 13px; color: #4b5563; text-align: center; margin-bottom: 0;">
            Need to reschedule or cancel? Reply directly to this email or call our support center.
          </p>
        </div>
        
        <div style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #f3f4f6; font-size: 12px; color: #9ca3af;">
          <p style="margin: 0;">&copy; ${new Date().getFullYear()} EstateEase Real Estate Ltd. All rights reserved.</p>
        </div>
      </div>
    </div>
  `;

  try {
    const mailOptions = {
      from: `"EstateEase Premium" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: `CONFIRMED SHOWING INVOICE: ${propertyTitle}`,
      html: htmlContent,
    };
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * 4. Booking Rejected Notification: Sent to USER
 */
export const sendBookingRejectionEmail = async (bookingData) => {
  const { userEmail, userName, propertyTitle, date, time } = bookingData;

  const htmlContent = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #f3f4f6; padding: 40px 20px; color: #1f2937; line-height: 1.6;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border: 1px solid #e5e7eb;">
        <div style="background: linear-gradient(135deg, #ef4444, #dc2626); padding: 40px; text-align: center; color: #ffffff;">
          <div style="width: 60px; height: 60px; background-color: rgba(255, 255, 255, 0.2); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 15px; font-size: 30px;">✕</div>
          <h1 style="margin: 0; font-size: 24px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">Visit Request Declined</h1>
          <p style="margin: 10px 0 0 0; font-size: 14px; opacity: 0.9;">Showing booking could not be scheduled.</p>
        </div>
        
        <div style="padding: 40px;">
          <p style="margin-top: 0; font-size: 16px; font-weight: 600;">Hello ${userName || 'Valued Client'},</p>
          <p style="font-size: 14px; color: #4b5563;">Thank you for your interest in the luxury property listing <strong>${propertyTitle}</strong>. We regret to inform you that the requested showing slot could not be confirmed at this time:</p>
          
          <div style="background-color: #fff5f5; border-radius: 16px; padding: 25px; margin: 30px 0; border: 1px solid #fee2e2;">
            <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #991b1b;">
              <tr style="border-bottom: 1px solid #fecaca;">
                <td style="padding: 10px 0; font-weight: 600;">Property:</td>
                <td style="padding: 10px 0; font-weight: 700; text-align: right;">${propertyTitle}</td>
              </tr>
              <tr style="border-bottom: 1px solid #fecaca;">
                <td style="padding: 10px 0; font-weight: 600;">Requested Date:</td>
                <td style="padding: 10px 0; font-weight: 700; text-align: right;">${date}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; font-weight: 600;">Requested Time:</td>
                <td style="padding: 10px 0; font-weight: 700; text-align: right;">${time}</td>
              </tr>
            </table>
          </div>
          
          <p style="font-size: 14px; color: #4b5563;">
            This may be due to advisor unavailability or conflicting showing schedules on the property. We invite you to schedule a different viewing window directly on the website or contact our support team.
          </p>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/property" style="background-color: #ef4444; color: #ffffff; text-decoration: none; padding: 12px 30px; border-radius: 50px; font-size: 12px; font-weight: 700; display: inline-block; box-shadow: 0 4px 10px rgba(239, 68, 68, 0.2);">Explore Other Listings</a>
          </div>
        </div>
        
        <div style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #f3f4f6; font-size: 12px; color: #9ca3af;">
          <p style="margin: 0;">&copy; ${new Date().getFullYear()} EstateEase Real Estate Ltd. All rights reserved.</p>
        </div>
      </div>
    </div>
  `;

  try {
    const mailOptions = {
      from: `"EstateEase Support" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: `Declined Showing Tour Request: ${propertyTitle}`,
      html: htmlContent,
    };
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * 5. Inquiry Received: Sent to USER
 */
export const sendInquiryUserNotificationEmail = async (inquiryData) => {
  const { name, email, phone, message, agentName } = inquiryData;

  const htmlContent = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #f3f4f6; padding: 40px 20px; color: #1f2937; line-height: 1.6;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border: 1px solid #e5e7eb;">
        <div style="background: linear-gradient(135deg, #4f46e5, #6366f1); padding: 40px; text-align: center; color: #ffffff;">
          <h1 style="margin: 0; font-size: 24px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">Inquiry Received!</h1>
          <p style="margin: 10px 0 0 0; font-size: 14px; opacity: 0.9;">We have received your message for ${agentName}.</p>
        </div>
        
        <div style="padding: 40px;">
          <p style="margin-top: 0; font-size: 16px; font-weight: 600;">Hello ${name},</p>
          <p style="font-size: 14px; color: #4b5563;">Thank you for contacting our premium agent <strong>${agentName}</strong> at <strong>EstateEase</strong>. Our agent has been notified and will review your inquiry shortly. Here is a summary of your inquiry details:</p>
          
          <div style="background-color: #f9fafb; border-radius: 16px; padding: 25px; margin: 30px 0; border: 1px solid #f3f4f6;">
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr style="border-bottom: 1px solid #f3f4f6;">
                <td style="padding: 10px 0; color: #6b7280; font-weight: 600;">Contacted Agent:</td>
                <td style="padding: 10px 0; font-weight: 800; text-align: right; color: #111827;">${agentName}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f3f4f6;">
                <td style="padding: 10px 0; color: #6b7280; font-weight: 600;">Your Phone:</td>
                <td style="padding: 10px 0; font-weight: 700; text-align: right; color: #111827;">${phone || 'N/A'}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #6b7280; font-weight: 600;">Your Message:</td>
                <td style="padding: 10px 0; font-style: italic; text-align: right; color: #4b5563;">"${message}"</td>
              </tr>
            </table>
          </div>
          
          <div style="background-color: #f5f3ff; border-radius: 12px; padding: 15px; border-left: 4px solid #6366f1; font-size: 13px; color: #4c1d95;">
            <strong>What's Next?</strong> ${agentName} will contact you via email or phone within 24 hours.
          </div>
        </div>
        
        <div style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #f3f4f6; font-size: 12px; color: #9ca3af;">
          <p style="margin: 0;">&copy; ${new Date().getFullYear()} EstateEase Real Estate Ltd. All rights reserved.</p>
        </div>
      </div>
    </div>
  `;

  try {
    const mailOptions = {
      from: `"EstateEase" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Inquiry Received: Message for ${agentName}`,
      html: htmlContent,
    };
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * 6. Inquiry Notification: Sent to ADMIN / AGENT
 */
export const sendInquiryAdminNotificationEmail = async (inquiryData) => {
  const { name, email, phone, message, agentName } = inquiryData;
  const adminEmail = process.env.EMAIL_USER;

  const htmlContent = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #f3f4f6; padding: 40px 20px; color: #1f2937; line-height: 1.6;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border: 1px solid #e5e7eb;">
        <div style="background: linear-gradient(135deg, #111827, #1f2937); padding: 40px; text-align: center; color: #ffffff;">
          <h1 style="margin: 0; font-size: 20px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">New Client Inquiry</h1>
          <p style="margin: 10px 0 0 0; font-size: 13px; opacity: 0.9;">A client has submitted an inquiry request for ${agentName}.</p>
        </div>
        
        <div style="padding: 40px;">
          <p style="margin-top: 0; font-size: 15px; font-weight: 600; color: #111827;">Hello Team,</p>
          <p style="font-size: 14px; color: #4b5563;">A new direct contact inquiry has been received. Please find the client's information below:</p>
          
          <div style="background-color: #f9fafb; border-radius: 16px; padding: 25px; margin: 30px 0; border: 1px solid #e5e7eb;">
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr style="border-bottom: 1px solid #f3f4f6;">
                <td style="padding: 10px 0; color: #6b7280; font-weight: 600;">Client Name:</td>
                <td style="padding: 10px 0; font-weight: 700; text-align: right; color: #111827;">${name}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f3f4f6;">
                <td style="padding: 10px 0; color: #6b7280; font-weight: 600;">Client Email:</td>
                <td style="padding: 10px 0; font-weight: 700; text-align: right; color: #3b82f6;">${email}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f3f4f6;">
                <td style="padding: 10px 0; color: #6b7280; font-weight: 600;">Client Phone:</td>
                <td style="padding: 10px 0; font-weight: 700; text-align: right; color: #111827;">${phone || 'N/A'}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f3f4f6;">
                <td style="padding: 10px 0; color: #6b7280; font-weight: 600;">Target Agent:</td>
                <td style="padding: 10px 0; font-weight: 800; text-align: right; color: #111827;">${agentName}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #6b7280; font-weight: 600;">Client Message:</td>
                <td style="padding: 10px 0; font-style: italic; text-align: right; color: #4b5563;">"${message}"</td>
              </tr>
            </table>
          </div>
        </div>
        
        <div style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #f3f4f6; font-size: 12px; color: #9ca3af;">
          <p style="margin: 0;">&copy; ${new Date().getFullYear()} EstateEase Operations. Internal Notification.</p>
        </div>
      </div>
    </div>
  `;

  try {
    const mailOptions = {
      from: `"EstateEase System" <${process.env.EMAIL_USER}>`,
      to: adminEmail,
      subject: `[AGENT INQUIRY] ${name} - Contact Request for ${agentName}`,
      html: htmlContent,
    };
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
