import {
  Button,
  Flex,
  Layout,
  theme,
  Input,
  Space,
  GetProps,
  Dropdown,
  MenuProps,
} from 'antd';
import '@renderer/styles/dashboard.css';
import {  useState } from 'react';
import {
  DownOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SmileOutlined,
} from '@ant-design/icons';
import logo from '../../../assets/official-logo.svg';
import avatar from '../../../assets/avatar.svg';
import MainMenu from './menu';
import { useAuth } from '../../auth/AuthProvider';

type SearchProps = GetProps<typeof Input.Search>;

const { Search } = Input;

const { Header, Sider, Content } = Layout;

const items: MenuProps['items'] = [
  {
    key: '1',
    label: (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.antgroup.com"
      >
        1st menu item
      </a>
    ),
  },
  {
    key: '2',
    label: (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.aliyun.com"
      >
        2nd menu item (disabled)
      </a>
    ),
    icon: <SmileOutlined />,
    disabled: true,
  },
];

const MainLayout = ({children}: any) => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const auth = useAuth();

  const onSearch: SearchProps['onSearch'] = (value, _e, info) =>
    console.log(info?.source, value);

  return (
    <Layout>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{
          height: '100vh',
          background: '#2C2C2C', // Customize sidebar color
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '100%',
          }}
        >
          {/* Logo Section */}
          <div>
            <div
              style={{
                height: '64px',
                margin: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                // background: '#FFFFFF', // White background for logo area
                borderRadius: '8px',
              }}
            >
              <img
                src={logo} // Replace with your logo path
                alt="Company Logo"
                style={{ height: '6rem' }} // Adjust size as needed
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
                <img src={avatar} />
              </div>
              <div>
                <Dropdown menu={{ items }}>
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
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
