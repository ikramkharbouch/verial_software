import React, { useState, useEffect } from 'react';
import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Space,
} from 'antd';
import { useDispatch } from 'react-redux';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import '../styles/invoice.css';
import CreateInvoiceModal from '@renderer/components/clients/components/CreateInvoiceModal';
import InvoiceTable from '@renderer/components/clients/components/ClientDocsInvoiceTable';
import InvoiceViewModal from '@renderer/components/clients/components/InvoiceViewModal';
import dayjs from 'dayjs';
import printJS from 'print-js';

interface Document {
  id: number;
  invoice_number: number;
  client_name: string;
  invoice_type: string;
  date_of_purchase: string;
  total_price: number;
  comment: string;
  items: { 
    name: string; 
    units: number; 
    unitPrice: number; 
  }[]; // This will store the list of items with the respective units and unit prices
}


const ClientDocs: React.FC = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCreateInvoiceModalVisible, setIsCreateInvoiceModalVisible] =
    useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Document | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [data, setData] = useState<Document[]>([]);

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editForm] = Form.useForm(); // Form for editing
  const [editingInvoice, setEditingInvoice] = useState<Document | null>(null);

  const { Option } = Select;
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

  const handlePrint = (record: Document) => {
    console.log('print test');
  
    // Create a temporary div element to hold the content for printing
    const printableContent = `
      <div class="invoice">
        <h1>Invoice ${record.invoice_number}</h1>
        <div class="details">
          <div><strong>Client Name:</strong> ${record.client_name}</div>
          <div><strong>Invoice Type:</strong> ${record.invoice_type}</div>
          <div><strong>Date:</strong> ${record.date_of_purchase}</div>
          <div><strong>Total Price:</strong> ${record.total_price} €</div>
          <div><strong>Comment:</strong> ${record.comment}</div>
        </div>
      </div>
    `;
  
    // Create a temporary container for the content
    const printContainer = document.createElement('div');
    printContainer.innerHTML = printableContent;
  
    // Append the temporary container to the body
    document.body.appendChild(printContainer);
  
    // Use Print.js to print the content of the temporary container
    printJS({
      printable: printContainer,
      type: 'html',
      style: `
        body { font-family: Arial, sans-serif; margin: 20px; }
        .invoice { border: 1px solid #ccc; padding: 20px; }
        .invoice h1 { text-align: center; }
        .invoice .details { margin-top: 20px; }
        .invoice .details div { margin-bottom: 10px; }
      `
    });
  
    // Remove the temporary container after printing
    document.body.removeChild(printContainer);
  };
  

  const columns = [
    {
      title: 'Invoice Number',
      dataIndex: 'invoice_number',
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
      title: 'Items',
      dataIndex: 'items',
      key: 'items',
      render: (items: any) => (
        <ul>
          {items.map((item: any, index: number) => (
            <li key={index}>
              {item.name} (x{item.units}) - {item.unitPrice} MAD/unit
            </li>
          ))}
        </ul>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'date_of_purchase',
      key: 'date',
      render: (text: string) => text.slice(0, 10), // Format date as yyyy-mm-dd
    },
    {
      title: 'Total Price (with TVA)',
      dataIndex: 'total_price',
      key: 'totalPrice',
      render: (text: any) => {
        const numericValue = Number(text);
        if (!isNaN(numericValue)) {
          return `${numericValue.toFixed(2)} MAD`; // Display price with two decimal places
        } else {
          return 'Invalid number';
        }
      },
    },       
    {
      title: 'Comment',
      dataIndex: 'comment',
      key: 'comment',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Document) => (
        <Space>
          <Button type="link" onClick={() => showInvoiceModal(record)}>
            Show
          </Button>
          <Button type="link" onClick={() => handlePrint(record)}>
            Print
          </Button>
          <Button type="link" onClick={() => handleDownload(record)}>
            Download
          </Button>
          <Button type="link" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];
  

  const [form] = Form.useForm();

  const handleEdit = (record: Document) => {
    setEditingInvoice(record); // Set the invoice being edited
    editForm.setFieldsValue({
      client_name: record.client_name,
      invoice_type: record.invoice_type,
      date_of_purchase: dayjs(record.date_of_purchase),
      total_price: record.total_price,
      comment: record.comment,
    });
    setIsEditModalVisible(true); // Open the edit modal
  };

  const handleDelete = async (record: Document) => {
    try {
      const response = await fetch(
        `http://localhost:3000/clients/client-invoices/${record.invoice_number}`,
        {
          method: 'DELETE',
        },
      );

      if (response.ok) {
        setData((prevData) =>
          prevData.filter((item) => item.invoice_number !== record.invoice_number),
        );
      } else {
        console.error('Failed to delete invoice');
      }
    } catch (err) {
      console.error('Error deleting invoice:', err);
    }
  };

  const handleEditSubmit = async (values: any) => {
    const updatedInvoice = {
      ...editingInvoice,
      ...values,
      date_of_purchase: dayjs(values.date_of_purchase).format('YYYY-MM-DD'), // Format date
    };

    try {
      const response = await fetch(
        `http://localhost:3000/clients/client-invoices/${editingInvoice?.id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedInvoice),
        },
      );

      if (response.ok) {
        setData((prev) =>
          prev.map((item) =>
            item.id === editingInvoice?.id ? updatedInvoice : item,
          ),
        );
        setIsEditModalVisible(false);
        setEditingInvoice(null);
        editForm.resetFields();
      } else {
        console.error('Failed to update invoice:', await response.json());
      }
    } catch (error) {
      console.error('Error while updating invoice:', error);
    }
  };

  const handleDownload = (record: Document) => {
    const fileContent = `Invoice: ${record.invoice_number}\nClient: ${record.client_name}\nDate: ${record.date_of_purchase}\nTotal: ${record.total_price} MAD`;
    const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, `Invoice_${record.invoice_number}.txt`);
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
        const fileContent = `Invoice: ${document.invoice_number}\nClient: ${document.client_name}\nDate: ${document.date_of_purchase}\nTotal: ${document.total_price} €`;
        zip.file(`Invoice_${document.invoice_number}.txt`, fileContent);
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

  const handleDataUpdate = (newData: Document[]) => {
    console.log(newData);

    // Check if newData is an array or a single object
    if (Array.isArray(newData)) {
      setData([...newData, ...data]); // Spread the newData array
    } else {
      setData([newData, ...data]); // If newData is an object, add it to the array
    }
  
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
        style={{ marginBottom: '16px', marginLeft: '1rem' }}>
        Create New Invoice
      </Button>

      <InvoiceTable data={data} columns={columns} rowSelection={rowSelection} />

      <CreateInvoiceModal
        propData={data}
        visible={isCreateInvoiceModalVisible}
        onCancel={() => setIsCreateInvoiceModalVisible(false)}
        onDataUpdate={handleDataUpdate}
      />

      <InvoiceViewModal
        selectedInvoice={selectedInvoice}
        visible={isModalVisible}
        handleCancel={handleCancel}
      />

      <Modal
        title="Edit Invoice"
        open={isEditModalVisible}
        onCancel={() => {
          setIsEditModalVisible(false);
          setEditingInvoice(null);
          editForm.resetFields();
        }}
        footer={null}
      >
        <Form form={editForm} layout="vertical" onFinish={handleEditSubmit} className='create-edit-invoice'>
          <Form.Item
            name="client_name"
            rules={[{ required: true, message: 'Client Name is required' }]}
          >
            <Input placeholder="Client Name" />
          </Form.Item>
          <Form.Item
            name="invoice_type"
            rules={[
              { required: true, message: 'Please select an invoice type' },
            ]}
          >
            <Select placeholder="Select Invoice Type">
              <Option value="Car Repair">Car Repair</Option>
              <Option value="Article Purchase">Article Purchase</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="date_of_purchase"
            rules={[{ required: true, message: 'Date is required' }]}
          >
            <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="total_price"
            rules={[
              { required: true, message: 'Price is required' },
              {
                type: 'number',
                min: 0,
                message: 'Price must be a positive value',
              },
            ]}
          >
            <InputNumber
              min={0}
              prefix="€"
              placeholder="Total Price"
              style={{ width: '100%' }}
            />
          </Form.Item>
          <Form.Item name="comment">
            <Input.TextArea placeholder="Add Comment (optional)" />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Save Changes
              </Button>
              <Button onClick={() => editForm.resetFields()}>Reset</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ClientDocs;
