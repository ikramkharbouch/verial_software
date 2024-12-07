import {
  Button,
  Flex,
  Layout,
  theme,
  Input,
  Space,
  Dropdown,
  MenuProps,
} from 'antd';
import '@renderer/styles/dashboard.css';
import { useState } from 'react';
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

type SearchProps = React.ComponentProps<typeof Input.Search>;

const { Search } = Input;

const { Header, Sider, Content } = Layout;

const MainLayout = ({ items }: any) => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const auth = useAuth();
  const navigate = useNavigate(); // Use navigate for navigation

  const onSearch: SearchProps['onSearch'] = (value, _e, info) =>
    console.log(info?.source, value);

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
      onClick: () => auth.logOut(), // Log out action
    },
  ];

  return (
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
              <img
                src={logo}
                alt="Company Logo"
                style={{ height: '6rem' }}
              />
            </div>
            <MainMenu />
          </div>

          <Button
            style={{ margin: '1rem', wordBreak: 'break-word' }}
            onClick={() => auth.logOut()}
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
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{
                  fontSize: '16px',
                  width: 64,
                  height: 64,
                }}
              />

              <div className="avatar">
                <img src={avatar} alt="Avatar" />
              </div>
              <div>
                <Dropdown menu={{ items: menuItems }}>
                  <a onClick={(e) => e.preventDefault()}>
                    <Space>
                      Username
                      <DownOutlined />
                    </Space>
                  </a>
                </Dropdown>
              </div>
            </div>

            <Search
              placeholder="input search text"
              onSearch={onSearch}
              style={{ width: 200, marginRight: '1rem' }}
            />
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
  );
};

export default MainLayout;