import React, { useState } from 'react';
import { Badge, Dropdown, Menu } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import { useNotificationContext } from './NotifProvider';

const NotificationIcon: React.FC = () => {
  const { notifications, markAsRead, clearNotifications } = useNotificationContext();
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // State to manage dropdown visibility
  const [visible, setVisible] = useState(false);

  // Toggle dropdown visibility
  const handleVisibleChange = (newVisible: boolean) => {
    setVisible(newVisible);
  };

  // Create a menu with notifications
  const notificationMenu = (
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
    <Dropdown
      overlay={notificationMenu} // Display notifications in dropdown
      trigger={['click']} // Trigger the dropdown on click
      visible={visible}
      onVisibleChange={handleVisibleChange} // Manage visibility
      placement="bottomRight"
    >
      <Badge count={unreadCount}>
        <BellOutlined
          style={{ fontSize: '20px', cursor: 'pointer' }}
        />
      </Badge>
    </Dropdown>
  );
};

export default NotificationIcon;
