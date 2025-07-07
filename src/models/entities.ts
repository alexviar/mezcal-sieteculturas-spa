export type Product = {
  id: number;
  name: string;
  presentation: string;
  description: string;
  price: number;
  shippingValue: number;
  stock?: number;
  images: string[];
  status: boolean;
};

export type Purchase = {
  customerAddress: string;
  customerCity: string;
  customerCountry: string | null;
  customerMail: string;
  customerName: string;
  customerPhone: string;
  customerState: string;
  date: string;
  id: number;
  productId: number;
  promoCode: string;
  quantity: number;
  shipped: boolean | number | null;
  shippingDate: string | null;
  value: number;
  paymentType: string;
  paymentMethod?: string
};

export interface CartState {
  items: Product[];
  total: number;
}

export interface UserType {
  id: number;
  name: string;
  email: string;
  emailVerifiedAt: string | null;
  emailVerificationToken: string;
  token?: string;
}

export interface UserState {
  user: UserType | null;
  token: string | null;
}
