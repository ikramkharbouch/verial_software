import React, { useEffect, useState } from 'react';
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

  const [data, setData] = useState<Article[]>([]); // State for storing articles

  const handleSalesModalOpen = () => {
    setIsSalesModalVisible(true);
  };

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch('http://localhost:3000/articles');
        const articles = await response.json();

        console.log(articles);
        setData(articles || []);
      } catch (error) {
        console.error('Error fetching articles:', error);
      }
    };

    fetchArticles();
  }, []);

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
      dataIndex: 'productname',
      key: 'productName',
    },
    {
      title: 'Provider',
      dataIndex: 'provider_id',
      key: 'provider',
    },
    {
      title: 'Dimensions',
      dataIndex: 'dimensions',
      key: 'dimensions',
    },
    {
      title: 'Total Price',
      dataIndex: 'totalprice',
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

  return (
    <div>
      <h1 style={{ marginBottom: '20px' }}>Articles Management</h1>
      <Space style={{ marginBottom: '20px' }}>
        <Button type="primary">New</Button>
        <Button onClick={handleSalesModalOpen}>Sales</Button>
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
