export type CategoryType = 'boys' | 'girls';

export interface Participant {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  category: CategoryType;
  age: number;
  gender: 'male' | 'female' | 'other';
  bibNumber?: number;
  paymentStatus: 'pending' | 'completed' | 'failed';
  createdAt: string;
}

export interface PaymentRecord {
  id: string;
  participantId: string;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
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
