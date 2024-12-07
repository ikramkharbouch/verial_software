import React, { useState, useEffect } from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  Upload,
  message,
  Row,
  Col,
  Avatar,
  Spin,
  Select,
} from 'antd';
import { UploadOutlined, UserOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { fetchProfile, updateProfile } from '../../store/slices/profileSlice';

const { Option } = Select;

const ProfilePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { profile, loading } = useSelector((state: RootState) => state.profile);
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [userId, setUserId] = useState<string>(
    sessionStorage.getItem('userId') as string,
  );

  useEffect(() => {
    console.log('user is', userId);
    dispatch(fetchProfile(userId));

    console.log(profile);
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      form.setFieldsValue(profile);
      setProfilePic(
        profile.profilePicture
      );
    }
  }, [profile, form]);

  const handleFormSubmit = async (values: any) => {
    try {
      const updatedProfile = {
        ...values,
        profilePicture: profilePic
          ? profilePic.replace('http://localhost:3000', '')
          : null,
      };
      await dispatch(updateProfile(updatedProfile)).unwrap();
      message.success('Profile updated successfully.');
      setIsEditing(false);
    } catch (error) {
      message.error('Failed to update profile.');
    }
  };

  const handleProfilePicChange = (info: any) => {
    if (info.file.status === 'done') {
      const uploadedUrl = info.file.response.url;
      setProfilePic(`http://localhost:3000${uploadedUrl}`);
      message.success(`${info.file.name} uploaded successfully.`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} upload failed.`);
    }
  };

  if (loading) {
    return <Spin style={{ display: 'block', margin: '100px auto' }} />;
  }

  return (
    <Card
      title="Edit Profile"
      style={{ maxWidth: 900, margin: '20px auto', padding: 20 }}
    >
      <Row gutter={[32, 32]}>
        <Col xs={24} md={8} style={{ textAlign: 'center' }}>
          <Avatar
            size={120}
            src={profilePic}
            icon={!profilePic && <UserOutlined />}
            style={{ marginBottom: 16 }}
          />
          <Upload
            name="avatar"
            action="http://localhost:3000/profile/upload"
            headers={{
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`, // Optional, if auth is required
            }}
            data={{
              userId: userId, // Pass userId dynamically from your state or context
            }}
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
              <Input placeholder="Full Name" />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                {
                  required: true,
                  type: 'email',
                  message: 'Please enter a valid email',
                },
              ]}
            >
              <Input placeholder="Email Address" />
            </Form.Item>
            <Form.Item
              name="phoneNumber"
              label="Phone Number"
              rules={[
                { required: true, message: 'Please enter your phone number' },
              ]}
            >
              <Input placeholder="Phone Number" />
            </Form.Item>
            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: isEditing, message: 'Please enter a password' },
              ]}
            >
              <Input.Password placeholder="Password" />
            </Form.Item>
            <Form.Item name="role" label="Role">
              <Select placeholder="Select Role" disabled={!isEditing}>
                <Option value="user">User</Option>
                <Option value="admin">Admin</Option>
              </Select>
            </Form.Item>
            <Form.Item name="address" label="Address">
              <Input.TextArea rows={3} placeholder="Your Address" />
            </Form.Item>
            <Form.Item>
              {isEditing ? (
                <>
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{ marginRight: 8 }}
                  >
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
