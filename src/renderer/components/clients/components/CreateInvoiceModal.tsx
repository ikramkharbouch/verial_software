import React, { useState } from 'react';
import {
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
  Button,
  Space,
} from 'antd';
import dayjs from 'dayjs';
import { articles, carRepairServices } from '@renderer/constants/constantData';

const { Option } = Select;

const CreateInvoiceModal = ({ propData, visible, onCancel }: any) => {
  const [isCreateInvoiceModalVisible, setIsCreateInvoiceModalVisible] =
    useState(false);

  const [form] = Form.useForm();

  const [data, setData] = useState<Document[]>(propData);
  const [currentOptions, setCurrentOptions] = useState<
    { label: string; value: string }[]
  >([]);

  const handleCreateInvoice = async (values: any) => {
    console.log(values);
    const formattedValues = {
      clientName: values.clientName,
      invoiceType: values.invoiceType,
      items: values.items.map((item: string) => ({ name: item })), // Assuming items is an array of strings
      date: dayjs(values.date).format('YYYY-MM-DD'),
      numberOfUnits: values.units,
      price: values.price,
      comment: values.comment,
      totalPrice: values.price * values.units, // Calculate total price
    };

    try {
      const response = await fetch(
        'http://localhost:3000/clients/client-documents/create',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formattedValues),
        },
      );

      if (response.ok) {
        const newInvoice = await response.json();
        setData((prev) => [...prev, newInvoice]); // Update table data
        onCancel();
        form.resetFields(); // Reset the form
      } else {
        const error = await response.json();
        console.error('Failed to create invoice:', error);
      }
    } catch (err) {
      console.error('Error while creating invoice:', err);
    }
  };

  const onValuesChange = (changedValues: any) => {
    if (changedValues.invoiceType) {
      const options =
        changedValues.invoiceType === 'Car Repair'
          ? carRepairServices
          : articles;
      setCurrentOptions(options);
      form.setFieldsValue({ items: [] }); // Reset items field
    }
  };

  return (
    <Modal
      title="Create New Invoice"
      open={visible}
      onCancel={() => onCancel(false)}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleCreateInvoice} // This should point to your function
        onValuesChange={onValuesChange}
        className="create-edit-invoice"
      >
        {' '}
        <Form.Item
          name="clientName"
          rules={[{ required: true, message: 'Client Name is required' }]}
        >
          <Input placeholder="Client Name" />
        </Form.Item>
        <Form.Item
          name="invoiceType"
          rules={[{ required: true, message: 'Please select an invoice type' }]}
        >
          <Select placeholder="Select Invoice Type">
            <Option value="Car Repair">Car Repair</Option>
            <Option value="Article Purchase">Article Purchase</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="items"
          rules={[
            { required: true, message: 'Please select at least one item' },
          ]}
        >
          <Select
            mode="multiple"
            placeholder="Select Items"
            options={currentOptions} // Options change based on `invoiceType`
          />
        </Form.Item>
        <Form.Item
          name="date"
          initialValue={dayjs()} // Default to today's date
          rules={[{ required: true, message: 'Date is required' }]}
        >
          <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          name="units"
          rules={[
            { required: true, message: 'Units are required' },
            {
              type: 'number',
              min: 1,
              message: 'Units must be a positive integer',
            },
          ]}
        >
          <InputNumber min={1} placeholder="Units" style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          name="price"
          rules={[
            { required: true, message: 'Price is required' },
            {
              type: 'number',
              min: 0,
              message: 'Price must be a positive value',
            },
          ]}
        >
          <InputNumber
            min={0}
            prefix="€"
            placeholder="Price per Unit"
            style={{ width: '100%' }}
          />
        </Form.Item>
        <Form.Item name="comment">
          <Input.TextArea placeholder="Add Comment (optional)" />
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              Create Invoice
            </Button>
            <Button onClick={() => form.resetFields()}>Reset</Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateInvoiceModal;
