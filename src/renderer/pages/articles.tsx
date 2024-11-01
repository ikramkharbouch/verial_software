import React, { useState } from 'react';
import {
  Button,
  Table,
  Space,
  Modal,
  Card,
  Input,
  DatePicker,
  Select,
} from 'antd';
import type { DatePickerProps } from 'antd/es/date-picker';
import SalesOverview from '@renderer/components/articles/salesModal';

const { RangePicker } = DatePicker;
const { Option } = Select;

interface Article {
  id: string;
  productName: string;
  provider: string;
  dimensions: string;
  totalPrice: string;
}

const ArticlesPage: React.FC = () => {
  const [isSalesModalVisible, setIsSalesModalVisible] =
    useState<boolean>(false);

  const handleSalesModalOpen = () => {
    setIsSalesModalVisible(true);
  };

  const handleSalesModalClose = () => {
    setIsSalesModalVisible(false);
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Product Name',
      dataIndex: 'productName',
      key: 'productName',
    },
    {
      title: 'Provider',
      dataIndex: 'provider',
      key: 'provider',
    },
    {
      title: 'Dimensions',
      dataIndex: 'dimensions',
      key: 'dimensions',
    },
    {
      title: 'Total Price',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Article) => (
        <Space size="middle">
          <Button>Edit</Button>
          <Button>Delete</Button>
          <Button>Comment</Button>
          <Button>Expand</Button>
        </Space>
      ),
    },
  ];

  const data: Article[] = [
    {
      id: '1',
      productName: 'Product 1',
      provider: 'Provider A',
      dimensions: '10x10',
      totalPrice: '$100',
    },
    {
      id: '2',
      productName: 'Product 2',
      provider: 'Provider B',
      dimensions: '20x20',
      totalPrice: '$200',
    },
    {
      id: '3',
      productName: 'Product 3',
      provider: 'Provider C',
      dimensions: '30x30',
      totalPrice: '$300',
    },
    {
      id: '4',
      productName: 'Product 4',
      provider: 'Provider D',
      dimensions: '40x40',
      totalPrice: '$400',
    },
    {
      id: '5',
      productName: 'Product 5',
      provider: 'Provider E',
      dimensions: '50x50',
      totalPrice: '$500',
    },
    {
      id: '6',
      productName: 'Product 6',
      provider: 'Provider A',
      dimensions: '60x60',
      totalPrice: '$600',
    },
    {
      id: '7',
      productName: 'Product 7',
      provider: 'Provider B',
      dimensions: '70x70',
      totalPrice: '$700',
    },
    {
      id: '8',
      productName: 'Product 8',
      provider: 'Provider C',
      dimensions: '80x80',
      totalPrice: '$800',
    },
    {
      id: '9',
      productName: 'Product 9',
      provider: 'Provider D',
      dimensions: '90x90',
      totalPrice: '$900',
    },
    {
      id: '10',
      productName: 'Product 10',
      provider: 'Provider E',
      dimensions: '100x100',
      totalPrice: '$1000',
    },
  ];

  return (
    <div>
      <h1 style={{ marginBottom: '20px' }}>Articles Management</h1>
      <Space style={{ marginBottom: '20px' }}>
        <Button type="primary">New</Button>
        <Button>Modify/Delete</Button>
        <Button>Comment</Button>
        <Button onClick={handleSalesModalOpen}>Sales</Button>
        <Button>View Operations</Button>
      </Space>
      <Table dataSource={data} columns={columns} pagination={{ pageSize: 7 }} />

      <Modal
        visible={isSalesModalVisible}
        footer={null}
        onCancel={handleSalesModalClose}
        width="90%" // Set the modal width as per your design
        style={{ top: 20 }}
      >
        <SalesOverview onClose={handleSalesModalClose} />
      </Modal>
    </div>
  );
};

export default ArticlesPage;
