export interface Donor {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  course: string;
  semester: string;
  teacher?: string; // Nome do professor responsável ou indicado
  quantity: number;
  date: string; // ISO string
}

export interface DonationStats {
  totalDonors: number;
  totalItems: number;
  averageItemsPerDonor: number;
}

export type ViewState = 'dashboard' | 'register' | 'edit' | 'list';