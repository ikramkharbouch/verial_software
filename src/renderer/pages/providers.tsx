import React, { useEffect, useState } from 'react';
import { Button, Table, Space, Input, Select, Row, Col, Form, Modal, notification, Tag } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import axios from 'axios';
import '../styles/root.css';

const { Option } = Select;

interface Provider {
  id: string;
  name: string;
  orders: number;
  pending: number;
  value: number;
  email: string;
  phone: string;
  country: string;
  province: string;
  address: string;
  type: string;
  status: string;
}

const ProvidersPage: React.FC = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState<Provider[]>([]);
  const [filteredData, setFilteredData] = useState<Provider[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingProvider, setEditingProvider] = useState<Provider | null>(null);
  const statusColors: { [key: string]: string } = {
    Paid: 'green',
    Unpaid: 'red',
    Pending: 'yellow',
  };
  

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      const response = await axios.get('http://localhost:3000/providers');

      console.log(response.data)
      setData(response.data);
      setFilteredData(response.data);
    } catch (error) {
      console.error('Failed to fetch providers:', error);
      notification.error({
        message: 'Error',
        description: 'Failed to load providers.',
      });
    }
  };

  const handleCreateSubmit = async (values: Omit<Provider, 'id'>) => {
    try {
      const response = await axios.post('http://localhost:3000/providers', values);
      setData((prev) => [...prev, response.data]);
      setFilteredData((prev) => [...prev, response.data]);
      notification.success({
        message: 'Success',
        description: 'Provider created successfully.',
      });
      setIsModalVisible(false);
    } catch (error) {
      console.error('Failed to create provider:', error);
      notification.error({
        message: 'Error',
        description: 'Failed to create provider.',
      });
    }
  };

  const handleEditSubmit = async (values: Provider) => {
    try {
      await axios.put(`http://localhost:3000/providers/${editingProvider?.id}`, values);
      setData((prev) =>
        prev.map((item) => (item.id === editingProvider?.id ? { ...editingProvider, ...values } : item))
      );
      setFilteredData((prev) =>
        prev.map((item) => (item.id === editingProvider?.id ? { ...editingProvider, ...values } : item))
      );
      notification.success({
        message: 'Success',
        description: 'Provider updated successfully.',
      });
      setIsEditModalVisible(false);
    } catch (error) {
      console.error('Failed to update provider:', error);
      notification.error({
        message: 'Error',
        description: 'Failed to update provider.',
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:3000/providers/${id}`);
      setData((prev) => prev.filter((provider) => provider.id !== id));
      setFilteredData((prev) => prev.filter((provider) => provider.id !== id));
      notification.success({
        message: 'Success',
        description: 'Provider deleted successfully.',
      });
    } catch (error) {
      console.error('Failed to delete provider:', error);
      notification.error({
        message: 'Error',
        description: 'Failed to delete provider.',
      });
    }
  };

  const columns: ColumnsType<Provider> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Orders',
      dataIndex: 'orders',
      key: 'orders',
    },
    {
      title: 'Pending',
      dataIndex: 'pending',
      key: 'pending',
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Country',
      dataIndex: 'country',
      key: 'country',
    },
    {
      title: 'Province',
      dataIndex: 'province',
      key: 'province',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <Tag color={statusColors[status]}>{status}</Tag>,
    },    
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Button icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} />
        </Space>
      ),
    },
  ];

  const handleEdit = (provider: Provider) => {
    setEditingProvider(provider);
    setIsEditModalVisible(true);
  };

  const resetFilters = () => {
    form.resetFields();
    setFilteredData(data);
  };

  const handleFilter = (values: Partial<Provider>) => {
    const filtered = data.filter((provider) => {
      return Object.entries(values).every(([key, value]) => {
        if (!value) return true;
        return provider[key as keyof Provider]?.toString().toLowerCase().includes(value.toString().toLowerCase());
      });
    });
    setFilteredData(filtered);
  };

  return (
    <div>
      <h1 style={{ marginBottom: '16px' }}>Providers Management</h1>
      <div style={{ marginBottom: '24px' }}>
        <Button type="primary" onClick={() => setIsModalVisible(true)}>
          New Provider
        </Button>
      </div>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFilter}
        style={{ marginBottom: '16px' }}
      >
        <Row gutter={[16, 24]}>
          <Col span={6}>
            <Form.Item name="name">
              <Input placeholder="Name" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="type">
              <Select placeholder="Type" allowClear>
                <Option value="Wholesale">Wholesale</Option>
                <Option value="Retail">Retail</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={6}>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Filter
              </Button>
              <Button style={{ marginLeft: '8px' }} onClick={resetFilters}>
                Reset
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Table<Provider>
        columns={columns}
        dataSource={filteredData}
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />

      {/* Create Modal */}
      <Modal
        title="New Provider"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        destroyOnClose
      >
        <Form layout="vertical" onFinish={handleCreateSubmit}>
  <Form.Item name="name" label="Name" rules={[{ required: true }]}>
    <Input />
  </Form.Item>
  <Form.Item name="orders" label="Orders" rules={[{ required: true }]}>
    <Input />
  </Form.Item>
  <Form.Item name="pending" label="Pending">
    <Input />
  </Form.Item>
  <Form.Item name="value" label="Value" rules={[{ required: true }]}>
    <Input />
  </Form.Item>
  <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
    <Input />
  </Form.Item>
  <Form.Item name="phone" label="Phone" rules={[{ required: true }]}>
    <Input />
  </Form.Item>
  <Form.Item name="country" label="Country">
    <Select>
      <Option value="USA">USA</Option>
      <Option value="Canada">Canada</Option>
      <Option value="Morocco">Morocco</Option>
      <Option value="Spain">Spain</Option>
    </Select>
  </Form.Item>
  <Form.Item name="province" label="Province">
    <Input />
  </Form.Item>
  <Form.Item name="address" label="Address">
    <Input />
  </Form.Item>
  <Form.Item name="type" label="Type">
    <Select>
      <Option value="Wholesale">Wholesale</Option>
      <Option value="Retail">Retail</Option>
    </Select>
  </Form.Item>
  <Form.Item name="status" label="Status">
    <Select>
      <Option value="Paid">Paid</Option>
      <Option value="Unpaid">Unpaid</Option>
      <Option value="Pending">Pending</Option>
    </Select>
  </Form.Item>
  <Button type="primary" htmlType="submit">
    Submit
  </Button>
</Form>

      </Modal>

      {/* Edit Modal */}
      <Modal
        title="Edit Provider"
        open={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        footer={null}
        destroyOnClose
      >
        <Form
  layout="vertical"
  onFinish={handleEditSubmit}
  initialValues={editingProvider || {}}
>
  <Form.Item name="name" label="Name">
    <Input />
  </Form.Item>
  <Form.Item name="orders" label="Orders">
    <Input />
  </Form.Item>
  <Form.Item name="pending" label="Pending">
    <Input />
  </Form.Item>
  <Form.Item name="value" label="Value">
    <Input />
  </Form.Item>
  <Button type="primary" htmlType="submit">
    Save
  </Button>
</Form>

      </Modal>
    </div>
  );
};

export default ProvidersPage;
