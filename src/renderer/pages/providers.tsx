import React from 'react';
import { Button, Table, Space } from 'antd';
import { EditOutlined, DeleteOutlined, CommentOutlined, EyeOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

interface Provider {
  id: string;
  companyName: string;
  providerName: string;
  type: string;
  country: string;
  province: string;
}

const ProvidersPage: React.FC = () => {
  const columns: ColumnsType<Provider> = [
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
      title: 'Provider Name',
      dataIndex: 'providerName',
      key: 'providerName',
    },
    {
      title: 'Type of Provider',
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
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record.id)} />
          <Button icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} />
          <Button icon={<CommentOutlined />} onClick={() => handleComment(record.id)} />
          <Button icon={<EyeOutlined />} onClick={() => handleView(record.id)} />
        </Space>
      ),
    },
  ];

  const data: Provider[] = Array.from({ length: 30 }, (_, i) => ({
    id: (i + 1).toString(),
    companyName: `Provider Co. ${i + 1}`,
    providerName: `Provider Name ${i + 1}`,
    type: i % 2 === 0 ? 'Wholesale' : 'Retail',
    country: i % 2 === 0 ? 'USA' : 'Canada',
    province: i % 3 === 0 ? 'California' : i % 3 === 1 ? 'Ontario' : 'New York',
  }));

  const handleEdit = (id: string) => {
    console.log('Edit provider with id:', id);
  };

  const handleDelete = (id: string) => {
    console.log('Delete provider with id:', id);
  };

  const handleComment = (id: string) => {
    console.log('Comment on provider with id:', id);
  };

  const handleView = (id: string) => {
    console.log('View provider with id:', id);
  };

  return (
    <div>
      <h1 style={{ marginBottom: '16px' }}>Providers Management</h1>
      <div style={{ marginBottom: '24px' }}>
        <Space>
          <Button type="primary">New Provider</Button>
          <Button>Modify/Delete</Button>
          <Button>Comment</Button>
          <Button>View</Button>
        </Space>
      </div>
      <Table<Provider>
        columns={columns}
        dataSource={data}
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default ProvidersPage;
