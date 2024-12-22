import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, DatePicker, InputNumber, Space } from 'antd';
import { useDispatch } from 'react-redux';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { FullscreenOutlined, ShrinkOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import Invoice from '@renderer/components/Invoice';
import '../styles/invoice.css';

const { Option } = Select;

interface Document {
  id: number;
  invoiceNumber: number;
  clientName: string;
  invoiceType: string;
  date: string;
  totalPrice: number;
}

const ClientDocs: React.FC = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCreateInvoiceModalVisible, setIsCreateInvoiceModalVisible] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Document | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [form] = Form.useForm();
  const [data, setData] = useState<Document[]>([]);
  const [currentOptions, setCurrentOptions] = useState<{ label: string; value: string }[]>([]);

  const dispatch = useDispatch();

  const articles = [
    { label: 'Michelin Tire', value: 'Michelin Tire' },
    { label: 'Bridgestone Tire', value: 'Bridgestone Tire' },
    { label: 'Goodyear Tire', value: 'Goodyear Tire' },
    { label: 'Car Accessory A', value: 'Car Accessory A' },
    { label: 'Car Accessory B', value: 'Car Accessory B' },
  ];

  const carRepairServices = [
    { label: 'Oil Change', value: 'Oil Change' },
    { label: 'Tire Rotation', value: 'Tire Rotation' },
    { label: 'Engine Tuning', value: 'Engine Tuning' },
  ];

  useEffect(() => {
    // Fetch documents from backend
    const fetchDocuments = async () => {
      const response = await fetch('/api/client-documents');
      const result = await response.json();
      setData(result);
    };
    fetchDocuments();
  }, []);

  const handleCreateInvoice = async (values: any) => {
    // Save invoice to backend
    const response = await fetch('/api/client-documents/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });

    if (response.ok) {
      const newInvoice = await response.json();
      setData((prev) => [...prev, newInvoice]); // Update table data
      setIsCreateInvoiceModalVisible(false);
      form.resetFields(); // Reset the form
    } else {
      console.error('Failed to create invoice');
    }
  };

  const onValuesChange = (changedValues: any) => {
    if (changedValues.invoiceType) {
      const options =
        changedValues.invoiceType === 'Car Repair' ? carRepairServices : articles;
      setCurrentOptions(options);
      form.setFieldsValue({ items: [] }); // Reset items field
    }
  };

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
    const fileContent = `Invoice: ${record.invoiceNumber}\nClient: ${record.clientName}\nDate: ${record.date}\nTotal: ${record.totalPrice} €`;
    const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, `Invoice_${record.invoiceNumber}.txt`);
  };

  const handleDownloadSelected = () => {
    const zip = new JSZip();

    selectedRowKeys.forEach((key) => {
      const document = data.find((doc) => doc.id === key);
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

  const showInvoiceModal = (record: Document) => {
    setSelectedInvoice(record);
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
        style={{ marginBottom: '16px' }}
      >
        Create New Invoice
      </Button>
      <Table
        rowSelection={rowSelection as any}
        dataSource={data}
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
        title="Create New Invoice"
        open={isCreateInvoiceModalVisible}
        onCancel={() => setIsCreateInvoiceModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateInvoice}
          onValuesChange={onValuesChange}
          className='create-invoice'
        >
          <Form.Item name="clientName" rules={[{ required: true }]}>
            <Input placeholder="Client Name" />
          </Form.Item>
          <Form.Item name="invoiceType" rules={[{ required: true }]}>
            <Select placeholder="Select Type">
              <Option value="Car Repair">Car Repair</Option>
              <Option value="Article Purchase">Article Purchase</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="items"
            rules={[{ required: true, message: 'Please select at least one item' }]}
          >
            <Select mode="multiple" placeholder="Select items" options={currentOptions} />
          </Form.Item>
          <Form.Item
            name="date"
            initialValue={dayjs()}
            rules={[{ required: true, message: 'Please select a date' }]}
          >
            <DatePicker format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item name="units" rules={[{ required: true }]}>
            <InputNumber min={1} placeholder="Units" />
          </Form.Item>
          <Form.Item name="price" rules={[{ required: true }]}>
            <InputNumber min={0} prefix="€" placeholder="Price" />
          </Form.Item>
          <Form.Item name="comment">
            <Input.TextArea placeholder="Add Comment" />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Create
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default ClientDocs;
