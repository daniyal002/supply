import { Badge, Dropdown, Space, Tooltip } from "antd";
import { MenuProps } from "antd/lib";
import React, { useEffect, useState } from "react";
import { formatNotificationDate } from "@/helper/DataFormat";

import { MailOutlined } from "@ant-design/icons";
import { useThemeStore } from "../../../../store/themeStore";
import { useNotificationChatStore } from "../../../../store/notificationChatStore";

export default function DropdownNotificationsChat() {
  const notificationsChat = useNotificationChatStore((state) => state.notificationsChat);
  const [items, setItems] = useState<MenuProps["items"]>([]);

  const { supplyTheme } = useThemeStore();

  useEffect(() => {
    setItems(
      notificationsChat?.length > 0
        ? notificationsChat.map((notification) => ({
            key: notification.notification_id,
            label: (
              <div><p>

                {`${
                  notification.notification_message
                } - ${formatNotificationDate(notification.created_at)}`}
              </p>

              </div>
            ),
          }))
        : [
            {
              key: "no-data",
              label: (<p>Нет новых сообщений</p>),
              disabled: true,
            },
          ]
    );
  }, [notificationsChat]);



  return (
      <Dropdown
        menu={{ items }}
        trigger={["click"]}
        destroyPopupOnHide={false}
        dropdownRender={(menu) => (
          <div
            style={{
              boxShadow:
                "0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)",
              borderRadius: "8px",
              maxHeight: "200px", // Ограничиваем высоту
              display: "flex",
              flexDirection: "column", // Располагаем элементы вертикально
              backgroundColor: supplyTheme === 'light' ? "#fff" : "#343434"
            }}
          >
            {/* Контейнер для прокрутки уведомлений */}
            <div
              style={{
                flex: 1, // Занимает всё доступное пространство
                overflowY: "auto", // Включаем вертикальный скролл
                padding: "8px 0", // Внутренний отступ
              }}
            >
              {React.cloneElement(
                menu as React.ReactElement<{ style: React.CSSProperties }>,
                { style: { boxShadow: "none", border: "none" } }
              )}
            </div>


          </div>
        )}
      >
        <Space>
          <Tooltip title="Сообщения">
          <Badge
            count={notificationsChat.length}
            size="small"
            style={{
              boxShadow: "none",
              marginTop: -2,
              marginRight: 7,
              fontSize: "9px",
            }}
            offset={[5, -5]}
          >
            <MailOutlined
              style={{
                cursor: "pointer",
                transition: "all 0.3s",
                fontSize:"28px"
              }}
            />
          </Badge>
          </Tooltip>
        </Space>
      </Dropdown>
  );
}
