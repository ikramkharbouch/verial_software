import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input, Select, Button, Form, notification } from 'antd';
import axios from 'axios';

const { Option } = Select;

// Define the validation schema using Zod
const clientSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  companyName: z.string().min(1, 'Company name is required'),
  nif: z.string().min(1, 'NIF is required'),
  clientName: z.string().min(1, 'Client name is required'),
  clientType: z.string().min(1, 'Client type is required'),
  phoneNumber1: z.string().min(1, 'Phone number 1 is required'),
  phoneNumber2: z.string().optional(),
  phoneNumber3: z.string().optional(),
  iceo: z.string().min(1, 'ICEO is required'),
  country: z.string().min(1, 'Country is required'),
  province: z.string().min(1, 'Province is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
  email1: z
    .string()
    .email('Invalid email format')
    .min(1, 'Email 1 is required'),
  email2: z.string().email('Invalid email format').optional(),
  email3: z.string().email('Invalid email format').optional(),
});

// Define the form data type
type ClientFormData = z.infer<typeof clientSchema>;

const CreateNewClient = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
  });
  const onSubmit = async (data: ClientFormData) => {
    console.log(data);

    try {
      // Send a POST request to the server
      const response = await axios.post(
        'http://localhost:3000/users/create',
        data,
      );
      console.log(response.data);
      notification.success({ message: 'Client created successfully!' });
    } catch (error) {
      console.error('Error creating client:', error);
      notification.error({ message: 'Failed to create client.' });
    }
  };

  return (
    <Form onFinish={handleSubmit(onSubmit)} layout="vertical">
      <Form.Item label="ID">
        <Controller
          name="id"
          control={control}
          render={({ field }) => <Input {...field} />}
        />
        {errors.id && <span style={{ color: 'red' }}>{errors.id.message}</span>}
      </Form.Item>

      <Form.Item label="Company's Name">
        <Controller
          name="companyName"
          control={control}
          render={({ field }) => <Input {...field} />}
        />
        {errors.companyName && (
          <span style={{ color: 'red' }}>{errors.companyName.message}</span>
        )}
      </Form.Item>

      <Form.Item label="N.I.F">
        <Controller
          name="nif"
          control={control}
          render={({ field }) => <Input {...field} />}
        />
        {errors.nif && (
          <span style={{ color: 'red' }}>{errors.nif.message}</span>
        )}
      </Form.Item>

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

      <Form.Item label="Phone Number 1">
        <Controller
          name="phoneNumber1"
          control={control}
          render={({ field }) => <Input {...field} />}
        />
        {errors.phoneNumber1 && (
          <span style={{ color: 'red' }}>{errors.phoneNumber1.message}</span>
        )}
      </Form.Item>

      <Form.Item label="Phone Number 2">
        <Controller
          name="phoneNumber2"
          control={control}
          render={({ field }) => <Input {...field} />}
        />
      </Form.Item>

      <Form.Item label="Phone Number 3">
        <Controller
          name="phoneNumber3"
          control={control}
          render={({ field }) => <Input {...field} />}
        />
      </Form.Item>

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
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CreateNewClient;
