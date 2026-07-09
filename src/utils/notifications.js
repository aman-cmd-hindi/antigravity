/* eslint-disable no-unused-vars */
import emailjs from '@emailjs/browser';

// Replace these with your actual EmailJS credentials or set them via Vite environment variables
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_tiwari';
const TEMPLATE_ID_ENROLL = import.meta.env.VITE_EMAILJS_TEMPLATE_ID_ENROLL || 'template_enroll';
const TEMPLATE_ID_REVIEW = import.meta.env.VITE_EMAILJS_TEMPLATE_ID_REVIEW || 'template_review';
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'YOUR_PUBLIC_KEY';

/**
 * Sends a confirmation email to the user
 */
export const sendConfirmationEmail = async (data, type = 'enrollment') => {
  try {
    const templateId = type === 'enrollment' ? TEMPLATE_ID_ENROLL : TEMPLATE_ID_REVIEW;
    
    if (!data.email) {
      console.warn(`[EmailJS] Skipping confirmation email: No email address provided in data.`);
      return false;
    }

    if (PUBLIC_KEY === 'YOUR_PUBLIC_KEY' || !PUBLIC_KEY) {
      console.warn('[EmailJS] Skipping confirmation email: Public key is still set to placeholder.');
      return false;
    }

    console.log(`[EmailJS] Sending ${type} confirmation email to ${data.email}`);
    
    await emailjs.send(SERVICE_ID, templateId, {
      to_name: data.name,
      to_email: data.email,
      message: type === 'enrollment' ? 'Your enrollment request has been received.' : 'Thank you for your review!',
      ...data
    }, PUBLIC_KEY);

    return true;
  } catch (error) {
    console.error('[EmailJS] Email failed to send:', error);
    return false;
  }
};

/**
 * Generates a WhatsApp link with a pre-filled message
 */
export const getWhatsAppLink = (name, type = 'enrollment', details = '') => {
  const phone = '918779560903'; // Manoj Sir's number
  const message = type === 'enrollment' 
    ? `Hello Manoj Sir, I am ${name}. I just enrolled for ${details} at Tiwari Tutorials. Please guide me further.`
    : `Hello Manoj Sir, I am ${name}. I just submitted a review for Tiwari Tutorials!`;
  
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
};

/**
 * Sends an SMS/WhatsApp message
 * Note: Now uses Textbelt for free tier or points to WhatsApp
 */
export const sendSMSNotification = async (phone, message) => {
  // Keeping the structure in case you want automated SMS later
  console.log(`Notification trigger for ${phone}: ${message}`);
  return true;
};
