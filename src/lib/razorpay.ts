import Razorpay from 'razorpay';

export const RAZORPAY_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_TWFMtJURHWxgq4';
export const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'zAetwFw0CzXFfACnOwTSZbGu';

export const getRazorpayInstance = () => {
  const key_id = RAZORPAY_KEY_ID;
  const key_secret = RAZORPAY_KEY_SECRET;

  if (!key_id || !key_secret) {
    throw new Error('Razorpay API keys are missing in environment variables.');
  }

  return new Razorpay({
    key_id,
    key_secret,
  });
};
