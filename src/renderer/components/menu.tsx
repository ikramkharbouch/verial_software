import {
  AppstoreOutlined,
  MoneyCollectOutlined,
  UserOutlined,
  UsergroupAddOutlined,
} from '@ant-design/icons';
import { Menu, MenuProps, Dropdown } from 'antd';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Link } from 'react-router-dom'; // If you're using React Router

const dropdownMenu = (
  <Menu>
    <Menu.Item key="1">
      <Link to="/clients">Management</Link>
    </Menu.Item>
    <Menu.Item key="2">
      <Link to="/client-docs">Documents</Link>
    </Menu.Item>
  </Menu>
);

const MainMenu = () => {
  const [selectedKey, setSelectedKey] = useState<string>(location.pathname); // Initialize selectedKey with the current path

  // Define type for menu click event
  const handleMenuClick: MenuProps['onClick'] = (e) => {
    setSelectedKey(e.key); // Update selectedKey when an item is clicked
  };

  return (
    <Menu
      theme="dark"
      mode="inline"
      defaultSelectedKeys={['1']}
      style={{ background: '#2C2C2C' }}
      selectedKeys={[selectedKey]} // Highlight the selected menu item
      onClick={handleMenuClick} // Handle menu item click
      className='menu-container'
    >
      <Dropdown overlay={dropdownMenu} trigger={['click']} className='dropdownmenu'>
        <Menu.Item key="sub1" icon={<UserOutlined />}>Clients</Menu.Item>
      </Dropdown>

      <Menu.Item
        key="2"
        icon={<UsergroupAddOutlined />}
        className="ant-menu-item"
      >
        <NavLink to="/providers" className="ant-menu-item-selected">
          Providers
        </NavLink>
      </Menu.Item>

      <Menu.Item key="3" icon={<AppstoreOutlined />} className="ant-menu-item">
        <NavLink to="/articles" className="ant-menu-item-selected">
          Articles
        </NavLink>
      </Menu.Item>

      <Menu.Item
        key="4"
        icon={<MoneyCollectOutlined />}
        className="ant-menu-item"
      >
        <NavLink to="/financials" className="ant-menu-item-selected">
          Financials
        </NavLink>
      </Menu.Item>
    </Menu>
  );
};

export default MainMenu;
