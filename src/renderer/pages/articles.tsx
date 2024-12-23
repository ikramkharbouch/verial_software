import React, { useEffect, useState } from 'react';
import {
  Button,
  Table,
  Space,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  InputNumber,
  notification,
  Row,
  Col,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import '../styles/root.css';

const { Option } = Select;

interface Article {
  id: string;
  name: string;
  brand: string;
  dimensions: string;
  description: string;
  purchase_price: number;
  sale_price: number;
  stock_level: number;
  low_stock: number;
  used: number;
  last_sold: string;
}

const ArticlesPage: React.FC = () => {
  const [data, setData] = useState<Article[]>([]);
  const [filteredData, setFilteredData] = useState<Article[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const fetchArticles = async () => {
    try {
      const response = await fetch('http://localhost:3000/articles');
      const articles = await response.json();
      console.log(articles);
      setData(articles || []);
      setFilteredData(articles || []);
    } catch (error) {
      console.error('Error fetching articles:', error);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleCreateArticle = async (values: Omit<Article, 'id'>) => {
    try {
      const response = await fetch('http://localhost:3000/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        notification.success({
          message: 'Article Created',
          description: 'The article has been added successfully.',
        });
        setIsModalVisible(false);
        fetchArticles();
      } else {
        const error = await response.json();
        notification.error({
          message: 'Error Creating Article',
          description: error.message || 'An error occurred.',
        });
      }
    } catch (error) {
      console.error('Error creating article:', error);
      notification.error({
        message: 'Error Creating Article',
        description: 'An error occurred. Please try again.',
      });
    }
  };

  const handleFilter = (values: Partial<Article>) => {
    const filtered = data.filter((article) => {
      return Object.entries(values).every(([key, value]) => {
        if (!value) return true; // Skip empty filters
        if (key === 'productname' && value) {
          return article.name
            ?.toLowerCase()
            .includes((value as string).toLowerCase());
        }
        if (key === 'dimensions' && value) {
          return article.dimensions
            ?.toLowerCase()
            .includes((value as string).toLowerCase());
        }
        if (key === 'brand' && value) {
          return article.brand
            ?.toLowerCase()
            .includes((value as string).toLowerCase());
        }
        return true;
      });
    });
    setFilteredData(filtered);
  };

  const resetFilters = () => {
    fetchArticles();
  };

  const handleView = (article: Article) => {
    setSelectedArticle(article); // Set the selected article
    setIsViewModalVisible(true); // Open the view modal
  };

  const columns: ColumnsType<Article> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Product Name',
      dataIndex: 'productname',
      key: 'name',
    },
    {
      title: 'Dimensions',
      dataIndex: 'dimensions',
      key: 'dimensions',
    },
    {
      title: 'Brand',
      dataIndex: 'brand',
      key: 'brand',
    },
    {
      title: 'Stock Level',
      dataIndex: 'stock_level',
      key: 'stock_level',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button>Edit</Button>
          <Button>Delete</Button>
          <Button onClick={() => handleView(record)}>View</Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h1 style={{ marginBottom: '20px' }}>Articles Management</h1>
      <Space style={{ marginBottom: '20px' }}>
        <Button type="primary" onClick={() => setIsModalVisible(true)}>
          New Article
        </Button>
      </Space>
      <Form
        layout="vertical"
        onFinish={handleFilter}
        style={{ marginBottom: '20px' }}
      >
        <Row gutter={[16, 16]}>
          <Col span={6}>
            <Form.Item name="name">
              <Input placeholder="Product Name" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="dimensions">
              <Input placeholder="Dimensions" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="brand">
              <Input placeholder="Brand" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit" className="submit-btn">
                  Filter
                </Button>
                <Button onClick={resetFilters}>Reset</Button>
              </Space>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Table
        dataSource={filteredData}
        columns={columns}
        pagination={{ pageSize: 7 }}
      />
      <Modal
        title="Create New Article"
        visible={isModalVisible}
        footer={null}
        onCancel={() => setIsModalVisible(false)}
        destroyOnClose
      >
        <Form
          layout="vertical"
          onFinish={handleCreateArticle}
          initialValues={{
            last_sold: dayjs(),
            used: 0,
          }}
        >
          <Form.Item
            name="name"
            label="Product Name"
            rules={[{ required: true, message: 'Product Name is required' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="dimensions"
            label="Dimensions"
            rules={[{ required: true, message: 'Dimensions are required' }]}
          >
            <Input placeholder="e.g., 205/55R16" />
          </Form.Item>
          <Form.Item
            name="brand"
            label="Brand"
            rules={[{ required: true, message: 'Brand is required' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item
            name="purchase_price"
            label="Purchase Price"
            rules={[{ required: true, message: 'Purchase Price is required' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="sale_price"
            label="Sale Price"
            rules={[{ required: true, message: 'Sale Price is required' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="stock_level"
            label="Stock Level"
            rules={[{ required: true, message: 'Stock Level is required' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="low_stock"
            label="Low Stock Threshold"
            rules={[
              { required: true, message: 'Low Stock Threshold is required' },
            ]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="used" label="Used">
            <Select>
              <Option value={0}>No</Option>
              <Option value={1}>Yes</Option>
            </Select>
          </Form.Item>
          <Form.Item name="last_sold" label="Last Sold Date">
            <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
              Create Article
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      // View Modal
      <Modal
        title="Article Details"
        visible={isViewModalVisible}
        footer={null}
        onCancel={() => setIsViewModalVisible(false)}
      >
        {selectedArticle ? (
          <div>
            <p>
              <strong>ID:</strong> {selectedArticle.id}
            </p>
            <p>
              <strong>Product Name:</strong> {selectedArticle.name}
            </p>
            <p>
              <strong>Dimensions:</strong> {selectedArticle.dimensions}
            </p>
            <p>
              <strong>Brand:</strong> {selectedArticle.brand}
            </p>
            <p>
              <strong>Stock Level:</strong> {selectedArticle.stock_level}
            </p>
            <p>
              <strong>Description:</strong>{' '}
              {selectedArticle.description || 'N/A'}
            </p>
            <p>
              <strong>Purchase Price:</strong> {selectedArticle.purchase_price}
            </p>
            <p>
              <strong>Sale Price:</strong> {selectedArticle.sale_price}
            </p>
            <p>
              <strong>Low Stock Threshold:</strong> {selectedArticle.low_stock}
            </p>
            <p>
              <strong>Used:</strong> {selectedArticle.used ? 'Yes' : 'No'}
            </p>
            <p>
              <strong>Last Sold:</strong> {selectedArticle.last_sold}
            </p>
          </div>
        ) : (
          <p>No details available</p>
        )}
      </Modal>
    </div>
  );
};

export default ArticlesPage;
