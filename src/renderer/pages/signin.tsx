import { useState } from 'react';
import { Form, Input, Button, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const SignIn = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values: { username: string; password: string }) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();
      if (response.ok) {
        // Store JWT token in localStorage
        localStorage.setItem('site', data.token);

        // Navigate to the dashboard
        navigate('/dashboard');
      } else {
        alert(`Login failed: ${data.message}`);
      }
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
      </Form>
    </div>
  );
};

export default SignIn;
