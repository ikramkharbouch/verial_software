export type ClientType = {
    id: string;              // Unique identifier for the client
    companyName: string;     // Name of the company
    nif: string;             // Tax Identification Number
    clientName: string;      // Contact person or representative name
    clientType: string;      // Type of client (e.g., Individual, Business)
    phoneNumbers: string[];  // Array of phone numbers
    iceo: string;            // Business Identifier (if applicable)
    country: string;         // Country of the client
    province: string;        // Province/State
    postalCode: string;      // Postal/ZIP code
    emails: string[];        // Array of email addresses
};
