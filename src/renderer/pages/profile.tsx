import React, { useState, useEffect } from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  Upload,
  message,
  Avatar,
  Spin,
  Select,
  Tooltip,
} from 'antd';
import { UploadOutlined, UserOutlined, EditOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { fetchProfile, updateProfile } from '../../store/slices/profileSlice';
import '../styles/profile.css'; // Import the CSS file

const { Option } = Select;

const ProfilePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { profile, loading } = useSelector((state: RootState) => state.profile);
  const [form] = Form.useForm();
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [editableFields, setEditableFields] = useState<string[]>([]);
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    setUserId(sessionStorage.getItem('userId') as string);
    dispatch(fetchProfile(userId));
  }, [dispatch]);

  useEffect(() => {

    const cleanedUrl = profile?.profilePicture.replace('//uploads', '');

    if (profile && profile.profilePicture) {
      setProfilePic(`${cleanedUrl}`);
    }

    console.log("Profile picture debugging", profilePic);
  }, [profile]);

  const handleFormSubmit = async (values: any) => {

    console.log(values);
    try {
      const updatedProfile = {
        ...values,
        userId,
        profilePicture: profilePic
          ? profilePic.replace('http://localhost:3000/uploads/', '')
          : null,
      };
      await dispatch(updateProfile(updatedProfile)).unwrap();
      dispatch(fetchProfile(sessionStorage.getItem('userId')!));
      message.success('Profile updated successfully.');
      setEditableFields([]);
    } catch (error) {
      message.error('Failed to update profile.');
    }
  };

  const handleProfilePicChange = (info: any) => {
    if (info.file.status === 'done') {
      const uploadedUrl = info.file.response.url;
      const fullPath = `http://localhost:3000/uploads/${uploadedUrl}`;
      setProfilePic(`${fullPath}?timestamp=${new Date().getTime()}`);
      form.setFieldsValue({ profilePicture: fullPath });
      message.success(`${info.file.name} uploaded successfully.`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} upload failed.`);
    }
  };

  const toggleEditField = (fieldName: string) => {
    setEditableFields((prev) =>
      prev.includes(fieldName)
        ? prev.filter((field) => field !== fieldName)
        : [...prev, fieldName],
    );
  };

  if (loading) {
    return <Spin style={{ display: 'block', margin: '100px auto' }} />;
  }

  return (
    <Card title="Edit Profile" className="profile-card">
      <div className="profile-avatar-container">
        <Avatar
          size={120}
          src={profilePic}
          icon={!profilePic && <UserOutlined />}
        />
        <Upload
          name="avatar"
          action="http://localhost:3000/profile/upload"
          headers={{
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          }}
          data={{
            userId: sessionStorage.getItem('userId'),
          }}
          onChange={handleProfilePicChange}
          showUploadList={false}
        >
          <Button icon={<UploadOutlined />}>Change Profile Picture</Button>
        </Upload>
      </div>

      <div className="profile-form">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFormSubmit}
          initialValues={profile as any}
        >
          {[
            { name: 'username', label: 'Username', placeholder: 'Username' },
            { name: 'email', label: 'Email', placeholder: 'Email Address' },
            {
              name: 'phoneNumber',
              label: 'Phone Number',
              placeholder: 'Phone Number',
            },
            { name: 'address', label: 'Address', placeholder: 'Your Address' },
          ].map((field) => (
            <Form.Item
              key={field.name}
              name={field.name}
              label={
                <span>
                  {field.label}{' '}
                  <Tooltip title="Edit">
                    <EditOutlined
                      onClick={() => toggleEditField(field.name)}
                      style={{ cursor: 'pointer', marginLeft: 8 }}
                    />
                  </Tooltip>
                </span>
              }
            >
              <Input
                placeholder={field.placeholder}
                disabled={!editableFields.includes(field.name)}
              />
            </Form.Item>
          ))}

          <Form.Item name="role" label="Role">
            <Select
              placeholder="Select Role"
              disabled={!editableFields.includes('role')}
            >
              <Option value="user">User</Option>
              <Option value="admin">Admin</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="profile-save-button"
            >
              Save Changes
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Card>
  );
};

export default ProfilePage;
