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
import '../../../styles/invoice.css';

const { Option } = Select;

const CreateInvoiceModal = ({
  propData,
  visible,
  onCancel,
  onDataUpdate,
}: any) => {
  const [isCreateInvoiceModalVisible, setIsCreateInvoiceModalVisible] =
    useState(false);

  const [form] = Form.useForm();

  const [data, setData] = useState<Document[]>(propData);
  const [currentOptions, setCurrentOptions] = useState<
    { label: string; value: string }[]
  >([]);

  const handleCreateInvoice = async (values: any) => {
    console.log('values', values);
    const formattedValues = {
      clientName: values.clientName,
      invoiceType: values.invoiceType,
      date: dayjs(values.date).format('YYYY-MM-DD'),
      items: values.items.map((item: any) => {
        const govTvaMultiplier = 1 + item.tvaGov / 100;
        const companyTvaMultiplier = 1 + item.tvaUs / 100;
        const totalPrice =
          item.unitPrice * item.units * govTvaMultiplier * companyTvaMultiplier;
        return {
          name: item.name,
          units: item.units,
          unitPrice: item.unitPrice,
          tvaPercentage1: item.tvaGov,
          tvaPercentage2: item.tvaUs,
          totalPrice: totalPrice.toFixed(2), // Store total price as a string with two decimal places
        };
      }),
      comment: values.comment,
      grandTotal: values.items
        .reduce((sum: any, item: any) => sum + parseFloat(item.totalPrice), 0)
        .toFixed(2), // Calculate grand total and format to two decimal places
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
        form.resetFields(); // Reset the form after success
        onDataUpdate(newInvoice);
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
            <div className="form-items">
              {fields.map(({ key, name, fieldKey, ...restField }) => (
                <Space
                  key={key}
                  align="baseline"
                  style={{ display: 'flex', marginBottom: 8, flexWrap: 'wrap' }}
                >
                  <Form.Item
                    {...restField}
                    name={[name, 'name']}
                    fieldKey={[fieldKey as any, 'name']}
                    rules={[
                      { required: true, message: 'Please select an item' },
                    ]}
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

                  <Form.Item
                    {...restField}
                    name={[name, 'tvaGov']}
                    fieldKey={[fieldKey as any, 'tvaGov']}
                    rules={[
                      {
                        required: true,
                        message: 'Enter government TVA percentage',
                      },
                    ]}
                  >
                    <InputNumber min={0} placeholder="Gov TVA (%)" />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, 'tvaUs']}
                    fieldKey={[fieldKey as any, 'tvaUs']}
                    rules={[
                      { required: true, message: 'Enter US TVA percentage' },
                    ]}
                  >
                    <InputNumber min={0} placeholder="TVA (%)" />
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
            </div>
          )}
        </Form.List>
        <Form.Item
          name="date"
          initialValue={dayjs()} // Default to today's date
          rules={[{ required: true, message: 'Date is required' }]}
        >
          <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
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
