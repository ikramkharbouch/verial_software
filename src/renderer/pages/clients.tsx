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
  const [editingClient, setEditingClient] = useState<any | null>(null);
  const [selectedClient, setSelectedClient] = useState(null);

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
    setSelectedClient(null);
  };

  const handleNewClientCreated = () => {
    dispatch(getClients());
  };

  const handleFilter = (values: Partial<any>) => {
    const normalizedKeys = {
      companyName: 'company_name',
      clientName: 'client_name',
      clientType: 'client_type',
      country: 'country',
      province: 'province',
      industry: 'industry',
      source: 'source',
    };
  
    const filteredData = clients.filter((client) => {
      return Object.entries(values).every(([formKey, formValue]) => {
        if (!formValue) return true; // Skip empty fields
  
        const dataKey = normalizedKeys[formKey as keyof typeof normalizedKeys];
        const dataValue = String(client[dataKey as keyof typeof client]);
  
        return dataValue.toLowerCase().includes(String(formValue).toLowerCase());
      });
    });
  
    setData(filteredData);
  };
  

  const resetFilters = () => {
    form.resetFields();
    setData(clients);
  };

  const handleEdit = (client: any) => {
    setEditingClient(client); // Set the client to be edited
    setIsModalVisible(true); // Show the modal
  };


  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:3000/clients/${id}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        message.success('Client deleted successfully.');
        // Remove the deleted client from the state
        setData((prevData) => prevData.filter((client) => client.id !== String(id)));
        // Optionally update the Redux store
        dispatch(getClients());
      } else {
        message.error('Failed to delete client.');
      }
    } catch (error) {
      console.error('Error deleting client:', error);
      message.error('An error occurred while deleting the client.');
    }
  };
  
  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Company Name', dataIndex: 'company_name', key: 'companyName' },
    { title: 'Client Name', dataIndex: 'client_name', key: 'clientName' },
    { title: 'Type of Client', dataIndex: 'client_type', key: 'clientType' },
    { title: 'Country', dataIndex: 'country', key: 'country' },
    { title: 'Province', dataIndex: 'province', key: 'province' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space size="middle">
          <Tooltip title="Edit">
          <Button
  icon={<EditOutlined />}
  onClick={() => {
    setSelectedClient(record);
    setIsModalVisible(true);
  }}
/>
          </Tooltip>
          <Tooltip title="Delete">
          <Button
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
            danger
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
        <Button
          type="primary"
          onClick={showModal}
          className="custom-primary-button"
        >
          Create New Client
        </Button>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleFilter}
        className="clients-form"
        style={{ marginBottom: '16px' }}
      >
        <Row gutter={[16, 24]}>
          <Col span={6}>
            <Form.Item name="companyName">
              <Input placeholder="Company Name" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="clientName">
              <Input placeholder="Client Name" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="clientType">
              <Select placeholder="Type of Client" allowClear>
                <Option value="Individual">Individual</Option>
                <Option value="Corporate">Corporate</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="country">
              <Select placeholder="Country" allowClear>
                <Option value="USA">USA</Option>
                <Option value="Canada">Canada</Option>
                <Option value="UK">UK</Option>
                <Option value="Australia">Australia</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 24]} style={{ marginTop: '1rem' }}>
          <Col span={6}>
            <Form.Item name="province">
              <Input placeholder="Province/State" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="industry">
              <Select placeholder="Industry" allowClear>
                <Option value="Technology">Technology</Option>
                <Option value="Finance">Finance</Option>
                <Option value="Healthcare">Healthcare</Option>
                <Option value="Retail">Retail</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="source">
              <Select placeholder="Source" allowClear>
                <Option value="Referral">Referral</Option>
                <Option value="Advertisement">Advertisement</Option>
                <Option value="Website">Website</Option>
                <Option value="Event">Event</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={6} className='filter-buttons-container'>
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit" className='submit-btn'>
                  Filter
                </Button>
                <Button onClick={resetFilters}>Reset</Button>
              </Space>
            </Form.Item>
          </Col>
        </Row>
      </Form>

      <Table
        dataSource={data}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 7 }}
      />

<CreateNewClient
  isVisible={isModalVisible}
  onClose={handleModalClose}
  onClientCreated={handleNewClientCreated}
  editingClient={selectedClient}
/>


    </div>
  );
};

export default ClientsPage;
