import { Resend } from 'resend';

export const getResendInstance = () => {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error('Resend API key is missing in environment variables.');
  }

  return new Resend(apiKey);
};
