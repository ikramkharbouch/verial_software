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
    const formattedValues = {
      clientName: values.clientName,
      invoiceType: values.invoiceType,
      date: dayjs(values.date).format('YYYY-MM-DD'),
      items: values.items.map((item: any) => ({
        name: item.name,
        units: item.units,
        unitPrice: item.unitPrice,
        totalPrice: item.units * item.unitPrice, // Calculate item total
      })),
      comment: values.comment,
      grandTotal: values.items.reduce(
        (sum: number, item: any) => sum + item.units * item.unitPrice,
        0
      ), // Calculate grand total
    };
  
    console.log(formattedValues);
  
    try {
      const response = await fetch(
        'http://localhost:3000/clients/client-documents/create',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formattedValues),
        }
      );
  
      if (response.ok) {
        form.resetFields(); // Reset the form after success
        onCancel(); // Close the modal
      } else {
        console.error('Failed to create invoice');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  

  const onValuesChange = (changedValues: any) => {
    if (changedValues.invoiceType) {
      const options =
        changedValues.invoiceType === 'Car Repair'
          ? carRepairServices
          : articles;
      setCurrentOptions(options);
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
        <Form.List name="items">
  {(fields, { add, remove }) => (
    <>
      {fields.map(({ key, name, fieldKey, ...restField }) => (
        <Space key={key} align="baseline" style={{ display: 'flex', marginBottom: 8 }}>
          <Form.Item
            {...restField}
            name={[name, 'name']}
            fieldKey={[fieldKey as any, 'name']}
            rules={[{ required: true, message: 'Please select an item' }]}
          >
            <Select placeholder="Select Item" style={{ width: 200 }}>
              {currentOptions.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            {...restField}
            name={[name, 'units']}
            fieldKey={[fieldKey as any, 'units']}
            rules={[{ required: true, message: 'Enter units' }]}
          >
            <InputNumber min={1} placeholder="Units" />
          </Form.Item>

          <Form.Item
            {...restField}
            name={[name, 'unitPrice']}
            fieldKey={[fieldKey as any, 'unitPrice']}
            rules={[{ required: true, message: 'Enter unit price' }]}
          >
            <InputNumber min={0} placeholder="Unit Price" />
          </Form.Item>

          <Button type="link" onClick={() => remove(name)}>
            Remove
          </Button>
        </Space>
      ))}
      <Form.Item>
        <Button type="dashed" onClick={() => add()} block>
          Add Item
        </Button>
      </Form.Item>
    </>
  )}
</Form.List>

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
