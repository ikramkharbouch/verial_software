export type FinancialRecordType = {
    id: string;                 // Unique identifier
    recordType: 'charge' | 'payment' | 'bill'; // Type of financial record
    description: string;        // Description of the record
    date: string;               // ISO 8601 date string
    amount: number;             // Amount of the transaction
    currency: string;           // Currency (e.g., MAD, USD)
    clientId?: string;          // Optional: Associated client ID
    providerId?: string;        // Optional: Associated provider ID
};
