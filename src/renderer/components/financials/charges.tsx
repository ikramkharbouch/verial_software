import React, { useState, useEffect } from 'react';
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
} from 'antd';
import { ColumnsType } from 'antd/es/table';
import axios from 'axios';
import dayjs from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../store/store';
import {
  fetchCharges,
  addCharge,
  updateCharge,
  deleteCharge,
} from '../../../store/slices/financialsSlice';

const { Option } = Select;

interface Charge {
  id: number;
  chargeType: string;
  providerClient: string;
  invoiceNumber: string;
  paymentMethod: string;
  chargeDate: string;
  amount: number;
  description: string;
}

const ChargesPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { charges, loading } = useSelector(
    (state: RootState) => state.financials,
  );

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCharge, setEditingCharge] = useState<Charge | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(fetchCharges());
    console.log(charges);
  }, [dispatch]);

  // useEffect(() => {
  //   console.log(charges);
  // }, [charges])

  // Handle Add/Edit Modal
  const openModal = (charge?: Charge) => {
    setEditingCharge(charge || null);
    if (charge) {
      form.setFieldsValue({
        ...charge,
        chargeDate: dayjs(charge.chargeDate),
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

  // Add/Edit modal logic
  const handleFormSubmit = async (values: any) => {
    if (editingCharge) {
      await dispatch(updateCharge({ ...editingCharge, ...values })).unwrap();
      message.success('Charge updated successfully.');
    } else {
      await dispatch(addCharge(values)).unwrap();
      message.success('Charge added successfully.');
    }
    setIsModalVisible(false);
    setEditingCharge(null);
  };

  // Handle delete
  const handleDelete = async (id: number) => {
    await dispatch(deleteCharge(id)).unwrap();
    message.success('Charge deleted successfully.');
  };

  // Table columns
  const columns: ColumnsType<Charge> = [
    {
      title: 'Charge Type',
      dataIndex: 'charge_type',
      key: 'chargeType',
    },
    {
      title: 'Provider Client',
      dataIndex: 'provider_client',
      key: 'providerClient',
    },
    {
      title: 'Invoice Number',
      dataIndex: 'invoice_number',
      key: 'invoiceNumber',
    },
    {
      title: 'Payment Method',
      dataIndex: 'payment_method',
      key: 'paymentMethod',
    },
    {
      title: 'Charge Date',
      dataIndex: 'chargeDate',
      key: 'chargeDate',
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
        <>
          <Button type="link" onClick={() => openModal(record)}>
            Edit
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record.id)}>
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={() => openModal()}>
          Add Charge
        </Button>
      </div>

      <Table<Charge>
        dataSource={charges}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 5 }}
      />

      {/* Add/Edit Charge Modal */}
      <Modal
        title={editingCharge ? 'Edit Charge' : 'Add Charge'}
        visible={isModalVisible}
        onCancel={closeModal}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
          <Form.Item
            name="chargeType"
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
            name="providerClient"
            label="Provider/Client"
            rules={[
              { required: true, message: 'Please enter provider or client' },
            ]}
          >
            <Input placeholder="Enter provider or client" />
          </Form.Item>
          <Form.Item
            name="invoiceNumber"
            label="Invoice Number"
            rules={[{ required: true, message: 'Please enter invoice number' }]}
          >
            <Input placeholder="Enter invoice number" />
          </Form.Item>
          <Form.Item
            name="paymentMethod"
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
            name="chargeDate"
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
