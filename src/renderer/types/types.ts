import { FieldValues, UseFormRegister } from 'react-hook-form';

export type Input = {
  type?: string;
  label?: string;
  name: string;
  placeholder: string;
  required?: boolean;
  register: UseFormRegister<FieldValues>;
  disabled?: boolean;
};

export type PhoneInputType = {
  label: string;
  value: [];
  required?: boolean;
  setPhone: React.Dispatch<React.SetStateAction<any[]>>;
  disabled?: boolean;
};

export interface Payment {
  id: string;
  payer: string;
  amount: number;
  method: string;
  date: string;
  status: "Paid" | "Pending";
}

export interface Bill {
  id: number;
  payer: string;
  amount: number;
  method: string;
  date: string; // Could be Date if you parse it before rendering
  status: string;
}

export interface InventoryItem {
  id: number; // Unique identifier for the inventory item
  name: string; // Name of the inventory item (e.g., brand or product name)
  stock: number; // Current stock level of the item
  threshold: number; // Low-stock threshold for the item
}

export interface InvoiceOverview {
  month: string;       // The month (e.g., "January", "February", etc.)
  outstanding: number; // The amount outstanding for the month
  paid: number;        // The amount paid for the month
}

export interface DueInvoicesDataPoint {
  x: string; // The date (e.g., "2024-10-01")
  y: number; // The count of due invoices (e.g., 5)
}

export interface DueInvoicesDataset {
  id: string; // The identifier for the dataset (e.g., "Invoices")
  data: DueInvoicesDataPoint[]; // Array of data points
}

export interface Provider {
  id: number;        // Unique identifier for the provider
  name: string;      // Name of the provider
  orders: number;    // Number of orders handled by the provider
  pending: number;   // Number of pending orders
  value: number;     // Total monetary value of transactions
  label: string;     // Category of the provider (e.g., "Paid", "Unpaid")
  color: string;     // Color associated with the category
}

export interface Article {
  id: number;           // Unique identifier
  name: string;         // Product name
  product: string;      // Product label
  sales: number;        // Number of items sold
  used: number;         // Number of items used
  revenue: number;      // Total revenue generated
  last_sold: string;    // Date of the last sale (ISO string)
}



