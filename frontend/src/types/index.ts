// Backend (`backend/src/schemas/*`) bilan mos keladigan tiplar.

export type Role = 'user' | 'admin' | 'clubOwner';
export type PlanType = 'free' | 'pro' | 'max';
export type BillingCycle = 'monthly' | 'yearly';
export type SubscriptionStatus = 'active' | 'expired' | 'cancelled';
export type ClubStatus = 'pending' | 'approved' | 'blocked';
export type RoomType = 'vip' | 'umumiy';
export type PcStatus = 'bosh' | 'band' | 'texnik_xizmat';
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface CurrentUser {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
  role?: Role; // faqat User modelida yo'q — login javobida rol alohida keladi
  plan?: PlanType;
  telegramId?: string;
  isActive?: boolean;
}

export interface AuthResponse {
  accessToken: string;
  user: CurrentUser;
}

export interface Club {
  _id: string;
  name: string;
  address: string;
  location: { lat: number; lng: number };
  imageUrl?: string;
  owner: string;
  status: ClubStatus;
  isPromoted: boolean;
  ratingAverage: number;
  ratingCount: number;
  createdAt: string;
}

export interface Room {
  _id: string;
  club: string;
  name: string;
  type: RoomType;
  pricePerHour: number;
}

export interface Pc {
  _id: string;
  club: string;
  room: string;
  label: string;
  status: PcStatus;
}

export interface Snack {
  _id: string;
  club: string;
  name: string;
  price: number;
  isAvailable: boolean;
}

export interface BookingSnackItem {
  snack: string | Snack;
  quantity: number;
  unitPrice: number;
}

export interface Booking {
  _id: string;
  user: string;
  club: Club | string;
  room: Room | string;
  pc: Pc | string;
  hours: number;
  startTime: string;
  snacks: BookingSnackItem[];
  roomCost: number;
  snacksCost: number;
  totalPrice: number;
  status: BookingStatus;
  createdAt: string;
}

export interface Review {
  _id: string;
  user: string | { _id: string; fullName: string };
  club: string;
  booking: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface Subscription {
  _id: string;
  subscriber: string;
  subscriberModel: 'User' | 'ClubOwner';
  plan: 'pro' | 'max';
  billingCycle: BillingCycle;
  startDate: string;
  endDate: string;
  status: SubscriptionStatus;
  autoRenew: boolean;
  amountPaid: number;
}

export interface ClubOwner {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
  plan: PlanType;
  isActive: boolean;
}

export interface AdminAccount {
  _id: string;
  fullName: string;
  email: string;
  isActive: boolean;
}

export interface AdminStats {
  usersCount: number;
  ownersCount: number;
  clubsCount: number;
  bookingsCount: number;
}
