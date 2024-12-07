import { Form, Input, Button, Typography } from 'antd';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../auth/AuthProvider'; // Adjust the import path as needed

const { Title } = Typography;

const SignIn = () => {
  const [loading, setLoading] = useState(false);
  const { loginAction } = useAuth(); // Access loginAction from AuthProvider

  const handleSubmit = async (values: { username: string; password: string }) => {
    setLoading(true);
    try {
      await loginAction(values); // Call the loginAction function
    } catch (err) {
      console.error('Login error:', err);
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto' }}>
      <Title level={2}>Sign In</Title>
      <Form layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input placeholder="Enter your username" />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password placeholder="Enter your password" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Sign In
          </Button>
        </Form.Item>
        <div>
          Don't have an account? <Link to="/signup">Register</Link>
        </div>
      </Form>
    </div>
  );
};

export default SignIn;