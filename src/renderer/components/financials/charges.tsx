import React, { useState, useEffect, useMemo } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
  message,
  Row,
  Col,
  Space,
} from 'antd';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../store/store';
import {
  fetchCharges,
  addCharge,
  updateCharge,
  deleteCharge,
} from '../../../store/slices/financialsSlice';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker;
const { Option } = Select;

dayjs.extend(isBetween); // Enable isBetween plugin

interface Charge {
  id: number;
  charge_type: string; // Fixed to match snake_case
  provider_client: string; // Fixed to match snake_case
  invoice_number: string; // Fixed to match snake_case
  payment_method: string; // Fixed to match snake_case
  charge_date: string; // Fixed to match snake_case
  amount: number;
  description: string;
}

const ChargesPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { charges, loading } = useSelector(
    (state: RootState) => state.financials.chargesState,
  );
  const [filteredCharges, setFilteredCharges] = useState<Charge[]>([]);

  // Filter states
  const [searchText, setSearchText] = useState('');
  const [chargeType, setChargeType] = useState<string | undefined>();
  const [providerClient, setProviderClient] = useState<string | undefined>();
  const [dateRange, setDateRange] = useState<[string, string] | undefined>();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCharge, setEditingCharge] = useState<Charge | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(fetchCharges());
  }, [dispatch]);

  const memoizedCharges = useMemo(() => charges, [charges]);

  useEffect(() => {
    setFilteredCharges(memoizedCharges as any);
  }, [memoizedCharges]);

  const applyFilters = () => {
    let filtered = [...charges];

    // Search text
    if (searchText) {
      filtered = filtered.filter(
        (charge) =>
          charge.provider_client
            .toLowerCase()
            .includes(searchText.toLowerCase()) ||
          charge.invoice_number
            .toLowerCase()
            .includes(searchText.toLowerCase()) ||
          charge.description.toLowerCase().includes(searchText.toLowerCase()),
      );
    }

    // Charge type
    if (chargeType) {
      filtered = filtered.filter((charge) => charge.charge_type === chargeType);
    }

    // Provider/Client filter
    if (providerClient) {
      filtered = filtered.filter((charge) =>
        charge.provider_client
          .toLowerCase()
          .includes(providerClient.toLowerCase()),
      );
    }

    // Date range
    if (dateRange) {
      const [start, end] = dateRange;
      filtered = filtered.filter((charge) =>
        dayjs(charge.charge_date).isBetween(
          dayjs(start),
          dayjs(end),
          'day',
          '[]',
        ),
      );
    }

    setFilteredCharges(filtered);
    message.success('Filters applied.');
  };

  // Reset Filters
  const resetFilters = () => {
    setSearchText('');
    setChargeType(undefined);
    setProviderClient(undefined);
    setDateRange(undefined);
    setFilteredCharges(charges as any); // Reset to original dataset
  };

  // Add/Edit Modal Logic
  const openModal = (charge?: Charge) => {
    setEditingCharge(charge || null);
    if (charge) {
      form.setFieldsValue({
        ...charge,
        charge_date: dayjs(charge.charge_date),
      });
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setEditingCharge(null);
  };

  const handleFormSubmit = async (values: any) => {
    try {
      if (editingCharge) {
        // Structure the payload correctly
        const payload = {
          id: editingCharge.id,
          charge: {
            ...values, // Form values
          },
        };
        console.log('Dispatching updateCharge with payload:', payload);
        await dispatch(updateCharge(payload)).unwrap();
        message.success('Charge updated successfully.');
      } else {
        await dispatch(addCharge(values)).unwrap();
        message.success('Charge added successfully.');
      }
      closeModal(); // Close the modal on success
    } catch (error) {
      message.error('Failed to save charge. Please try again.');
    }
  };
  
  // Handle Delete
  const handleDelete = async (id: number) => {
    await dispatch(deleteCharge(id)).unwrap();
    message.success('Charge deleted successfully.');
  };

  // Table Columns
  const columns: ColumnsType<Charge> = [
    {
      title: 'Charge Type',
      dataIndex: 'charge_type',
      key: 'charge_type',
    },
    {
      title: 'Provider Client',
      dataIndex: 'provider_client',
      key: 'provider_client',
    },
    {
      title: 'Invoice Number',
      dataIndex: 'invoice_number',
      key: 'invoice_number',
    },
    {
      title: 'Payment Method',
      dataIndex: 'payment_method',
      key: 'payment_method',
    },
    {
      title: 'Charge Date',
      dataIndex: 'charge_date',
      key: 'charge_date',
      render: (text) => dayjs(text).format('YYYY-MM-DD'),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (text) => `${text} MAD`,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined style={{ color: 'black' }} />}
            onClick={() => openModal(record)}
          />
          <Button
            type="text"
            icon={<DeleteOutlined style={{ color: 'red' }} />}
            onClick={() => handleDelete(record.id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h1>Charges</h1>
      <Button
        type="primary"
        onClick={() => openModal()}
        style={{ marginTop: '1rem' }}
      >
        Create Charge
      </Button>

      <Row
        gutter={[16, 16]}
        style={{ marginTop: '1rem', marginBottom: '1rem' }}
      >
        <Col xs={24} sm={12} md={6}>
          <Input
            placeholder="Search by provider, invoice, or description"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Select
            placeholder="Select Charge Type"
            value={chargeType}
            onChange={(value) => setChargeType(value)}
            allowClear
            style={{ width: '100%' }}
          >
            <Option value="Purchase">Purchase</Option>
            <Option value="Operational Expense">Operational Expense</Option>
            <Option value="Miscellaneous">Miscellaneous</Option>
          </Select>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Input
            placeholder="Filter by Provider/Client"
            value={providerClient}
            onChange={(e) => setProviderClient(e.target.value)}
            allowClear
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <RangePicker
            onChange={(dates, dateStrings) =>
              setDateRange(
                dateStrings[0] && dateStrings[1] ? dateStrings : undefined,
              )
            }
            style={{ width: '100%' }}
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Button
            type="primary"
            onClick={applyFilters}
            style={{ width: '100%' }}
          >
            Apply Filters
          </Button>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Button onClick={resetFilters} style={{ width: '100%' }}>
            Reset Filters
          </Button>
        </Col>
      </Row>

      <Table
        dataSource={filteredCharges}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 5 }}
        scroll={{ x: 'max-content' }}
      />
      <Modal
        title={editingCharge ? 'Edit Charge' : 'Add Charge'}
        visible={isModalVisible}
        onCancel={closeModal}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
          <Form.Item
            name="charge_type"
            label="Charge Type"
            rules={[{ required: true, message: 'Please select a charge type' }]}
          >
            <Select placeholder="Select a charge type">
              <Option value="Purchase">Purchase</Option>
              <Option value="Operational Expense">Operational Expense</Option>
              <Option value="Miscellaneous">Miscellaneous</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="provider_client"
            label="Provider/Client"
            rules={[
              { required: true, message: 'Please enter provider or client' },
            ]}
          >
            <Input placeholder="Enter provider or client" />
          </Form.Item>
          <Form.Item
            name="invoice_number"
            label="Invoice Number"
            rules={[{ required: true, message: 'Please enter invoice number' }]}
          >
            <Input placeholder="Enter invoice number" />
          </Form.Item>
          <Form.Item
            name="payment_method"
            label="Payment Method"
            rules={[
              { required: true, message: 'Please select a payment method' },
            ]}
          >
            <Select placeholder="Select payment method">
              <Option value="Cash">Cash</Option>
              <Option value="Credit Card">Credit Card</Option>
              <Option value="Bank Transfer">Bank Transfer</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="charge_date"
            label="Charge Date"
            rules={[{ required: true, message: 'Please select a charge date' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="amount"
            label="Amount"
            rules={[{ required: true, message: 'Please enter an amount' }]}
          >
            <InputNumber style={{ width: '100%' }} placeholder="Enter amount" />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea
              placeholder="Enter description (optional)"
              rows={3}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ChargesPage;
