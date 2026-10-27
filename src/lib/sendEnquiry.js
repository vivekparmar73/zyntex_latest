import emailjs from '@emailjs/browser';
import { translations } from '../i18n/translations';
import { enquiryInbox } from '../data/site';

// Delivery:
// 1. EmailJS, when its keys are set in .env.local / the host's environment (see emailjs/README.md).
// 2. Otherwise FormSubmit (https://formsubmit.co), which needs no account: the very first submission
//    sends an activation email to the inbox, and every message after the link is clicked is delivered.
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const AUTOREPLY_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_AUTOREPLY_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
// After activation FormSubmit offers a random alias for the inbox address; set it here to keep
// the address out of the page source.
const FORMSUBMIT_TARGET = import.meta.env.VITE_FORMSUBMIT_ALIAS || enquiryInbox;

export const emailJsConfigured = Boolean(SERVICE_ID && TEMPLATE_ID && PUBLIC_KEY);

function details(values) {
  const inquiry = translations.en[`form.${values.subject}`] || values.subject; // always English for the team
  return {
    name: values.name.trim(),
    company: values.company.trim(),
    email: values.email.trim(),
    phone: values.phone.trim() || 'Not provided',
    inquiry,
    message: values.message.trim(),
    submittedAt: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Kolkata' }) + ' IST',
    page: window.location.href,
  };
}

async function viaEmailJs(d) {
  const params = {
    to_email: enquiryInbox,
    from_name: d.name,
    from_email: d.email,
    reply_to: d.email,
    company: d.company,
    phone: d.phone,
    inquiry: d.inquiry,
    message: d.message,
    submitted_at: d.submittedAt,
    page_url: d.page,
  };
  await emailjs.send(SERVICE_ID, TEMPLATE_ID, params, { publicKey: PUBLIC_KEY });
  if (AUTOREPLY_TEMPLATE_ID) {
    // the confirmation is a courtesy — a failure here must not report the enquiry as failed
    emailjs.send(SERVICE_ID, AUTOREPLY_TEMPLATE_ID, params, { publicKey: PUBLIC_KEY }).catch((err) => console.warn('Auto-reply email failed:', err));
  }
}

async function viaFormSubmit(d) {
  const res = await fetch(`https://formsubmit.co/ajax/${FORMSUBMIT_TARGET}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      // shown as a table in the email, in this order
      Name: d.name,
      Company: d.company,
      email: d.email,
      Phone: d.phone,
      'Inquiry Type': d.inquiry,
      Message: d.message,
      'Submitted At': d.submittedAt,
      'Sent From': d.page,
      _subject: `New enquiry: ${d.inquiry} — ${d.name} (${d.company})`,
      _replyto: d.email,
      _template: 'table',
      _captcha: 'false',
      _autoresponse: `Dear ${d.name}, thank you for contacting Zyntex. We have received your ${d.inquiry} enquiry and our team will get back to you shortly. — Team Zyntex`,
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.success === false || data.success === 'false') {
    throw new Error(data.message || `FormSubmit error ${res.status}`);
  }
}

/** Sends the contact-form enquiry to the Zyntex inbox. Rejects if it could not be sent. */
export async function sendEnquiry(values) {
  const d = details(values);
  return emailJsConfigured ? viaEmailJs(d) : viaFormSubmit(d);
}
