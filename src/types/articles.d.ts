export type ArticleType = {
    id: string;              // Unique identifier for the article
    productName: string;     // Name of the product
    providerId: string;      // ID of the provider
    dimensions: string;      // Dimensions (e.g., size for tires)
    speedRating: string;     // Speed rating (if applicable)
    loadIndex: string;       // Load index (if applicable)
    purchasePrice: number;   // Purchase price
    profitMargin: number;    // Profit margin percentage
    totalPrice: number;      // Total price
    currency: string;        // Currency (e.g., MAD, USD)
};
