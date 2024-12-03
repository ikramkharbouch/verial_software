import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Upload, message, Row, Col, Avatar, Spin } from 'antd';
import { UploadOutlined, UserOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { fetchUserProfile, updateUserProfile } from '../../store/slices/userSlice';

const ProfilePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { profile, loading } = useSelector((state: RootState) => state.user );
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [profilePic, setProfilePic] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      form.setFieldsValue(profile);
      setProfilePic(profile.avatar || null);
    }
  }, [profile, form]);

  const handleFormSubmit = async (values: any) => {
    try {
      const updatedProfile = {
        ...values,
        avatar: profilePic,
      };
      await dispatch(updateUserProfile(updatedProfile)).unwrap();
      message.success('Profile updated successfully.');
      setIsEditing(false);
    } catch (error) {
      message.error('Failed to update profile.');
    }
  };

  const handleProfilePicChange = (info: any) => {
    if (info.file.status === 'done') {
      const uploadedUrl = info.file.response.url; // Assuming backend returns the uploaded URL
      setProfilePic(uploadedUrl);
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  if (loading) {
    return <Spin style={{ display: 'block', margin: '100px auto' }} />;
  }

  return (
    <Card title="Profile" style={{ maxWidth: 800, margin: '20px auto' }}>
      <Row gutter={16}>
        <Col xs={24} md={8} style={{ textAlign: 'center', marginBottom: 16 }}>
          <Avatar
            size={120}
            src={profilePic}
            icon={!profilePic && <UserOutlined />}
            style={{ marginBottom: 16 }}
          />
          <Upload
            name="avatar"
            action="/api/upload" // Replace with your upload endpoint
            onChange={handleProfilePicChange}
            showUploadList={false}
          >
            <Button icon={<UploadOutlined />}>Change Profile Picture</Button>
          </Upload>
        </Col>
        <Col xs={24} md={16}>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleFormSubmit}
            initialValues={profile as any}
            disabled={!isEditing}
          >
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, message: 'Please enter your name' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="phone" label="Phone Number">
              <Input />
            </Form.Item>
            <Form.Item name="address" label="Address">
              <Input.TextArea rows={3} />
            </Form.Item>
            <Form.Item>
              {isEditing ? (
                <>
                  <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
                    Save
                  </Button>
                  <Button onClick={() => setIsEditing(false)}>Cancel</Button>
                </>
              ) : (
                <Button type="primary" onClick={() => setIsEditing(true)}>
                  Edit Profile
                </Button>
              )}
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </Card>
  );
};

export default ProfilePage;
