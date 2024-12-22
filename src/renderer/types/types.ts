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