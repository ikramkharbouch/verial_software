export type ProviderType = {
    id: string;                 // Unique identifier for the provider
    companyName: string;        // Name of the provider's company
    nif: string;                // Tax Identification Number
    contactName: string;        // Main contact person
    phoneNumbers: string[];     // Array of phone numbers
    emails: string[];           // Array of email addresses
    country: string;            // Country of the provider
    province: string;           // Province/State
    postalCode: string;         // Postal/ZIP code
};
