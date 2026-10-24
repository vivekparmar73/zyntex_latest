# Contact form email (EmailJS)

The contact form sends two emails through [EmailJS](https://www.emailjs.com):

1. **Enquiry** → info@zyntex.in, with every form field. *Reply* goes straight to the visitor.
2. **Auto-reply** (optional) → the visitor, confirming the message was received.

## One-time setup (about 10 minutes)

1. Create a free account at <https://dashboard.emailjs.com>.
2. **Email Services → Add New Service** → choose the mailbox that should send the emails (e.g. Gmail or your
   domain's mail server) and connect it. Copy the **Service ID**.
3. **Email Templates → Create New Template** for the enquiry:
   - Settings: `To Email` = `{{to_email}}`, `Reply To` = `{{reply_to}}`,
     `Subject` = `New enquiry: {{inquiry}} — {{from_name}} ({{company}})`
   - Content: switch to the code/HTML editor and paste [`enquiry-template.html`](enquiry-template.html).
   - Save and copy the **Template ID**.
4. *(Optional)* Create a second template for the auto-reply:
   - `To Email` = `{{reply_to}}`, `Reply To` = `info@zyntex.in`, `Subject` = `We've received your message — Zyntex`
   - Paste [`auto-reply-template.html`](auto-reply-template.html). Copy its **Template ID**.
5. **Account → General** → copy the **Public Key**.
6. **Account → Security** → add your website domains under allowed origins (e.g. `zyntex.in`,
   `zyntex-latest.vercel.app`, `localhost`) so the keys can't be used from other sites.

## Add the keys to the site

Locally, create `.env.local` in the project root (it is git-ignored):

```
VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxx
VITE_EMAILJS_AUTOREPLY_TEMPLATE_ID=template_yyyyyyy
VITE_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxxxx
```

Restart `npm run dev` after editing it.

On **Vercel**: Project → Settings → Environment Variables → add the same four variables, then redeploy.

## Template variables

| Variable | Value |
| --- | --- |
| `to_email` | info@zyntex.in |
| `from_name`, `from_email`, `reply_to` | visitor's name and email |
| `company`, `phone`, `inquiry`, `message` | form fields (inquiry type always in English) |
| `submitted_at`, `page_url` | time (IST) and page the form was sent from |
