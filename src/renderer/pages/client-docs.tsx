import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
  Space,
} from 'antd';
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
  const [form] = Form.useForm();
  const [data, setData] = useState<Document[]>([]);
  const [currentOptions, setCurrentOptions] = useState<
    { label: string; value: string }[]
  >([]);

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
  

  useEffect(() => {
    // Fetch documents from backend
    const fetchDocuments = async () => {
      const response = await fetch('http://localhost:3000/clients/client-invoices');
      const result = await response.json();
      console.log("result is", result)
      setData(result);
    };
    fetchDocuments();
  }, []);

  const handleCreateInvoice = async (values: any) => {
    console.log(values);
    const formattedValues = {
      clientName: values.clientName,
      invoiceType: values.invoiceType,
      items: values.items.map((item: string) => ({ name: item })), // Assuming items is an array of strings
      date: dayjs(values.date).format('YYYY-MM-DD'),
      numberOfUnits: values.units,
      price: values.price,
      comment: values.comment,
      totalPrice: values.price * values.units, // Calculate total price
    };

    try {
      const response = await fetch(
        'http://localhost:3000/clients/client-documents/create',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formattedValues),
        },
      );

      if (response.ok) {
        const newInvoice = await response.json();
        setData((prev) => [...prev, newInvoice]); // Update table data
        setIsCreateInvoiceModalVisible(false);
        form.resetFields(); // Reset the form
      } else {
        const error = await response.json();
        console.error('Failed to create invoice:', error);
      }
    } catch (err) {
      console.error('Error while creating invoice:', err);
    }
  };

  const onValuesChange = (changedValues: any) => {
    if (changedValues.invoiceType) {
      const options =
        changedValues.invoiceType === 'Car Repair'
          ? carRepairServices
          : articles;
      setCurrentOptions(options);
      form.setFieldsValue({ items: [] }); // Reset items field
    }
  };

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
      render: (text: string) => text.slice(0, 10)
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
          onFinish={handleCreateInvoice} // This should point to your function
          onValuesChange={onValuesChange}
          className="create-invoice"
        >
          {' '}
          <Form.Item
            name="clientName"
            rules={[{ required: true, message: 'Client Name is required' }]}
          >
            <Input placeholder="Client Name" />
          </Form.Item>
          <Form.Item
            name="invoiceType"
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
            name="items"
            rules={[
              { required: true, message: 'Please select at least one item' },
            ]}
          >
            <Select
              mode="multiple"
              placeholder="Select Items"
              options={currentOptions} // Options change based on `invoiceType`
            />
          </Form.Item>
          <Form.Item
            name="date"
            initialValue={dayjs()} // Default to today's date
            rules={[{ required: true, message: 'Date is required' }]}
          >
            <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="units"
            rules={[
              { required: true, message: 'Units are required' },
              {
                type: 'number',
                min: 1,
                message: 'Units must be a positive integer',
              },
            ]}
          >
            <InputNumber
              min={1}
              placeholder="Units"
              style={{ width: '100%' }}
            />
          </Form.Item>
          <Form.Item
            name="price"
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
              placeholder="Price per Unit"
              style={{ width: '100%' }}
            />
          </Form.Item>
          <Form.Item name="comment">
            <Input.TextArea placeholder="Add Comment (optional)" />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Create Invoice
              </Button>
              <Button onClick={() => form.resetFields()}>Reset</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

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
    </div>
  );
};

export default ClientDocs;
