import React from 'react';
import { Modal, Button } from 'antd';
import { FullscreenOutlined, ShrinkOutlined } from '@ant-design/icons';
import Invoice from '@renderer/components/Invoice';

const InvoiceViewModal = ({
    selectedInvoice, 
  visible,
  handleCancel,
  invoice,
  isExpanded,
  toggleExpand,
}: any) => {

    const invoiceItems = [
      {
        reference: 'REF001',
        description: 'Consulting Service',
        units: 2,
        unitPrice: 100,
      },
      {
        reference: 'REF002',
        description: 'Website Design',
        units: 1,
        unitPrice: 500,
      },
      {
        reference: 'REF003',
        description: 'SEO Optimization',
        units: 3,
        unitPrice: 150,
      },
    ];

    
  return (
    <Modal
    title={
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span>Pneus Maroc SARL #{selectedInvoice?.invoice_id}</span>
        <Button
          icon={isExpanded ? <ShrinkOutlined /> : <FullscreenOutlined />}
          onClick={toggleExpand}
          style={{
            border: 'none',
            boxShadow: 'none',
            marginRight: '20px', // Add margin to the right to create space from the close button
          }}
        />
      </div>
    }
    open={visible}
    onCancel={handleCancel}
    footer={[
      <Button key="close" onClick={handleCancel}>
        Close
      </Button>,
      <Button key="submit" type="primary">
        Download
      </Button>,
    ]}
    width={isExpanded ? '100vw' : 800} // Full width on expand
    style={{
      top: isExpanded ? 0 : 20,
      height: isExpanded ? '100vh' : 'auto', // Full height on expand
      overflowY: isExpanded ? 'auto' : 'visible',
    }} // Fullscreen style
  >
    {selectedInvoice && (
      <div className="invoice-modal">
        <Invoice
          invoiceNumber={selectedInvoice.invoice_id}
          clientName={selectedInvoice.client_name}
          date={selectedInvoice.date}
          invoiceType={selectedInvoice.invoice_type}
          items={invoiceItems}
          comment={selectedInvoice.comment}
          tvaPercentage={20}
        />
      </div>
    )}

    <footer className="invoice-footer">
      <p>
        <strong>contact:</strong>mac@gmail.com +212938292019
      </p>
      <p>Thank you for trusting MAC company.</p>
    </footer>
  </Modal>
  );
};

export default InvoiceViewModal;
