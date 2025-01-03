import {
  Button,
  Flex,
  Layout,
  theme,
  Input,
  Space,
  Dropdown,
  MenuProps,
  Modal,
  message,
} from 'antd';
import '@renderer/styles/dashboard.css';
import { useEffect, useRef, useState } from 'react';
import {
  DownOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import logo from '../../../assets/official-logo.svg';
import avatar from '../../../assets/avatar.svg';
import MainMenu from './menu';
import { useAuth } from '../../auth/AuthProvider';
import { useNavigate } from 'react-router-dom'; // Import navigation hook
import { Outlet } from 'react-router-dom';
import { fetchProfile, updateProfile } from '../../store/slices/profileSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import NotificationIcon from './notifications/NotifIcon';
import { NotificationProvider } from './notifications/NotifProvider';

type SearchProps = React.ComponentProps<typeof Input.Search>;

const { Search } = Input;

const { Header, Sider, Content } = Layout;

const MainLayout = ({ items }: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const { profile, loading } = useSelector((state: RootState) => state.profile);
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false); // State to manage modal visibility
  const [searchValue, setSearchValue] = useState(''); // State to store search input
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const auth = useAuth();
  const navigate = useNavigate(); // Use navigate for navigation

  const onSearch = (value: string) => {
    if (!value) return;

    // Navigate based on search term
    switch (value.toLowerCase()) {
      case 'client docs':
        navigate('/client-docs');
        break;
      case 'client management':
        navigate('/clients');
        break;
      case 'profile':
        navigate('/profile');
        break;
      case 'providers':
        navigate('/providers');
        break;
      case 'providers docs':
        navigate('/providers-docs');
        break;
      default:
        message.error('Page not found'); // Show error message if no matching route
        break;
    }

    // Clear search input after action
    setSearchValue('');
  };

  const menuItems: MenuProps['items'] = [
    {
      key: 'profile',
      label: 'Profile',
      onClick: () => navigate('/profile'), // Navigate to profile
    },
    {
      key: 'logout',
      label: 'Log Out',
      icon: <LogoutOutlined />,
      onClick: () => auth.logout(), // Log out action
    },
  ];

  useEffect(() => {
    const userId = sessionStorage.getItem('userId') as string;
    dispatch(fetchProfile(userId));
  }, [dispatch]);

  useEffect(() => {
    if (profile?.profilePicture !== null) {
      const cleanedUrl = profile?.profilePicture.replace('//uploads', '');
      setProfilePic(cleanedUrl as any);
  
    }
    setUsername(profile?.username as string | null);
  }, [profile]);

  return (
    <NotificationProvider>
      <Layout>
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          style={{
            height: '100vh',
            background: '#2C2C2C',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
          className={`sidebar ${collapsed ? 'collapsed' : ''}`}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              height: '100%',
            }}
          >
            <div>
              <div
                style={{
                  height: '64px',
                  margin: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '8px',
                }}
              >
                <img src={logo} alt="Company Logo" style={{ height: '6rem' }} />
              </div>
              <MainMenu />
            </div>

            <Button
              style={{ margin: '1rem', wordBreak: 'break-word' }}
              onClick={() => auth.logout()}
            >
              <LogoutOutlined />
            </Button>
          </div>
        </Sider>
        <Layout>
          <Header style={{ padding: 0, background: colorBgContainer }}>
            <Flex align="center" justify="space-between">
              <div
                style={{ display: 'flex', width: '50%', alignItems: 'center' }}
              >
                <Button
                  type="text"
                  icon={
                    collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />
                  }
                  onClick={() => setCollapsed(!collapsed)}
                  style={{
                    fontSize: '16px',
                    width: 64,
                    height: 64,
                  }}
                />

                <div className="avatar">
                  <img src={profilePic as string} alt="Avatar" />
                </div>
                <div>
                  <Dropdown menu={{ items: menuItems }}>
                    <a onClick={(e) => e.preventDefault()}>
                      <Space>
                        {username}
                        <DownOutlined />
                      </Space>
                    </a>
                  </Dropdown>
                </div>
              </div>

              <div className="search-notif-section-top-menu">
                <NotificationIcon />
                <Search
                  placeholder="Search"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)} // Update search value as user types
                  onSearch={onSearch} // Trigger search when user clicks the search icon
                  enterButton
                  style={{ maxWidth: 300, marginRight: '1rem' }}
                />
              </div>
            </Flex>
          </Header>
          <Content
            style={{
              margin: '24px 16px',
              padding: 24,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </NotificationProvider>
  );
};

export default MainLayout;
