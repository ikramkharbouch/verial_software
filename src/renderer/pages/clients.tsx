import React, { useState } from 'react';
import { Table, Button, Space, Tooltip, Modal } from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  SettingOutlined,
  CommentOutlined,
} from '@ant-design/icons';
import CreateNewClient from '@renderer/components/clients/createNew';

interface Client {
  id: number;
  companyName: string;
  clientName: string;
  clientType: string;
  country: string;
  province: string;
}

// Generating more sample data for pagination
const clientsData: Client[] = Array.from({ length: 30 }, (_, index) => ({
  id: index + 1,
  companyName: `Company ${index + 1}`,
  clientName: `Client ${index + 1}`,
  clientType: index % 2 === 0 ? 'Corporate' : 'Individual',
  country: index % 3 === 0 ? 'USA' : 'Canada',
  province: index % 3 === 0 ? 'California' : 'Ontario',
}));

const ClientsPage: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState<React.FC>();
  const [action, setAction] = useState<string>('');

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
      render: (_: any, record: Client) => (
        <Space size="middle">
          <Tooltip title="Edit">
            <Button icon={<EditOutlined />} onClick={() => showModal('Edit')} />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              icon={<DeleteOutlined />}
              onClick={() => showModal('Delete')}
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
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h1>Client Management</h1>

      {/* Buttons placed between title and table */}
      <div className="clients-actions">
        <Button
          type="primary"
          style={{ marginRight: '10px' }}
          onClick={() => showModal(<CreateNewClient handleCancel={handleCancel} />)}
        >
          New
        </Button>
        <Button
          style={{ marginRight: '10px' }}
          onClick={() => showModal('Modify/Delete')}
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

      {/* Ant Design Table with Pagination */}
      <div className="ant-table-wrapper">
        <Table
          dataSource={clientsData}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 8 }} // Set the number of rows per page
        />
      </div>
      <Modal
        title={modalContent}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel as any}
      >
        {action == 'New' && <p>Make new client</p>}
        {action == 'Modify/Delete' && <p>Modify/Delete client</p>}
        {action == 'Comment' && <p>Comment client</p>}
        {action == 'View' && <p>View client</p>}
        {action == 'Edit' && <p>Edit client</p>}
        {action == 'Delete' && <p>Delete client</p>}
        {action == 'Operations' && <p>See client's Operations</p>}
        {action == 'View' && <p>Comment client</p>}
      </Modal>
    </div>
  );
};

export default ClientsPage;
