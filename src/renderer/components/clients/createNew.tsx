import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input, Select, Button, Form, notification, Row, Col, Modal, Space } from 'antd';
import axios from 'axios';
import '../../styles/forms.css';

const { Option } = Select;

// Define the validation schema using Zod
const clientSchema = z.object({
  companyName: z.string().optional(),
  nif: z.string().optional(),
  clientName: z.string().optional(),
  clientType: z.string().optional(),
  phoneNumber1: z.string().optional(),
  phoneNumber2: z.string().optional(),
  phoneNumber3: z.string().optional(),
  iceo: z.string().optional(),
  country: z.string().optional(),
  province: z.string().optional(),
  postalCode: z.string().optional(),
  email1: z.string().optional().refine((val) => !val || z.string().email().safeParse(val).success, {
    message: 'Invalid email format',
  }),
  email2: z.string().optional().refine((val) => !val || z.string().email().safeParse(val).success, {
    message: 'Invalid email format',
  }),
  email3: z.string().optional().refine((val) => !val || z.string().email().safeParse(val).success, {
    message: 'Invalid email format',
  }),
});

// Define the form data type
type ClientFormData = z.infer<typeof clientSchema>;

interface CreateNewClientProps {
  isVisible: boolean;
  onClose: () => void;
  onClientCreated: () => void;
  editingClient?: any; // Optional client data for editing
}

const CreateNewClient: React.FC<CreateNewClientProps> = ({
  isVisible,
  onClose,
  onClientCreated,
  editingClient,
}) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    mode: 'onBlur',
  });

  // Populate form when editing
  useEffect(() => {
    if (editingClient) {
      reset(editingClient); // Populate the form with the editing client's data
    } else {
      reset(); // Reset the form for new client creation
    }
  }, [editingClient, reset]);

  const onSubmit = async (data: ClientFormData) => {
    try {
      const url = editingClient
        ? `http://localhost:3000/clients/${editingClient.id}`
        : 'http://localhost:3000/clients/create';

      const method = editingClient ? 'PUT' : 'POST';

      await axios({
        url,
        method,
        data,
      });

      notification.success({
        message: `Client ${editingClient ? 'updated' : 'created'} successfully!`,
        description: `Client ${data.clientName || editingClient?.clientName} has been ${
          editingClient ? 'updated' : 'added'
        }.`,
      });

      onClientCreated();
      reset();
      onClose();
    } catch (error) {
      console.error(`Error ${editingClient ? 'updating' : 'creating'} client:`, error);
      notification.error({
        message: `Failed to ${editingClient ? 'update' : 'create'} client`,
        description: 'Please check your input and try again.',
      });
    }
  };

  const handleCancel = () => {
    reset(); // Reset form to clear any entered data
    onClose(); // Close the modal
  };

  return (
    <Modal
      title={editingClient ? 'Edit Client' : 'Create New Client'}
      open={isVisible}
      onCancel={handleCancel}
      footer={null}
      destroyOnClose // Ensures form is reset when modal is closed
    >
      <Form onFinish={handleSubmit(onSubmit)} layout="vertical" className="client-form">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Company's Name"
              help={errors.companyName?.message}
              validateStatus={errors.companyName ? 'error' : ''}
            >
              <Controller
                name="companyName"
                control={control}
                render={({ field }) => <Input {...field} />}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="N.I.F"
              help={errors.nif?.message}
              validateStatus={errors.nif ? 'error' : ''}
            >
              <Controller
                name="nif"
                control={control}
                render={({ field }) => <Input {...field} />}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Client's Name">
              <Controller
                name="clientName"
                control={control}
                render={({ field }) => <Input {...field} />}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Type of Client">
              <Controller
                name="clientType"
                control={control}
                render={({ field }) => (
                  <Select {...field}>
                    <Option value="individual">Individual</Option>
                    <Option value="corporate">Corporate</Option>
                    <Option value="government">Government</Option>
                  </Select>
                )}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Phone Number 1">
              <Controller
                name="phoneNumber1"
                control={control}
                render={({ field }) => <Input {...field} />}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Phone Number 2">
              <Controller
                name="phoneNumber2"
                control={control}
                render={({ field }) => <Input {...field} />}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Phone Number 3">
              <Controller
                name="phoneNumber3"
                control={control}
                render={({ field }) => <Input {...field} />}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="ICEO">
              <Controller
                name="iceo"
                control={control}
                render={({ field }) => <Input {...field} />}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Country">
              <Controller
                name="country"
                control={control}
                render={({ field }) => <Input {...field} />}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Province">
              <Controller
                name="province"
                control={control}
                render={({ field }) => <Input {...field} />}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Postal Code">
              <Controller
                name="postalCode"
                control={control}
                render={({ field }) => <Input {...field} />}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Email 1">
              <Controller
                name="email1"
                control={control}
                render={({ field }) => <Input {...field} />}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Email 2">
              <Controller
                name="email2"
                control={control}
                render={({ field }) => <Input {...field} />}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Email 3">
              <Controller
                name="email3"
                control={control}
                render={({ field }) => <Input {...field} />}
              />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              {editingClient ? 'Save Changes' : 'Create Client'}
            </Button>
            <Button onClick={handleCancel}>Cancel</Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateNewClient;
