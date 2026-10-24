import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';
import { ArrowRight } from './Icons';
import { contact } from '../data/site';
import { sendEnquiry } from '../lib/sendEnquiry';

const SUBJECTS = ['s_general', 's_apparel', 's_product', 's_partnership', 's_other'];
const EMPTY = { name: '', company: '', email: '', phone: '', subject: '', message: '', website: '' };

function validate(v) {
  const e = {};
  if (!v.name.trim()) e.name = 'form.required';
  if (!v.company.trim()) e.company = 'form.required';
  if (!v.email.trim()) e.email = 'form.required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) e.email = 'form.invalidEmail';
  if (v.phone.trim() && !/^[+()\d\s-]{7,20}$/.test(v.phone.trim())) e.phone = 'form.invalidPhone';
  if (!v.subject) e.subject = 'form.required';
  if (!v.message.trim()) e.message = 'form.required';
  return e;
}

export default function ContactForm({ defaultSubject = '', tone = 'light' }) {
  const { t } = useLanguage();
  const [values, setValues] = useState({ ...EMPTY, subject: defaultSubject });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | success | error

  const set = (k) => (e) => {
    const next = { ...values, [k]: e.target.value };
    setValues(next);
    if (touched[k]) setErrors(validate(next));
  };
  const blur = (k) => () => {
    setTouched((s) => ({ ...s, [k]: true }));
    setErrors(validate(values));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    setTouched({ name: true, company: true, email: true, phone: true, subject: true, message: true });
    if (Object.keys(found).length) {
      document.getElementById(`cf-${Object.keys(found)[0]}`)?.focus();
      return;
    }
    if (values.website) return; // honeypot filled — silently drop bots

    setStatus('sending');
    try {
      await sendEnquiry(values);
      setStatus('success');
      setValues({ ...EMPTY, subject: defaultSubject });
      setTouched({});
    } catch (err) {
      console.error('Contact form:', err);
      setStatus('error');
    }
  };

  const field = (k, label, props = {}, optional = false) => (
    <div className={`field ${errors[k] && touched[k] ? 'has-error' : ''} ${values[k] ? 'is-filled' : ''}`}>
      <label htmlFor={`cf-${k}`}>
        {label}
        {optional ? <span className="field__opt"> ({t('form.optional')})</span> : <span aria-hidden="true"> *</span>}
      </label>
      {props.as === 'textarea' ? (
        <textarea id={`cf-${k}`} rows={5} value={values[k]} onChange={set(k)} onBlur={blur(k)} aria-invalid={!!(errors[k] && touched[k])} aria-describedby={`cf-${k}-err`} required={!optional} />
      ) : (
        <input id={`cf-${k}`} value={values[k]} onChange={set(k)} onBlur={blur(k)} aria-invalid={!!(errors[k] && touched[k])} aria-describedby={`cf-${k}-err`} required={!optional} {...props} />
      )}
      <span className="field__error" id={`cf-${k}-err`} role="alert">
        {errors[k] && touched[k] ? t(errors[k]) : ''}
      </span>
    </div>
  );

  return (
    <form className={`contact-form contact-form--${tone}`} onSubmit={onSubmit} noValidate>
      <div className="contact-form__grid">
        {field('name', t('form.name'), { autoComplete: 'name' })}
        {field('company', t('form.company'), { autoComplete: 'organization' })}
        {field('email', t('form.email'), { type: 'email', autoComplete: 'email', inputMode: 'email' })}
        {field('phone', t('form.phone'), { type: 'tel', autoComplete: 'tel', inputMode: 'tel' }, true)}
      </div>

      <div className={`field ${errors.subject && touched.subject ? 'has-error' : ''} is-filled`}>
        <label htmlFor="cf-subject">
          {t('form.subject')}
          <span aria-hidden="true"> *</span>
        </label>
        <select id="cf-subject" value={values.subject} onChange={set('subject')} onBlur={blur('subject')} aria-invalid={!!(errors.subject && touched.subject)} required>
          <option value="">{t('form.choose')}</option>
          {SUBJECTS.map((s) => (
            <option key={s} value={s}>
              {t(`form.${s}`)}
            </option>
          ))}
        </select>
        <span className="field__error" role="alert">
          {errors.subject && touched.subject ? t(errors.subject) : ''}
        </span>
      </div>

      {field('message', t('form.message'), { as: 'textarea' })}

      {/* Honeypot: hidden from people, bots fill it in */}
      <div className="hp" aria-hidden="true">
        <label htmlFor="cf-website">Website</label>
        <input id="cf-website" tabIndex={-1} autoComplete="off" value={values.website} onChange={set('website')} />
      </div>

      <button className="btn btn--primary contact-form__submit" type="submit" disabled={status === 'sending'}>
        {status === 'sending' ? t('form.sending') : t('form.submit')}
        <ArrowRight />
      </button>

      <AnimatePresence mode="wait">
        {(status === 'success' || status === 'error') && (
          <motion.p
            key={status}
            className={`form-status form-status--${status}`}
            role="status"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {status === 'success' ? t('form.success') : t('form.error')}
            {status === 'error' && (
              <>
                {' '}
                <a href={`mailto:${contact.email}`}>{contact.email}</a>
              </>
            )}
          </motion.p>
        )}
      </AnimatePresence>
    </form>
  );
}
