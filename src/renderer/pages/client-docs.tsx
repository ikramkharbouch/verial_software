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
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Document) => (
        <Space>
          <Button type="link" onClick={() => showInvoiceModal(record)}>
            Show
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
      date_of_purchase: dayjs(record.date),
      total_price: record.totalPrice,
      comment: record.comment,
    });
    setIsEditModalVisible(true); // Open the edit modal
  };

  const handleDelete = async (record: Document) => {
    try {
      const response = await fetch(
        `http://localhost:3000/clients/client-invoices/${record.invoice_id}`,
        {
          method: 'DELETE',
        },
      );

      if (response.ok) {
        setData((prevData) =>
          prevData.filter((item) => item.invoice_id !== record.invoice_id),
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
