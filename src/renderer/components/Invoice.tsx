import React, { useEffect, useState } from 'react';
import '../styles/invoice.css'; // Assuming you have the CSS in a separate file

interface InvoiceItem {
  tvaPercentage2: number;
  tvaPercentage1: number;
  totalPrice: number;
  name: string;
  reference: string;
  description: string;
  units: number;
  unitPrice: number;
}

interface InvoiceProps {
  invoiceNumber: number;
  clientName: string;
  date: string;
  items: InvoiceItem[];
  invoiceType: string;
  comment?: string;  // Optional comment section
  tvaPercentage: number; // TVA percentage (e.g., 20 for 20%)
}

const Invoice: React.FC<InvoiceProps> = ({
  invoiceNumber,
  clientName,
  date,
  items,
  invoiceType,
  comment,
  tvaPercentage
}) => {
// Helper function to calculate the total price for each item
const calculateTotal = (units: number, unitPrice: number, tvaPercentage1: number, tvaPercentage2: number) => {
  // First, apply the first TVA
  const priceAfterTva1 = unitPrice * (1 + tvaPercentage1 / 100);
  // Then, apply the second TVA on the price after the first TVA
  const finalPrice = priceAfterTva1 * (1 + tvaPercentage2 / 100);
  return finalPrice * units; // Return the total price for the given number of units
};

// Calculate subtotal and TVA for each item, and keep a running total for the invoice
let totalSubtotal = 0;
let totalTva = 0;

items.forEach((item) => {
  const itemTotal = calculateTotal(item.units, item.unitPrice, item.tvaPercentage1, item.tvaPercentage2);
  totalSubtotal += itemTotal;
  totalTva += itemTotal - (item.units * item.unitPrice); // The difference between the original price and the final price is the TVA amount for this item
});

// Total price is the subtotal + total TVA
const totalPrice = totalSubtotal + totalTva;


  return (
    <div className="invoice-container">
      <div className="invoice-header">
        <div>
          <h1>Pneus Maroc SARL</h1>
          <p>Invoice Nb #{invoiceNumber}</p>
          <p>N49 AV Kaboul, Tetouan</p>
        </div>

        <div>
          <p>
            To: <strong>{clientName}</strong>
          </p>
          <p>Invoice Nb #{invoiceNumber}</p>
          <p>{date}</p>
          <p>{invoiceType}</p>
        </div>
      </div>

      {/* Invoice Items Table */}
      <table className="invoice-table">
        <thead>
          <tr>
            <th>Reference Number</th>
            
            <th>Number of Units</th>
            <th>Tva Price 1</th>
            <th>Tva Price 2</th>
            <th>Unit Price (€)</th>
            <th>Total (€)</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index}>
              <td>{item.name}</td>
              <td>{item.tvaPercentage1}</td>
              <td>{item.tvaPercentage2}</td>
              <td>{item.units}</td>
              <td>{item.unitPrice}</td>
              <td>{item.totalPrice}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Total Section */}
      <div className="invoice-total-section">
        <h3 className="total">Total</h3>

        {/* Comment Section */}
        {comment && (
          <ul className="invoice-comment">
            <li><strong>Comment:</strong> {comment}</li>
          </ul>
        )}

        {/* Subtotal, TVA, and Final Total */}
        <div className="invoice-summary">
          <p><strong>Subtotal:</strong> {totalSubtotal.toFixed(2)} MAD</p>
          <p><strong>TVA ({tvaPercentage}%):</strong> {totalTva.toFixed(2)} MAD</p>
          <p className="invoice-grand-total"><strong>Total Price:</strong> {totalPrice.toFixed(2)} MAD</p>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
