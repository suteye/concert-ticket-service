export interface Admin {
    id: string;
    email : string;
    password : string;
    name?: string;
    created_at: string;
}

export interface Concert {
    id: string;
    title: string;
    event_date: string;
    event_url?: string;
    description?: string;
    service_fee?: number;
    image_url?: string;
    status: ConcertStatus;
    created_at: string;
    updated_at: string;
}

export interface Customer {
  id: string;
  concert_id: string;
  x?: string;
  round?: string;
  ticket_count?: number;
  main_zone?: string;
  backup_zone?: string;
  use_customer_account: boolean;
  username?: string;
  password?: string;
  kplus_number?: string;
  delivery_type?: DeliveryType;
  ticket_name?: string;
  price?: number;
  phone: string;
  status: CustomerStatus;
  notes?: string;
  created_at: string;
  updated_at: string;
  concert?: Concert;
}

export interface CustomerWithConcert extends Customer {
  concert: Concert;
}

export interface DashboardStats {
  totalConcerts: number;
  totalCustomers: number;
  upcomingConcerts: number;
  completedBookings: number;
}

export type DeliveryType = 'pickup' | 'mail';
export type CustomerStatus = 'pending' | 'paid' | 'completed';
export type ConcertStatus = 'upcoming' | 'completed' | 'cancelled';