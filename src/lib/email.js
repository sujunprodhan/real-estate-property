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
            <strong>Status: Awaiting Admin Confirmation.</strong> An agent will review your showing slot and notify you as soon as it is confirmed.
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
    const info = await transporter.sendMail(mailOptions);
    console.log('Booking creation email sent:', info.messageId);
    return { success: true };
  } catch (error) {
    console.error('Nodemailer booking creation email error:', error);
    return { success: false, error: error.message };
  }
};

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
          <p style="font-size: 14px; color: #4b5563;">We are absolutely thrilled to confirm your scheduled tour! An executive real estate advisor will meet you at the property. Here is your **Official Showing Confirmation Invoice**:</p>
          
          <div style="border: 2px dashed #e5e7eb; border-radius: 16px; padding: 25px; margin: 30px 0; background-color: #fafbfc;">
            <div style="border-bottom: 2px solid #f3f4f6; padding-bottom: 15px; margin-bottom: 15px; display: flex; justify-content: space-between;">
              <span style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #9ca3af;">INVOICE TYPE: SHOWING TICKET</span>
              <span style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #10b981;">STATUS: APPROVED</span>
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
    const info = await transporter.sendMail(mailOptions);
    console.log('Booking confirmation invoice email sent:', info.messageId);
    return { success: true };
  } catch (error) {
    console.error('Nodemailer booking confirmation email error:', error);
    return { success: false, error: error.message };
  }
};
