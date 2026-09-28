import React, { useEffect, useState } from 'react';
import { configService } from '../services/api';
import { useToast } from '../context/ToastContext';
import { MapPin, Mail, Phone, Clock, Send, CheckCircle2, MessageSquare } from 'lucide-react';

const ContactPage = () => {
  const { showToast } = useToast();
  const [config, setConfig] = useState({
    location: 'Vijayawada, Andhra Pradesh, India',
    email: 'simhadrirajagmail.com',
    customerCarePhone: 'Coming Soon'
  });

  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formSubject, setFormSubject] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [sent, setSent] = useState(false);

  useEffect(() => {
    configService
      .getConfig()
      .then((res) => {
        if (res.data?.data) {
          setConfig(res.data.data);
        }
      })
      .catch(() => {});
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formName.trim() || !formEmail.trim() || !formMessage.trim()) {
      showToast('Please fill out all required fields.', 'error');
      return;
    }

    setSent(true);
    showToast('Your message has been received. Our team will contact you shortly.', 'success');
  };

  return (
    <div className="container" style={{ padding: '3.5rem 1.5rem 6rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
      <div className="section-header" style={{ marginBottom: '1rem' }}>
        <span className="section-tag">
          <MessageSquare size={16} />
          Direct Inquiries
        </span>
        <h1 className="section-title">Contact EASYWAY</h1>
        <p className="section-desc">
          Have an inquiry regarding hospital listings, appointments, or administrative coordination in Vijayawada? Reach out to our team.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2.5rem',
          maxWidth: '1000px',
          margin: '0 auto',
          width: '100%'
        }}
      >
        {/* Contact Information Card */}
        <div
          className="glass-card"
          style={{
            padding: '2.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem',
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(0, 245, 212, 0.04) 100%)',
            borderColor: 'rgba(0, 245, 212, 0.25)'
          }}
        >
          <div>
            <h2 style={{ fontSize: '1.5rem', color: '#ffffff', fontWeight: 800, marginBottom: '0.5rem' }}>
              Platform Office
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
              Operating from the heart of Vijayawada to simplify regional medical access.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Location */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <div style={{ width: '45px', height: '45px', borderRadius: '12px', background: 'rgba(0, 245, 212, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-cyan)', flexShrink: 0 }}>
                <MapPin size={22} />
              </div>
              <div>
                <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Location</div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', marginTop: '0.15rem' }}>
                  {config.location}
                </div>
              </div>
            </div>

            {/* Email */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <div style={{ width: '45px', height: '45px', borderRadius: '12px', background: 'rgba(6, 214, 160, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-teal)', flexShrink: 0 }}>
                <Mail size={22} />
              </div>
              <div>
                <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Official Email</div>
                <a
                  href={`mailto:${config.email}`}
                  style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--accent-cyan)', textDecoration: 'none', marginTop: '0.15rem', display: 'block' }}
                >
                  {config.email}
                </a>
              </div>
            </div>

            {/* Customer Care Phone (Section 32 Rule) */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <div style={{ width: '45px', height: '45px', borderRadius: '12px', background: 'rgba(0, 180, 216, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-blue)', flexShrink: 0 }}>
                <Phone size={22} />
              </div>
              <div>
                <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Dedicated Customer Care</div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', marginTop: '0.15rem' }}>
                  Customer Care: {config.customerCarePhone === 'Coming Soon' ? (
                    <span style={{ color: 'var(--color-warning)' }}>Coming Soon</span>
                  ) : (
                    config.customerCarePhone
                  )}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  Telephony lines are currently undergoing carrier provisioning.
                </div>
              </div>
            </div>

            {/* Hours */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <div style={{ width: '45px', height: '45px', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', flexShrink: 0 }}>
                <Clock size={22} />
              </div>
              <div>
                <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Support Schedule</div>
                <div style={{ fontSize: '0.95rem', color: '#ffffff', marginTop: '0.15rem' }}>
                  Monday – Saturday: 08:00 AM – 08:00 PM IST
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-emergency)', marginTop: '0.2rem' }}>
                  Emergency Hospital Desks: 24 Hours / 7 Days
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="glass-card" style={{ padding: '2.5rem' }}>
          <h2 style={{ fontSize: '1.4rem', color: '#ffffff', marginBottom: '1.25rem' }}>
            Send Us a Message
          </h2>

          {sent ? (
            <div
              style={{
                padding: '2.5rem 1.5rem',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1rem'
              }}
            >
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(6, 214, 160, 0.15)', color: 'var(--accent-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle2 size={32} />
              </div>
              <h3 style={{ fontSize: '1.2rem', color: '#ffffff', margin: 0 }}>Message Sent Successfully</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
                Thank you for contacting EasyWay. Our team will review your query and respond to <strong>{formEmail}</strong>.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSent(false);
                  setFormMessage('');
                }}
                className="btn btn-secondary btn-sm"
                style={{ marginTop: '0.5rem' }}
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" htmlFor="contact-name">Your Full Name *</label>
                <input
                  id="contact-name"
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Simhadri Raja"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" htmlFor="contact-email">Email Address *</label>
                <input
                  id="contact-email"
                  type="email"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="e.g. simhadrirajagmail.com"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" htmlFor="contact-subject">Subject</label>
                <input
                  id="contact-subject"
                  type="text"
                  value={formSubject}
                  onChange={(e) => setFormSubject(e.target.value)}
                  placeholder="e.g. Hospital Appointment Coordination"
                  className="form-input"
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" htmlFor="contact-msg">Message *</label>
                <textarea
                  id="contact-msg"
                  value={formMessage}
                  onChange={(e) => setFormMessage(e.target.value)}
                  placeholder="How can we assist you?"
                  className="form-textarea"
                  rows={4}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                <Send size={16} />
                <span>Submit Message</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
