import React, { useState, useEffect } from 'react';
import { Button, Table, Checkbox, message, Tooltip, Modal, Form, Input, Select, DatePicker, InputNumber } from 'antd';
import { DeleteOutlined, DownloadOutlined, EditOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';

const { Option } = Select;

interface ProviderDocument {
  id: string;
  invoiceNumber: string;
  providerName: string;
  invoiceType: string;
  date: string;
  totalPrice: string;
}

const ProvidersDocumentsPage: React.FC = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [data, setData] = useState<ProviderDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [providers, setProviders] = useState([]);
  const [articles, setArticles] = useState([]);
  const [selectedArticles, setSelectedArticles] = useState<any[]>([]);

  const [form] = Form.useForm();

  // Fetch data from the backend
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:3000/providers/provider-documents'); // Replace with your backend route
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const result = await response.json();
        const formattedData = result.map((item: any) => ({
          id: item.id,
          invoiceNumber: item.invoice_number,
          providerName: item.provider_name,
          invoiceType: item.invoice_type,
          date: item.date.slice(0, 10),
          totalPrice: item.total_price_with_tva,
        }));

        setData(formattedData);
      } catch (error) {
        console.error('Error fetching provider documents:', error);
        message.error('Failed to load provider documents.');
      } finally {
        setLoading(false);
      }
    };

    const fetchProviders = async () => {
      try {
        const response = await fetch('http://localhost:3000/providers'); // Replace with your backend route
        const result = await response.json();
        setProviders(result);
      } catch (error) {
        console.error('Error fetching providers:', error);
        message.error('Failed to load providers.');
      }
    };

    const fetchArticles = async () => {
      try {
        const response = await fetch('http://localhost:3000/articles'); // Replace with your backend route
        const result = await response.json();
        setArticles(result);
      } catch (error) {
        console.error('Error fetching articles:', error);
        message.error('Failed to load articles.');
      }
    };

    fetchData();
    fetchProviders();
    fetchArticles();
  }, []);

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const addArticle = () => {
    if (selectedArticles.length >= 10) {
      message.warning('You can only add up to 10 articles.');
      return;
    }
    setSelectedArticles([...selectedArticles, { articleId: '', units: 0 }]);
  };

  const removeArticle = (index: number) => {
    const updatedArticles = [...selectedArticles];
    updatedArticles.splice(index, 1);
    setSelectedArticles(updatedArticles);
  };

  const handleCreateInvoice = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setSelectedArticles([]);
  };

  const onFinish = (values: any) => {
    const invoiceData = {
      ...values,
      articles: selectedArticles,
    };
    console.log('Submitted Invoice Data:', invoiceData);
    message.success('Invoice created successfully!');
    setIsModalVisible(false);
    form.resetFields();
    setSelectedArticles([]);
  };

  const columns = [
    {
      title: 'Invoice Number',
      dataIndex: 'invoiceNumber',
      key: 'invoiceNumber',
    },
    {
      title: 'Provider Name',
      dataIndex: 'providerName',
      key: 'providerName',
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
    },
    {
      title: 'Download',
      key: 'download',
      render: (record: ProviderDocument) => (
        <Tooltip title="Download">
          <Button
            type="link"
            icon={<DownloadOutlined style={{ color: 'black' }} />}
            onClick={() => console.log(`Download invoice: ${record.id}`)}
          />
        </Tooltip>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: ProviderDocument) => (
        <div>
          <Tooltip title="Edit">
            <Button
              type="link"
              icon={<EditOutlined style={{ color: 'black' }} />}
              onClick={() => console.log(`Edit invoice: ${record.id}`)}
              style={{ marginRight: 8 }}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              type="link"
              icon={<DeleteOutlined style={{ color: 'red' }} />}
              onClick={() => console.log(`Delete invoice: ${record.id}`)}
              style={{ marginRight: 8 }}
            />
          </Tooltip>
          <Tooltip title="View">
            <Button
              type="link"
              icon={<EyeOutlined style={{ color: 'black' }} />}
              onClick={() => console.log(`View invoice: ${record.id}`)}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
    ],
  };

  return (
    <div>
      <h1 style={{ marginBottom: '16px' }}>Providers Documents</h1>
      <div style={{ marginBottom: '16px' }}>
        <Checkbox
          checked={selectedRowKeys.length === data.length}
          indeterminate={selectedRowKeys.length > 0 && selectedRowKeys.length < data.length}
          onChange={(e) =>
            setSelectedRowKeys(e.target.checked ? data.map((item) => item.id) : [])
          }
          style={{ marginRight: '12px' }}
        >
          Select All
        </Checkbox>
        <Button
          type="primary"
          onClick={() => console.log('Download selected as ZIP:', selectedRowKeys)}
          disabled={selectedRowKeys.length === 0}
          style={{ marginRight: 12 }}
        >
          Download All as ZIP
        </Button>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateInvoice}>
          Create New Invoice
        </Button>
      </div>
      <Table<ProviderDocument>
        rowSelection={rowSelection}
        columns={columns}
        dataSource={data}
        rowKey="id"
        pagination={{ pageSize: 7 }}
        loading={loading}
      />
      <Modal
        title="Create New Invoice"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Invoice Number"
            name="invoice_number"
            rules={[{ required: true, message: 'Please enter the invoice number' }]}
          >
            <Input placeholder="Enter Invoice Number" />
          </Form.Item>
          <Form.Item
            label="Invoice Type"
            name="invoice_type"
            rules={[{ required: true, message: 'Please select the invoice type' }]}
          >
            <Select placeholder="Select Invoice Type">
              <Option value="Standard">Standard</Option>
              <Option value="Express">Express</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Date"
            name="date"
            rules={[{ required: true, message: 'Please select the invoice date' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            label="Provider"
            name="provider_id"
            rules={[{ required: true, message: 'Please select a provider' }]}
          >
            <Select placeholder="Select Provider">
              {providers.map((provider: any) => (
                <Option key={provider.id} value={provider.id}>
                  {provider.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <h3>Articles</h3>
          <Button type="dashed" icon={<PlusOutlined />} onClick={addArticle} style={{ marginBottom: 16 }}>
            Add Article
          </Button>
          <Table
            dataSource={selectedArticles}
            rowKey={(record, index) => `${index}`}
            pagination={false}
            columns={[
              {
                title: 'Article',
                dataIndex: 'articleId',
                render: (value, record, index) => (
                  <Select
                    placeholder="Select Article"
                    value={value}
                    onChange={(articleId) => {
                      const updatedArticles = [...selectedArticles];
                      updatedArticles[index].articleId = articleId;
                      setSelectedArticles(updatedArticles);
                    }}
                    style={{ width: '100%' }}
                  >
                    {articles.map((article: any) => (
                      <Option key={article.id} value={article.id}>
                        {article.name}
                      </Option>
                    ))}
                  </Select>
                ),
              },
              {
                title: 'Units',
                dataIndex: 'units',
                render: (value, record, index) => (
                  <InputNumber
                    min={1}
                    value={value}
                    onChange={(units) => {
                      const updatedArticles = [...selectedArticles];
                      updatedArticles[index].units = units;
                      setSelectedArticles(updatedArticles);
                    }}
                    style={{ width: '100%' }}
                  />
                ),
              },
              {
                title: 'Actions',
                render: (value, record, index) => (
                  <Button type="link" danger onClick={() => removeArticle(index)}>
                    Remove
                  </Button>
                ),
              },
            ]}
          />
          <Form.Item
            label="Total Price (with TVA)"
            name="total_price_with_tva"
            rules={[{ required: true, message: 'Please enter the total price with TVA' }]}
          >
            <InputNumber placeholder="Enter Total Price with TVA" style={{ width: '100%' }} min={0} precision={2} />
          </Form.Item>
          <Button type="primary" htmlType="submit" style={{ marginTop: 16 }}>
            Submit
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default ProvidersDocumentsPage; 