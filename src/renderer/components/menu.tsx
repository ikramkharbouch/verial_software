import {
  AppstoreOutlined,
  MoneyCollectOutlined,
  UserOutlined,
  UsergroupAddOutlined,
} from '@ant-design/icons';
import { Menu, MenuProps } from 'antd';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';

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
>
      <Menu.Item key="1" icon={<UserOutlined />} className="ant-menu-item">
        <NavLink to="/clients" className="ant-menu-item-selected">
          Clients
        </NavLink>
      </Menu.Item>

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
