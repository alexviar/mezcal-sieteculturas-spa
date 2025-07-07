import { AxiosError, AxiosResponse } from "axios";

export interface LayoutProps {
  children: React.ReactNode;
}

export function pageTitle(path: string) {
  switch (path) {
    case "/dashboard/home":
      return "Inicio";
    case "/dashboard/products":
      return "Productos";
    case "/dashboard/settings":
      return "Configuraciones";
    case "/dashboard/purchases":
      return "Ventas";
    default:
      return "Inicio";
  }
}

export type ContextProps = {
  getToast: (message: string) => void;
  open: boolean;
  message: string;
};

export type NotificationProps = {
  open?: boolean;
  message?: string;
};
export interface Pagination {
  current_page: number;
  total_pages: number;
  total_purchases?: number;
  total_products?: number;
}
export const exponentialBackoff = async (
  fn: () => Promise<{
    data?: any;
    response?: AxiosResponse<any> | undefined;
    error?: AxiosError;
  }>,
  retries = 5,
  initialDelay = 1000,
  maxDelay = 60000
) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      if (error.response?.status === 429 && i < retries - 1) {
        const delay = Math.min(initialDelay * 2 ** i, maxDelay);
        console.warn(`Rate limit hit. Retrying in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }
};

export type PaginationProps = {
  pagination: {
    total_pages: number;
    current_page: number;
    total_products: number;
  };
  onPageChange: (page: number) => void;
};
