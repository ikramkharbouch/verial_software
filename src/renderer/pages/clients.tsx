import React, { useEffect, useState } from 'react';
import {
  Table,
  Input,
  Select,
  Button,
  Form,
  Row,
  Col,
  Space,
  Tooltip,
  message,
} from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import CreateNewClient from '@renderer/components/clients/createNew';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { getClients } from '../../store/slices/clientsSlice';
import '../styles/clients.css';

const { Option } = Select;

const ClientsPage: React.FC = () => {
  const { clients, status } = useSelector((state: RootState) => state.clients);
  const [data, setData] = useState(clients);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (status === 'idle') {
      dispatch(getClients());
    }
  }, [dispatch, status]);

  useEffect(() => {
    setData(clients);
  }, [clients]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const handleNewClientCreated = (newClient: any) => {
    // Refresh the client list
    dispatch(getClients());
  };

  const handleFilter = (values: Partial<any>) => {
    const filteredData = clients.filter((client) => {
      return Object.entries(values).every(([key, value]) => {
        if (!value) return true;
        return String(client[key as keyof typeof client])
          .toLowerCase()
          .includes(String(value).toLowerCase());
      });
    });
    setData(filteredData);
  };

  const resetFilters = () => {
    form.resetFields();
    setData(clients);
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Company Name',
      dataIndex: 'companyName',
      key: 'companyName',
    },
    {
      title: 'Client Name',
      dataIndex: 'clientName',
      key: 'clientName',
    },
    {
      title: 'Type of Client',
      dataIndex: 'clientType',
      key: 'clientType',
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
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space size="middle">
          <Tooltip title="Edit">
            <Button icon={<EditOutlined />} onClick={showModal} />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              icon={<DeleteOutlined />}
              onClick={() => message.warning('Delete functionality pending')}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h1>Client Management</h1>
      <div className="clients-actions">
        <Button type="primary" onClick={showModal}>
          Create New Client
        </Button>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleFilter}
        style={{ marginBottom: 16 }}
      >
        <Row gutter={16}>
          <Col span={6}>
            <Form.Item name="companyName" label="Company Name">
              <Input placeholder="Enter company name" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="clientName" label="Client Name">
              <Input placeholder="Enter client name" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="clientType" label="Type of Client">
              <Select placeholder="Select type" allowClear>
                <Option value="Individual">Individual</Option>
                <Option value="Corporate">Corporate</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="country" label="Country">
              <Select placeholder="Select country" allowClear>
                <Option value="USA">USA</Option>
                <Option value="Canada">Canada</Option>
                <Option value="UK">UK</Option>
                <Option value="Australia">Australia</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={6}>
            <Form.Item name="province" label="Province/State">
              <Input placeholder="Enter province/state" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="industry" label="Industry">
              <Select placeholder="Select industry" allowClear>
                <Option value="Technology">Technology</Option>
                <Option value="Finance">Finance</Option>
                <Option value="Healthcare">Healthcare</Option>
                <Option value="Retail">Retail</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="source" label="Source">
              <Select placeholder="Select source" allowClear>
                <Option value="Referral">Referral</Option>
                <Option value="Advertisement">Advertisement</Option>
                <Option value="Website">Website</Option>
                <Option value="Event">Event</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <div style={{ display: 'flex', alignItems: 'flex-end', height: '100%' }}>
              <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
                Filter
              </Button>
              <Button onClick={resetFilters}>Reset</Button>
            </div>
          </Col>
        </Row>
      </Form>

      <Table
        dataSource={data}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 8 }}
      />

      <CreateNewClient 
        isVisible={isModalVisible}
        onClose={handleModalClose}
        onClientCreated={handleNewClientCreated}
      />
    </div>
  );
};

export default ClientsPage;