import { Badge, Button, Divider, Dropdown, Space, Tooltip } from "antd";
import { MenuProps } from "antd/lib";
import React, { useEffect, useState } from "react";
import { useNotificationStore } from "../../../../store/notificationStore";
import { formatNotificationDate } from "@/helper/DataFormat";
import {
  useMarkAsReadAllNotification,
  useMarkAsReadNotification,
} from "@/hook/notificationHook";
import { useTabStore } from "../../../../store/tabStore";
import { useApprovalStore } from "../../../../store/approvalStore";
import { BellOutlined } from "@ant-design/icons";
import { useThemeStore } from "../../../../store/themeStore";

export default function DropdownMenu() {
  const notifications = useNotificationStore((state) => state.notifications);
  const [items, setItems] = useState<MenuProps["items"]>([]);
  const { mutate: markAsReadNotification } = useMarkAsReadNotification();
  const { mutate: markAsReadAllNotification } = useMarkAsReadAllNotification();
  const setActiveMainTabKey = useTabStore((state) => state.setActiveMainTabKey);

  const setApprovalOrderId = useApprovalStore(
    (state) => state.setApprovalOrderId
  );

  const handleNotificationClick = (
    notificationId: number,
    e: React.MouseEvent,
    notificationText: string,
    data_id: number
  ) => {
    e.stopPropagation(); // Останавливаем всплытие события
    markAsReadNotification(notificationId);
    if (notificationText.toLowerCase().includes("согласовании")) {
      setActiveMainTabKey("3");
      setApprovalOrderId(String(data_id));
    }
  };

  const readAllNotification = () => {
    if (notifications) {
      markAsReadAllNotification();
    }
  };

  const { supplyTheme } = useThemeStore();


  useEffect(() => {
    setItems(
      notifications?.length > 0
        ? notifications.map((notification) => ({
            key: notification.notification_id,
            label: (
              <div
                onClick={(e) =>
                  handleNotificationClick(
                    notification.notification_id as number,
                    e,
                    notification.notification_message,
                    notification.data_id
                  )
                }
              ><p>

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
              label: (<p>Нет новых уведомлений</p>),
              disabled: true,
            },
          ]
    );
  }, [notifications]);



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

            {/* Кнопка "Прочитать все" с разделителем */}
            {notifications?.length > 0 && (
              <>
                <Divider style={{ margin: 0 }} />
                <Space style={{ padding: "8px" }}>
                  <Button
                    type="primary"
                    onClick={() => readAllNotification()}
                    //@ts-ignore
                    style={{ width: "100%"}} // Растягиваем кнопку на всю ширину
                  >
                    Прочитать все уведомления
                  </Button>
                </Space>
              </>
            )}
          </div>
        )}
      >
        <Space>
          <Tooltip title="Уведомления">
          <Badge
            count={notifications.length}
            size="small"
            style={{
              boxShadow: "none",
              marginTop: -2,
              marginRight: 7,
              fontSize: "9px",
            }}
            offset={[5, -5]}
          >
            <BellOutlined
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
