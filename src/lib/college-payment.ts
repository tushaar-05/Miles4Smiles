import crypto from 'crypto';

/**
 * Pricing structure (in INR)
 * Note: Student pricing is applied securely on the server upon URN validation.
 */
export const PRICING = {
  general: {
    competitive: Number(process.env.GENERAL_COMPETITIVE_PRICE) || 249,
    'non-competitive': Number(process.env.GENERAL_JOY_PRICE) || 149,
  },
  student: {
    competitive: Number(process.env.STUDENT_COMPETITIVE_PRICE) || 99,
    'non-competitive': Number(process.env.STUDENT_JOY_PRICE) || 49,
  },
} as const;

export type ParticipantType = 'general' | 'student';
export type RaceCategory = 'competitive' | 'non-competitive';

/**
 * Calculates registration fee based on participant type and race category.
 */
export function calculateRegistrationFee(
  participantType: ParticipantType,
  category: RaceCategory
): number {
  const type = participantType === 'student' ? 'student' : 'general';
  const cat = category === 'non-competitive' ? 'non-competitive' : 'competitive';
  return PRICING[type][cat];
}

/**
 * College Gateway Configuration
 */
export const COLLEGE_GATEWAY_CONFIG = {
  url: process.env.COLLEGE_GATEWAY_URL || 'https://easebuzz.in/link/W3PNM',
  merchantId: process.env.COLLEGE_GATEWAY_MERCHANT_ID || 'COLLEGE_M4S_MERCHANT',
  secretKey: process.env.COLLEGE_GATEWAY_SECRET_KEY || 'college_gateway_secret_demo',
  callbackUrl: process.env.COLLEGE_GATEWAY_CALLBACK_URL || '/api/payment/callback',
};

/**
 * Generates an HMAC-SHA256 signature / checksum for gateway verification.
 */
export function generateChecksum(dataString: string, secretKey: string = COLLEGE_GATEWAY_CONFIG.secretKey): string {
  return crypto.createHmac('sha256', secretKey).update(dataString).digest('hex');
}

/**
 * Verifies if a checksum received from the gateway callback matches the calculated signature.
 */
export function verifyChecksum(dataString: string, receivedChecksum: string, secretKey: string = COLLEGE_GATEWAY_CONFIG.secretKey): boolean {
  const calculated = generateChecksum(dataString, secretKey);
  return crypto.timingSafeEqual(Buffer.from(calculated), Buffer.from(receivedChecksum));
}
