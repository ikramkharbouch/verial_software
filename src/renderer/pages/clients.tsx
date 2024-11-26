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
  Modal,
  message,
  Descriptions,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  EditOutlined,
  DeleteOutlined,
  SettingOutlined,
  CommentOutlined,
} from '@ant-design/icons';
import CreateNewClient from '@renderer/components/clients/createNew';
import ModifyDeleteUser from '@renderer/components/clients/modifyDelete';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch, store } from '../../store/store';
import {
  getClients,
  createClient,
  removeClient,
} from '../../store/slices/clientsSlice';
import '../styles/clients.css';
import axios from 'axios';

interface Client {
  id: number;
  companyName: string;
  clientName: string;
  clientType: string;
  country: string;
  province: string;
}

const { Option } = Select;

const ClientsPage: React.FC = () => {
  // Access the clients state from the Redux store
  const { clients, status, error } = useSelector(
    (state: RootState) => state.clients,
  );

  const [data, setData] = useState<any>(clients);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState<React.FC>();
  const [action, setAction] = useState<string>('');
  const [form] = Form.useForm();
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState(null); // Track the client to be deleted
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const dispatch = useDispatch<AppDispatch>();

  // Dispatch getClients when the component mounts
  useEffect(() => {
    if (status === 'idle') {
      dispatch(getClients());
    }
  }, [dispatch, status]);

  const showModal = (action: any) => {
    setModalContent(action);
    setIsModalVisible(true);
    setAction('action');
    console.log(action);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = (reset: () => void, formFilled: boolean = false) => {
    if (formFilled) reset();
    setIsModalVisible(false);
  };

  const handleFilter = (values: Partial<Client>) => {
    const filteredData = clients.filter((client) => {
      console.log('Filter parameters:', values);

      return Object.entries(values).every(([key, value]) => {
        if (!value) return true; // Skip if no filter value
        return String(client[key as keyof Client])
          .toLowerCase()
          .includes(String(value).toLowerCase());
      });
    });

    console.log(filteredData);
    setData(filteredData);
  };

  const resetFilters = () => {
    form.resetFields();
    setData(clients);
  };

  // Open modal and set selected client
  const handleViewDetails = (client: Client) => {
    setSelectedClient(client);
    setIsModalVisible(true);
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Company Name',
      dataIndex: 'company_name',
      key: 'companyName',
    },
    {
      title: 'Client Name',
      dataIndex: 'client_name',
      key: 'clientName',
    },
    {
      title: 'Type of Client',
      dataIndex: 'client_type',
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
      render: (_: any, record: Client) => (
        <Space size="middle">
          <Tooltip title="Edit">
            <Button icon={<EditOutlined />} onClick={() => showModal('Edit')} />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              icon={<DeleteOutlined />}
              onClick={() => handleDeleteClick(record.id)}
            />
          </Tooltip>
          <Tooltip title="Operations">
            <Button
              icon={<SettingOutlined />}
              onClick={() => showModal('Operations')}
            />
          </Tooltip>
          <Tooltip title="Comment">
            <Button
              icon={<CommentOutlined />}
              onClick={() => showModal('Comment')}
            />
          </Tooltip>
          <Tooltip title="View">
            <Button type="link" onClick={() => handleViewDetails(record)}>
              View Details
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ];

  // Open confirmation modal
  const handleDeleteClick = (id: any) => {
    setSelectedClientId(id);
    setIsDeleteModalVisible(true);
  };

  // Proceed with deletion
  const handleConfirmDelete = async () => {
    console.log(selectedClientId);
    if (selectedClientId !== null) {
      try {
        await dispatch(removeClient(selectedClientId)).unwrap(); // Dispatch Redux thunk
        message.success('Client deleted successfully');
        dispatch(getClients()); // Refetch the updated client list
      } catch (error) {
        message.error('Failed to delete client');
      } finally {
        setIsDeleteModalVisible(false);
        setSelectedClientId(null);
      }
    }
  };

  // Cancel deletion
  const handleCancelDelete = () => {
    setIsDeleteModalVisible(false);
    setSelectedClientId(null);
  };

  // Close modal
  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedClient(null);
  };

  useEffect(() => {
    console.log(clients);
    setData(clients);
  }, [clients]); // ✅ Always call the hook; conditionally execute inside.

  return (
    <div>
      <h1>Client Management</h1>

      {/* Buttons placed between title and table */}
      <div className="clients-actions">
        <Button
          type="primary"
          style={{ marginRight: '10px' }}
          onClick={() =>
            showModal(<CreateNewClient handleCancel={handleCancel} />)
          }
        >
          New
        </Button>
        <Button
          style={{ marginRight: '10px' }}
          onClick={() => showModal(<ModifyDeleteUser users={[]} />)}
        >
          Modify/Delete
        </Button>
        <Button
          style={{ marginRight: '10px' }}
          onClick={() => showModal('Comment')}
        >
          Comment
        </Button>
        <Button onClick={() => showModal('View')}>View</Button>
      </div>

      {/* Filter Form */}
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFilter}
        style={{ marginBottom: 16 }}
      >
        <Row gutter={16}>
          <Col span={4}>
            <Form.Item name="company_name" label="Company Name">
              <Input placeholder="Enter company name" />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item name="client_name" label="Client Name">
              <Input placeholder="Enter client name" />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item name="client_type" label="Type of Client">
              <Select placeholder="Select client type" allowClear>
                <Option value="Individual">Individual</Option>
                <Option value="Corporate">Corporate</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item name="country" label="Country">
              <Input placeholder="Enter country" />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item name="province" label="Province">
              <Input placeholder="Enter province" />
            </Form.Item>
          </Col>
          <div className="filter-btns">
            <Button type="primary" htmlType="submit">
              Filter
            </Button>
            <Button onClick={resetFilters}>Reset</Button>
          </div>
        </Row>
      </Form>

      {/* Ant Design Table with Pagination */}
      <div className="ant-table-wrapper">
        <Table
          dataSource={data}
          columns={columns}
          rowKey="id"
          scroll={{ x: 'max-content' }}
          pagination={{ pageSize: 8 }} // Set the number of rows per page
        />
      </div>
      <Modal
        title={modalContent as any}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel as any}
      >
        {action == 'New' && <p>Make new client</p>}
        {action == 'Modify/Delete' && <p>Modify/Delete client</p>}
        {action == 'Comment' && <p>Comment client</p>}
        {action == 'Edit' && <p>Edit client</p>}
        {action == 'Delete' && <p>Delete client</p>}
        {action == 'Operations' && <p>See client's Operations</p>}
        {action == 'View' && <p>Comment client</p>}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        title="Confirm Delete"
        visible={isDeleteModalVisible}
        onOk={handleConfirmDelete}
        onCancel={handleCancelDelete}
        okText="Yes, Delete"
        cancelText="Cancel"
      >
        <p>Are you sure you want to delete this client?</p>
      </Modal>

      <Modal
        title="Client Details"
        visible={isModalVisible}
        onCancel={handleCloseModal}
        footer={[
          <Button key="close" onClick={handleCloseModal}>
            Close
          </Button>,
        ]}
      >
        {selectedClient && (
          <div style={{ padding: '10px', lineHeight: '1.8' }}>
            <p>
              <strong>Name:</strong> {selectedClient.id}
            </p>
            <p>
              <strong>Company:</strong> {selectedClient.companyName}
            </p>
            <p>
              <strong>Email:</strong> {selectedClient.clientType}
            </p>
            <p>
              <strong>Phone:</strong> {selectedClient.country}
            </p>
            <p>
              <strong>Address:</strong> {selectedClient.province}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ClientsPage;
