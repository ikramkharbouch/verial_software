import {
  AppstoreOutlined,
  MoneyCollectOutlined,
  UserOutlined,
  UsergroupAddOutlined,
} from '@ant-design/icons';
import { Menu } from 'antd';
import { NavLink } from 'react-router-dom';

const MainMenu = () => {

    return (
    <Menu
      theme="dark"
      mode="inline"
      defaultSelectedKeys={['1']}
      style={{ background: '#2C2C2C' }}
      selectedKeys={[location.pathname]}
    >
      <Menu.Item
        key="1"
        icon={<UserOutlined />}
        style={{ backgroundColor: '#D32F2F', color: '#FFFFFF' }} // Light gray background and dark text
      >
        <NavLink to="/clients" className="ant-menu-item-selected">
          Clients
        </NavLink>
      </Menu.Item>

      <Menu.Item
        key="2"
        icon={<UsergroupAddOutlined />}
        style={{ backgroundColor: '#D32F2F', color: '#FFFFFF' }} // Light gray background and dark text
      >
        <NavLink to="/providers" className="ant-menu-item-selected">
          Providers
        </NavLink>
      </Menu.Item>

      <Menu.Item
        key="3"
        icon={<AppstoreOutlined />}
        style={{ backgroundColor: '#D32F2F', color: '#FFFFFF' }} // Light gray background and dark text
      >
        <NavLink to="/articles" className="ant-menu-item-selected">
          Articles
        </NavLink>
      </Menu.Item>

      <Menu.Item
        key="4"
        icon={<MoneyCollectOutlined />}
        style={{ backgroundColor: '#D32F2F', color: '#FFFFFF' }} // Light gray background and dark text
      >
        <NavLink to="/financials" className="ant-menu-item-selected">
          Financials
        </NavLink>
      </Menu.Item>
    </Menu>
  );
};

export default MainMenu;
