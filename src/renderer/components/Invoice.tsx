import React from 'react';
import '../styles/invoice.css'; // Assuming you have the CSS in a separate file

interface InvoiceItem {
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
    const calculateTotal = (units: number, unitPrice: number) => units * unitPrice;
    const subtotal = items.reduce((total, item) => total + calculateTotal(item.units, item.unitPrice), 0);
    const tvaValue = subtotal * (tvaPercentage / 100); // Calculate the TVA amount
    const totalPrice = subtotal + tvaValue; // Total price with TVA
  
  return (
   <div className="invoice-container">
      <div className="invoice-header">
        <div>
          <h1>Pneus Maroc SARL</h1>
          <p>14391810</p>
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
            <th>Description</th>
            <th>Number of Units</th>
            <th>Unit Price (€)</th>
            <th>Total (€)</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index}>
              <td>{item.reference}</td>
              <td>{item.description}</td>
              <td>{item.units}</td>
              <td>{item.unitPrice}</td>
              <td>{calculateTotal(item.units, item.unitPrice)}</td>
            </tr>
          ))}
        </tbody>
      </table>

            {/* Total Section */}
            <div className="invoice-total-section">
        <h3 className='total'>Total</h3>

        {/* Comment Section */}
        {comment && (
          <ul className="invoice-comment"><li><strong>Comment:</strong> {comment}</li></ul>
        )}

        {/* Subtotal, TVA, and Final Total */}
        <div className="invoice-summary">
          <p><strong>Subtotal:</strong> {subtotal.toFixed(2)} €</p>
          <p><strong>TVA ({tvaPercentage}%):</strong> {tvaValue.toFixed(2)} €</p>
          <p className="invoice-grand-total"><strong>Total Price:</strong> {totalPrice.toFixed(2)} €</p>
        </div>
      </div>

      

    </div>
  );
};

export default Invoice;
