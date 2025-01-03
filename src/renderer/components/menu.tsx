import {
  AppstoreOutlined,
  MoneyCollectOutlined,
  UserOutlined,
  DashboardOutlined,
} from '@ant-design/icons';
import { Menu, MenuProps, Dropdown } from 'antd';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Link } from 'react-router-dom'; // If you're using React Router
import '../styles/root.css'

interface MenuItem {
  key: string;
  label: string;
}

const dropdownMenu = (
  <Menu>
    <Menu.Item key="cl-1">
      <Link to="/clients">Management</Link>
    </Menu.Item>
    <Menu.Item key="cl-2">
      <Link to="/client-docs">Documents</Link>
    </Menu.Item>
  </Menu>
);

const dropdownMenuProviders = (
  <Menu>
    <Menu.Item key="pr-1">
      <Link to="/providers">Management</Link>
    </Menu.Item>
    <Menu.Item key="pr-2">
      <Link to="/providers-docs">Documents</Link>
    </Menu.Item>
  </Menu>
);

const dropdownMenuFinancials = (
  <Menu>
    <Menu.Item key="fn-1">
      <Link to="/charges">Charges</Link>
    </Menu.Item>
    <Menu.Item key="fn-2">
      <Link to="/payments">Payments</Link>
    </Menu.Item>
    <Menu.Item key="fn-3">
      <Link to="/made-bills">Made Bills</Link>
    </Menu.Item>
    <Menu.Item key="fn-4">
      <Link to="/received-bills">Received Bills</Link>
    </Menu.Item>
  </Menu>
);

const MainMenu = () => {
  const [selectedKey, setSelectedKey] = useState<string[]>([]); // Initialize selectedKey with the current path

  // Define type for menu click event
  const handleMenuClick: MenuProps['onClick'] = (e) => {
    setSelectedKey([e.key]); // Update selectedKey when an item is clicked
    console.log(selectedKey);
  };

  return (
    <Menu
      theme="dark"
      mode="inline"
      style={{ background: '#2C2C2C' }}
      selectedKeys={[location.pathname]} // Highlight the selected menu item
      onClick={handleMenuClick} // Handle menu item click
      className="menu-container"
    >
      <Menu.Item key="ds" icon={<DashboardOutlined />}>
        <Link to="/dashboard" className='ant-menu-item-selected'>Dashboard</Link>
      </Menu.Item>

      <Dropdown
        overlay={dropdownMenu}
        trigger={['click']}
        className="dropdownmenu"
        key="clientSub"
      >
        <Menu.Item key="cl" icon={<UserOutlined />}>
          Clients
        </Menu.Item>
      </Dropdown>

      <Dropdown
        overlay={dropdownMenuProviders}
        trigger={['click']}
        className="dropdownmenu"
        key="providerSub"
      >
        <Menu.Item key="pr" icon={<UserOutlined />}>
          Providers
        </Menu.Item>
      </Dropdown>

      <Menu.Item key="3" icon={<AppstoreOutlined />} className='menu-item'>
        <NavLink to="/articles" className="ant-menu-item-selected">
          Articles
        </NavLink>
      </Menu.Item>

      <Dropdown
        overlay={dropdownMenuFinancials}
        trigger={['click']}
        className="dropdownmenu"
        key="financials-sub"
      >
        <Menu.Item key="fn" icon={<MoneyCollectOutlined />}>
          Financials
        </Menu.Item>
      </Dropdown>
    </Menu>
  );
};

export default MainMenu;
