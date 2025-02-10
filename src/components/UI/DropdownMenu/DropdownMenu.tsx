import { Badge, Dropdown, Space } from 'antd';
import { MenuProps } from 'antd/lib';
import { Bell } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNotificationStore } from '../../../../store/notificationStore';
import { formatNotificationDate } from '@/helper/DataFormat';
import { useMarkAsReadNotification } from '@/hook/notificationHook';
import { useTabStore } from '../../../../store/tabStore';

export default function DropdownMenu() {
  const notifications = useNotificationStore((state) => state.notifications);
  const [items, setItems] = useState<MenuProps['items']>([]);
  const { mutate: markAsReadNotification } = useMarkAsReadNotification();
  const setActiveMainTabKey = useTabStore((state) => state.setActiveMainTabKey)

  const handleNotificationClick = (notificationId: number, e: React.MouseEvent, notificationText:string) => {
    e.stopPropagation(); // Останавливаем всплытие события
    markAsReadNotification(notificationId);
    if(notificationText.toLowerCase().includes("согласовании")){
      setActiveMainTabKey("2")
    }
  };

  useEffect(() => {
    setItems(
      notifications?.length > 0
        ? notifications.map((notification) => ({
            key: notification.notification_id,
            label: (
              <div onClick={(e) => handleNotificationClick(notification.notification_id as number, e,notification.notification_message)}>
                {`${notification.notification_message} - ${formatNotificationDate(notification.created_at)}`}
              </div>
            ),
          }))
        : [{
            key: 'no-data',
            label: 'Нет новых уведомлений',
            disabled: true,
          }]
    );
  }, [notifications]);

  return (
    <Dropdown
      menu={{ items }}
      trigger={['click']}
      destroyPopupOnHide={false}
    >
      <Space>
        <Badge
          count={notifications.length}
          size="small"
          style={{
            backgroundColor: '#678098',
            boxShadow: 'none',
            marginTop: 1,
            marginRight: 2,
            fontSize: "9px"
          }}
          offset={[5, -5]}
        >
          <Bell
            color={'#678098'}
            size={30}
            style={{
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
          />
        </Badge>
      </Space>
    </Dropdown>
  );
}