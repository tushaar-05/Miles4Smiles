export type CategoryType = 'boys' | 'girls';
export type RaceCategory = 'competitive' | 'non-competitive';
export type ParticipantType = 'general' | 'student';
export type AgeCategory = 'male' | 'female' | 'adult';

export interface Participant {
  id: string;
  participantType: ParticipantType;
  urn?: string;
  collegeName?: string;
  firstName: string;
  lastName?: string;
  email: string;
  phone: string;
  category: RaceCategory;
  ageCategory?: AgeCategory;
  age?: number;
  gender: 'Male' | 'Female' | 'Other';
  dob: string;
  bloodGroup: string;
  weight?: string;
  height?: string;
  tShirtSize: string;
  city: string;
  emergencyName: string;
  emergencyPhone: string;
  chestNumber?: string;
  bibNumber?: string;
  amount: number;
  paymentStatus: 'pending' | 'paid' | 'failed';
  paymentGateway?: string;
  gatewayOrderId?: string;
  gatewayPaymentId?: string;
  createdAt: string;
}

export interface PaymentRecord {
  id: string;
  participantId?: string;
  gatewayOrderId: string;
  gatewayPaymentId?: string;
  amount: number;
  currency: string;
  status: 'created' | 'paid' | 'failed';
  createdAt: string;
}

export interface Sponsor {
  id: string;
  name: string;
  tier: 'title' | 'gold' | 'silver' | 'partner';
  logoUrl: string;
  websiteUrl?: string;
}
