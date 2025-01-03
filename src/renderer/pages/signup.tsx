import React from 'react';
import { Form, Input, Button, Typography, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import bgImg from '../../assets/login_img.jpg'; // Same background image as SignIn
import '../styles/clients.css'; // You can add specific styling here for consistency

const { Title } = Typography;

const SignupPage: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    const { username, email, password } = values;

    try {
      const response = await fetch('http://localhost:3000/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      const result = await response.json();

      if (response.ok) {
        message.success('Signup successful! You can now log in.');
        navigate('/login'); // Redirect to the sign-in page
      } else {
        message.error(result.message || 'Signup failed.');
      }
    } catch (error) {
      console.error('Error during signup:', error);
      message.error('An error occurred. Please try again.');
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Left Section for Image */}
      <div style={{ flex: 1, backgroundImage: `url(${bgImg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        {/* Optionally, you can add overlay text or other content here */}
      </div>

      {/* Right Section for Form */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ maxWidth: '400px', width: '100%' }}>
          <Title level={2}>Sign Up</Title>
          <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item
              label="Username"
              name="username"
              rules={[
                { required: true, message: 'Please enter your username' },
                { min: 3, message: 'Username must be at least 3 characters' },
              ]}
            >
              <Input placeholder="Enter your username" />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: 'Please enter your email' },
                { type: 'email', message: 'Please enter a valid email' },
              ]}
            >
              <Input placeholder="Enter your email" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: 'Please enter your password' }]}
            >
              <Input.Password placeholder="Enter your password" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Sign Up
              </Button>
            </Form.Item>

            <div className="register-form">
              Already have an account? <Link to="/login"><Button>Login</Button></Link>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
