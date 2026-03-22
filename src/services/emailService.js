var BACKEND_URL = 'https://flipfinder-backend-production.up.railway.app';

export async function subscribeToEmailList(options) {
  var email = options.email || '';
  var firstName = options.firstName || '';
  var source = options.source || 'app_signup';

  try {
    var response = await fetch(BACKEND_URL + '/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, firstName: firstName, source: source }),
    });
    var data = await response.json();
    return { success: response.ok, data: data };
  } catch (error) {
    console.error('Subscribe error:', error);
    return { success: false, error: error.message };
  }
}

export function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
