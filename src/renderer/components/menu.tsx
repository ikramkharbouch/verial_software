import {
  AppstoreOutlined,
  MoneyCollectOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Menu, MenuProps, Dropdown } from 'antd';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Link } from 'react-router-dom'; // If you're using React Router

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
      className='menu-container'
    >

      <Dropdown overlay={dropdownMenu} trigger={['click']} className='dropdownmenu' key="clientSub">
        <Menu.Item key="cl" icon={<UserOutlined />}>Clients</Menu.Item>
      </Dropdown>

      <Dropdown overlay={dropdownMenuProviders} trigger={['click']} className='dropdownmenu' key="providerSub">
        <Menu.Item key="pr" icon={<UserOutlined />}>Providers</Menu.Item>
      </Dropdown>

      {/* <Menu.Item
        key="2"
        icon={<UsergroupAddOutlined />}
        className="ant-menu-item"
      >
        <NavLink to="/providers" className="ant-menu-item-selected">
          Providers
        </NavLink>
      </Menu.Item> */}

      <Menu.Item key="3" icon={<AppstoreOutlined />}>
        <NavLink to="/articles" className="ant-menu-item-selected">
          Articles
        </NavLink>
      </Menu.Item>

      <Menu.Item
        key="4"
        icon={<MoneyCollectOutlined />}
        className="ant-menu-item"
      >
        <NavLink to="/financials">
          Financials
        </NavLink>
      </Menu.Item>
    </Menu>
  );
};

export default MainMenu;
