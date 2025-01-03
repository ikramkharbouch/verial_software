import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Space,
  message,
  Col,
  Row,
} from 'antd';
import {
  getPayments,
  addPayment,
  updatePayment,
  deletePayment,
} from '../../../api/financialsService'; // API calls
import type { Payment } from '../../types/types'; // Type for payments
import moment from 'moment';

const { RangePicker } = DatePicker;
const { Option } = Select;

const PaymentsPage: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);
  const [searchText, setSearchText] = useState('');
  const [methodFilter, setMethodFilter] = useState<string | undefined>();
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [amountFilter, setAmountFilter] = useState<string | undefined>();
  const [dateRange, setDateRange] = useState<
    [moment.Moment, moment.Moment] | null
  >(null);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);

  const [form] = Form.useForm();

  // Fetch payments on page load
  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const data = await getPayments();
      setPayments(data);
      setFilteredPayments(data); // Initialize filtered payments
    } catch (error) {
      message.error('Failed to load payments');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingPayment(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (payment: Payment) => {
    setEditingPayment(payment);
    form.setFieldsValue({
      ...payment,
      date: moment(payment.date), // Convert date to a Moment object
    });
    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deletePayment(id);
      message.success('Payment deleted successfully');
      fetchPayments();
    } catch {
      message.error('Failed to delete payment');
    }
  };

  const handleFormSubmit = async (values: any) => {
    try {
      if (editingPayment) {
        await updatePayment(editingPayment.id, values);
        message.success('Payment updated successfully');
      } else {
        await addPayment(values);
        message.success('Payment added successfully');
      }
      fetchPayments();
      setModalVisible(false);
    } catch {
      message.error('Failed to save payment');
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Payer',
      dataIndex: 'payer',
      key: 'payer',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (value: number) => `$${value}`,
    },
    {
      title: 'Method',
      dataIndex: 'method',
      key: 'method',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Payment) => (
        <Space>
          <Button onClick={() => handleEdit(record)}>Edit</Button>
          <Button danger onClick={() => handleDelete(record.id)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const applyFilters = () => {
    let filtered = [...payments];

    // General search across multiple fields
    if (searchText) {
      filtered = filtered.filter((payment) =>
        [
          payment.payer.toLowerCase(),
          payment.status.toLowerCase(),
          payment.method.toLowerCase(),
          payment.amount.toString(),
          moment(payment.date).format('YYYY-MM-DD'),
        ].some((field) => field.includes(searchText.toLowerCase())),
      );
    }

    // Filter by payment method
    if (methodFilter) {
      filtered = filtered.filter((payment) => payment.method === methodFilter);
    }

    // Filter by status
    if (statusFilter) {
      filtered = filtered.filter((payment) => payment.status === statusFilter);
    }

    // Filter by amount
    if (amountFilter) {
      filtered = filtered.filter(
        (payment) => payment.amount.toString() === amountFilter,
      );
    }

    // Filter by date range
    if (dateRange) {
      const [start, end] = dateRange;
      filtered = filtered.filter((payment) =>
        moment(payment.date).isBetween(start, end, 'day', '[]'),
      );
    }

    setFilteredPayments(filtered);
    message.success('Filters applied.');
  };

  const resetFilters = () => {
    setSearchText('');
    setMethodFilter(undefined);
    setStatusFilter(undefined);
    setAmountFilter(undefined);
    setDateRange(null);
    setFilteredPayments(payments); // Reset to original dataset
    message.success('Filters reset.');
  };

  return (
    <div>
      <h1 style={{ marginBottom: '1rem' }}>Payments Management</h1>
      <Button type="primary" onClick={handleAdd}>
        Add Payment
      </Button>
      <Row
        gutter={[16, 16]}
        style={{ marginBottom: '1rem', marginTop: '1rem' }}
      >
        <Col xs={24} sm={12} md={6}>
          <Input
            placeholder="Search (payer, status, method, amount, date)"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Select
            placeholder="Select Payment Method"
            value={methodFilter}
            onChange={(value) => setMethodFilter(value)}
            allowClear
            style={{ width: '100%' }}
          >
            <Option value="Cash">Cash</Option>
            <Option value="Credit Card">Credit Card</Option>
            <Option value="Bank Transfer">Bank Transfer</Option>
          </Select>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Select
            placeholder="Select Status"
            value={statusFilter}
            onChange={(value) => setStatusFilter(value)}
            allowClear
            style={{ width: '100%' }}
          >
            <Option value="Paid">Paid</Option>
            <Option value="Pending">Pending</Option>
          </Select>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Input
            placeholder="Filter by Amount"
            value={amountFilter}
            onChange={(e) => setAmountFilter(e.target.value)}
            allowClear
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <RangePicker
            value={dateRange as any}
            onChange={(dates) =>
              setDateRange(dates as [moment.Moment, moment.Moment])
            }
            style={{ width: '100%' }}
          />
        </Col>
        <Col xs={12} sm={6}>
          <Button
            type="primary"
            onClick={applyFilters}
            style={{ width: '100%' }}
          >
            Apply Filters
          </Button>
        </Col>
        <Col xs={12} sm={6}>
          <Button onClick={resetFilters} style={{ width: '100%' }}>
            Reset Filters
          </Button>
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={filteredPayments}
        loading={loading}
        rowKey={(record) => record.id}
        pagination={{ pageSize: 7 }}
        style={{ marginTop: 20 }}
        // scroll={{ y: 'max-content' }}
      />
      <Modal
        title={editingPayment ? 'Edit Payment' : 'Add Payment'}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFormSubmit}
          initialValues={{ status: 'Paid' }}
        >
          <Form.Item name="payer" label="Payer" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="amount" label="Amount" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="method"
            label="Payment Method"
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="Cash">Cash</Option>
              <Option value="Credit Card">Credit Card</Option>
              <Option value="Bank Transfer">Bank Transfer</Option>
            </Select>
          </Form.Item>
          <Form.Item name="date" label="Date" rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="status" label="Status">
            <Select>
              <Option value="Paid">Paid</Option>
              <Option value="Pending">Pending</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PaymentsPage;
