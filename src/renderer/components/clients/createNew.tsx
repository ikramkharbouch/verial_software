import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Input, 
  Select, 
  Button, 
  Form, 
  notification, 
  Row, 
  Col, 
  Modal, 
  Space
} from 'antd';
import axios from 'axios';
import '../../styles/forms.css';

const { Option } = Select;

// Define the validation schema using Zod
const clientSchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  nif: z.string().min(1, 'NIF is required'),
  clientName: z.string().min(1, 'Client name is required'),
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
  onClientCreated?: (client: ClientFormData) => void;
}

const CreateNewClient: React.FC<CreateNewClientProps> = ({ 
  isVisible, 
  onClose, 
  onClientCreated 
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

  const onSubmit = async (data: ClientFormData) => {
    try {
      // Send a POST request to the server
      const response = await axios.post(
        'http://localhost:3000/clients/create',
        data,
      );
      
      // Notify success
      notification.success({ 
        message: 'Client created successfully!',
        description: `Client ${data.clientName} has been added.`
      });

      // Call optional callback if provided
      if (onClientCreated) {
        onClientCreated(data);
      }

      // Reset form and close modal
      reset();
      onClose();
    } catch (error) {
      console.error('Error creating client:', error);
      notification.error({ 
        message: 'Failed to create client',
        description: 'Please check your input and try again.'
      });
    }
  };

  const handleCancel = () => {
    reset(); // Reset form to clear any entered data
    onClose(); // Close the modal
  };

  return (
    <Modal
      title="Create New Client"
      open={isVisible}
      onCancel={handleCancel}
      footer={null}
      destroyOnClose // Ensures form is reset when modal is closed
    >
      <Form 
        onFinish={handleSubmit(onSubmit)} 
        layout="vertical" 
        className="client-form"
      >
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
            {errors.clientName && (
              <span style={{ color: 'red' }}>{errors.clientName.message}</span>
            )}
          </Form.Item>
        </Col>
        <Col span={12}>
          {' '}
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
            {errors.clientType && (
              <span style={{ color: 'red' }}>{errors.clientType.message}</span>
            )}
          </Form.Item>
        </Col>

            <Row gutter={16}>
            <Col span={12}>
          <Form.Item label="Phone Number 1">
            <Controller
              name="phoneNumber1"
              control={control}
              render={({ field }) => <Input {...field} />}
            />
            {errors.phoneNumber1 && (
              <span style={{ color: 'red' }}>
                {errors.phoneNumber1.message}
              </span>
            )}
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
            {errors.iceo && (
              <span style={{ color: 'red' }}>{errors.iceo.message}</span>
            )}
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Country">
            <Controller
              name="country"
              control={control}
              render={({ field }) => <Input {...field} />}
            />
            {errors.country && (
              <span style={{ color: 'red' }}>{errors.country.message}</span>
            )}
          </Form.Item>
        </Col>
        <Col span={12}>
        <Form.Item label="Province">
        <Controller
          name="province"
          control={control}
          render={({ field }) => <Input {...field} />}
        />
        {errors.province && (
          <span style={{ color: 'red' }}>{errors.province.message}</span>
        )}
      </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item label="Postal Code">
        <Controller
          name="postalCode"
          control={control}
          render={({ field }) => <Input {...field} />}
        />
        {errors.postalCode && (
          <span style={{ color: 'red' }}>{errors.postalCode.message}</span>
        )}
      </Form.Item>
        </Col>

            </Row>

        </Row>

        <Form.Item label="Email 1">
        <Controller
          name="email1"
          control={control}
          render={({ field }) => <Input {...field} />}
        />
        {errors.email1 && (
          <span style={{ color: 'red' }}>{errors.email1.message}</span>
        )}
      </Form.Item>

      <Form.Item label="Email 2">
        <Controller
          name="email2"
          control={control}
          render={({ field }) => <Input {...field} />}
        />
      </Form.Item>

      <Form.Item label="Email 3">
        <Controller
          name="email3"
          control={control}
          render={({ field }) => <Input {...field} />}
        />
      </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
            <Button onClick={handleCancel}>
              Cancel
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateNewClient;