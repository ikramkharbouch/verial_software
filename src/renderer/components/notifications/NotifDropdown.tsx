import React from 'react';
import { Menu, Dropdown, Button } from 'antd';
import { BellOutlined } from '@ant-design/icons';

interface Notification {
  id: number;
  message: string;
  isRead: boolean;
}

interface NotificationDropdownProps {
  notifications: Notification[];
  clearNotifications: () => void;
  markAsRead: (id: number) => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  notifications,
  clearNotifications,
  markAsRead,
}) => {
  const menu = (
    <Menu>
      {notifications.length > 0 ? (
        <>
          {notifications.map((notification) => (
            <Menu.Item
              key={notification.id}
              style={{
                backgroundColor: notification.isRead ? '#f9f9f9' : '#e6f7ff',
              }}
              onClick={() => markAsRead(notification.id)}
            >
              {notification.message}
            </Menu.Item>
          ))}
          <Menu.Divider />
          <Menu.Item key="clear-all" onClick={clearNotifications}>
            Clear All
          </Menu.Item>
        </>
      ) : (
        <Menu.Item disabled>No Notifications</Menu.Item>
      )}
    </Menu>
  );

  return (
    <Dropdown overlay={menu} trigger={['click']}>
      <Button
        icon={
          <BellOutlined style={{ fontSize: '20px', color: '#1890ff' }} />
        }
      >
        Notifications ({notifications.filter((n) => !n.isRead).length})
      </Button>
    </Dropdown>
  );
};

export default NotificationDropdown;
