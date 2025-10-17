import axios from 'axios';

export const verifyRecaptcha = async (token) => {
  try {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;

    if (!secretKey) {
      throw new Error('reCAPTCHA secret key not configured');
    }

    const response = await axios.post(
      'https://www.google.com/recaptcha/api/siteverify',
      null,
      {
        params: {
          secret: secretKey,
          response: token
        }
      }
    );

    return {
      success: response.data.success,
      score: response.data.score,
      action: response.data.action,
      errorCodes: response.data['error-codes']
    };
  } catch (error) {
    throw new Error(`reCAPTCHA verification failed: ${error.message}`);
  }
};
