import React, { useState } from 'react';
import { Table, Button, Modal } from 'antd';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import '../styles/invoice.css';
import Invoice from '@renderer/components/Invoice';
import { FullscreenOutlined, ShrinkOutlined } from '@ant-design/icons';

interface Document {
  id: number;
  invoiceNumber: number;
  clientName: string;
  invoiceType: string;
  date: string;
  totalPrice: number;
}

const documentsData: Document[] = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  invoiceNumber: 1000 + i,
  clientName: `Client ${String.fromCharCode(65 + (i % 26))}${i}`, // Rotate through letters A-Z, with additional numbers for uniqueness
  invoiceType: `Type ${(i % 3) + 1}`, // Cycle through 3 types
  date: `2024-${String((i % 12) + 1).padStart(2, '0')}-15`, // Random dates in 2024
  totalPrice: (i + 1) * 150, // Incremental pricing for demo
}));

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

const ClientDocs: React.FC = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Document | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const columns = [
    {
      title: 'Invoice Number',
      dataIndex: 'invoiceNumber',
      key: 'invoiceNumber',
    },
    {
      title: "Client's Name",
      dataIndex: 'clientName',
      key: 'clientName',
    },
    {
      title: 'Invoice Type',
      dataIndex: 'invoiceType',
      key: 'invoiceType',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Total Price (with TVA)',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (text: number) => `${text} €`,
    },
    {
      title: 'Download',
      dataIndex: 'download',
      key: 'download',
      render: (_: any, record: Document) => (
        <>
          <Button type="link" onClick={() => showModal(record)}>
            Show
          </Button>
          <Button type="link" onClick={() => handleDownload(record)}>
            Download
          </Button>
        </>
      ),
    },
  ];

  const handleDownload = (record: Document) => {
    const fileContent = `Invoice: ${record.invoiceNumber}\nClient: ${record.clientName}\nDate: ${record.date}\nTotal: ${record.totalPrice} €`;
    const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, `Invoice_${record.invoiceNumber}.txt`);
  };

  const handleDownloadSelected = () => {
    const zip = new JSZip();

    selectedRowKeys.forEach((key) => {
      const document = documentsData.find((doc) => doc.id === key);
      if (document) {
        const fileContent = `Invoice: ${document.invoiceNumber}\nClient: ${document.clientName}\nDate: ${document.date}\nTotal: ${document.totalPrice} €`;
        zip.file(`Invoice_${document.invoiceNumber}.txt`, fileContent);
      }
    });

    zip.generateAsync({ type: 'blob' }).then((content) => {
      saveAs(content, 'selected_invoices.zip');
    });
  };

  const onSelectChange = (selectedRowKeys: number[]) => {
    setSelectedRowKeys(selectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const showModal = (record: Document) => {
    setSelectedInvoice(record);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedInvoice(null);
    setIsExpanded(false); // Reset to normal size when modal closes
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div>
      <h1>Client Documents</h1>
      <Button
        type="primary"
        onClick={handleDownloadSelected}
        disabled={selectedRowKeys.length === 0}
        style={{ margin: '1rem 0 1rem 0' }}
      >
        Download Selected as ZIP
      </Button>
      <Table
        rowSelection={rowSelection as any}
        dataSource={documentsData}
        columns={columns}
        rowKey="id"
        scroll={{ x: 'max-content' }}
        pagination={{
          pageSize: 7,
          showSizeChanger: true, // Allow the user to change the page size
          showQuickJumper: true, // Allow the user to quickly jump to a page
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} items`, // Show total number of items
        }}
        style={{ width: '100%' }}
      />
      <Modal
        title={
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span>Pneus Maroc SARL #{selectedInvoice?.invoiceNumber}</span>
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
        open={isModalVisible}
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
              invoiceNumber={selectedInvoice.invoiceNumber}
              clientName={selectedInvoice.clientName}
              date={selectedInvoice.date}
              invoiceType={selectedInvoice.invoiceType}
              items={invoiceItems}
              comment="This is a sample comment for additional details."
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
    </div>
  );
};

export default ClientDocs;
