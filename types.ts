export interface Donor {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  quantity: number;
  date: string; // ISO string
}

export interface DonationStats {
  totalDonors: number;
  totalItems: number;
  averageItemsPerDonor: number;
}

export type ViewState = 'dashboard' | 'register';
