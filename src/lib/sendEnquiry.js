import emailjs from '@emailjs/browser';
import { translations } from '../i18n/translations';
import { contact } from '../data/site';

// EmailJS keys come from .env.local (locally) or the hosting provider's environment settings.
// See emailjs/README.md for the setup and the email templates.
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const AUTOREPLY_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_AUTOREPLY_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

export const emailConfigured = Boolean(SERVICE_ID && TEMPLATE_ID && PUBLIC_KEY);

/**
 * Sends the contact-form enquiry to the Zyntex inbox and, if an auto-reply template is set,
 * a confirmation to the visitor. Rejects if the enquiry itself could not be sent.
 */
export async function sendEnquiry(values) {
  if (!emailConfigured) {
    throw new Error('EmailJS is not configured: set VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID and VITE_EMAILJS_PUBLIC_KEY.');
  }

  const params = {
    to_email: contact.email,
    from_name: values.name.trim(),
    from_email: values.email.trim(),
    reply_to: values.email.trim(),
    company: values.company.trim(),
    phone: values.phone.trim() || 'Not provided',
    // always English for the team, whatever language the visitor used
    inquiry: translations.en[`form.${values.subject}`] || values.subject,
    message: values.message.trim(),
    submitted_at: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Kolkata' }) + ' IST',
    page_url: window.location.href,
  };

  await emailjs.send(SERVICE_ID, TEMPLATE_ID, params, { publicKey: PUBLIC_KEY });

  if (AUTOREPLY_TEMPLATE_ID) {
    // the confirmation is a courtesy — a failure here must not report the enquiry as failed
    emailjs.send(SERVICE_ID, AUTOREPLY_TEMPLATE_ID, params, { publicKey: PUBLIC_KEY }).catch((err) => {
      console.warn('Auto-reply email failed:', err);
    });
  }
}
