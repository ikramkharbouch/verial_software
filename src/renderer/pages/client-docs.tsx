import React, { useState, useEffect } from 'react';
import { Button } from 'antd';
import { useDispatch } from 'react-redux';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import '../styles/invoice.css';
import CreateInvoiceModal from '@renderer/components/clients/components/CreateInvoiceModal';
import InvoiceTable from '@renderer/components/clients/components/ClientDocsInvoiceTable';
import InvoiceViewModal from '@renderer/components/clients/components/InvoiceViewModal';

interface Document {
  id: number;
  invoice_id: number;
  client_name: string;
  invoice_type: string;
  date: string;
  totalPrice: number;
  comment: string;
}

const ClientDocs: React.FC = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCreateInvoiceModalVisible, setIsCreateInvoiceModalVisible] =
    useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Document | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [data, setData] = useState<Document[]>([]);

  const dispatch = useDispatch();

  useEffect(() => {
    // Fetch documents from backend
    const fetchDocuments = async () => {
      const response = await fetch(
        'http://localhost:3000/clients/client-invoices',
      );
      const result = await response.json();
      console.log('result is', result);
      setData(result);
    };
    fetchDocuments();
  }, []);

  const columns = [
    {
      title: 'Invoice Number',
      dataIndex: 'invoice_id',
      key: 'invoiceNumber',
    },
    {
      title: "Client's Name",
      dataIndex: 'client_name',
      key: 'clientName',
    },
    {
      title: 'Invoice Type',
      dataIndex: 'invoice_type',
      key: 'invoiceType',
    },
    {
      title: 'Date',
      dataIndex: 'date_of_purchase',
      key: 'date',
      render: (text: string) => text.slice(0, 10),
    },
    {
      title: 'Total Price (with TVA)',
      dataIndex: 'total_price',
      key: 'totalPrice',
      render: (text: number) => `${text} €`,
    },
    {
      title: 'Download',
      dataIndex: 'download',
      key: 'download',
      render: (_: any, record: Document) => (
        <>
          <Button type="link" onClick={() => showInvoiceModal(record)}>
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
    const fileContent = `Invoice: ${record.invoice_id}\nClient: ${record.client_name}\nDate: ${record.date}\nTotal: ${record.totalPrice} €`;
    const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, `Invoice_${record.invoice_id}.txt`);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedInvoice(null);
    setIsExpanded(false); // Reset to normal size when modal closes
  };

  const handleDownloadSelected = () => {
    const zip = new JSZip();

    selectedRowKeys.forEach((key) => {
      const document = data.find((doc) => doc.id === key);
      if (document) {
        const fileContent = `Invoice: ${document.invoice_id}\nClient: ${document.client_name}\nDate: ${document.date}\nTotal: ${document.totalPrice} €`;
        zip.file(`Invoice_${document.invoice_id}.txt`, fileContent);
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

  const showInvoiceModal = (record: Document) => {
    console.log(record);
    setSelectedInvoice(record);
    console.log(selectedInvoice?.client_name);
    setIsModalVisible(true);
  };

  const handleCancelInvoiceModal = () => {
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
      <Button
        type="primary"
        onClick={() => setIsCreateInvoiceModalVisible(true)}
        style={{ marginBottom: '16px', marginLeft: '1rem' }}
      >
        Create New Invoice
      </Button>

      <InvoiceTable data={data} columns={columns} rowSelection={rowSelection} />

      <CreateInvoiceModal
        propData={data}
        visible={isCreateInvoiceModalVisible}
        onCancel={() => setIsCreateInvoiceModalVisible(false)}
      />

      <InvoiceViewModal
        selectedInvoice={selectedInvoice}
        visible={isModalVisible}
        handleCancel={handleCancel}
      />
    </div>
  );
};

export default ClientDocs;
