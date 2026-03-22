// src/services/emailService.js
import config from '../config';

// Subscribe user to email list
export const subscribeToEmailList = async ({ email, firstName = '', lastName = '', source = 'app_signup' }) => {
  if (config.emailProvider === 'mailchimp') {
    return subscribeMailchimp({ email, firstName, lastName, source });
  }
  if (config.emailProvider === 'convertkit') {
    return subscribeConvertKit({ email, firstName, source });
  }
  throw new Error('No email provider configured');
};

// Mailchimp subscription
const subscribeMailchimp = async ({ email, firstName, lastName, source }) => {
  const { serverPrefix, listId, apiKey } = config.mailchimp;

  if (!apiKey || !listId) {
    console.warn('Mailchimp not configured - skipping email subscription');
    return { success: false, reason: 'not_configured' };
  }

  // NOTE: Mailchimp API calls must go through YOUR backend proxy in production
  // Direct API calls from mobile expose your API key.
  // Replace this URL with your backend endpoint.
  const endpoint = `https://YOUR_BACKEND_URL/api/subscribe`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        firstName,
        lastName,
        source,
        provider: 'mailchimp',
        listId,
      }),
    });

    const data = await response.json();
    return { success: response.ok, data };
  } catch (error) {
    console.error('Email subscription error:', error);
    return { success: false, error: error.message };
  }
};

// ConvertKit subscription
const subscribeConvertKit = async ({ email, firstName, source }) => {
  const { apiKey, formId } = config.convertkit;

  if (!apiKey || !formId) {
    console.warn('ConvertKit not configured');
    return { success: false, reason: 'not_configured' };
  }

  try {
    const response = await fetch(
      `https://api.convertkit.com/v3/forms/${formId}/subscribe`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_key: apiKey,
          email,
          first_name: firstName,
          fields: { source },
        }),
      }
    );

    const data = await response.json();
    return { success: response.ok && data.subscription, data };
  } catch (error) {
    console.error('ConvertKit subscription error:', error);
    return { success: false, error: error.message };
  }
};

// Validate email format
export const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};
