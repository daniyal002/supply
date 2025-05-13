import { Badge, Button, ConfigProvider, Divider, Dropdown, Space } from "antd";
import { MenuProps } from "antd/lib";
import { Bell } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNotificationStore } from "../../../../store/notificationStore";
import { formatNotificationDate } from "@/helper/DataFormat";
import { useMarkAsReadNotification } from "@/hook/notificationHook";
import { useTabStore } from "../../../../store/tabStore";
import { useApprovalStore } from "../../../../store/approvalStore";

export default function DropdownMenu() {
  const notifications = useNotificationStore((state) => state.notifications);
  const [items, setItems] = useState<MenuProps["items"]>([]);
  const { mutate: markAsReadNotification } = useMarkAsReadNotification();
  const setActiveMainTabKey = useTabStore((state) => state.setActiveMainTabKey);

  useEffect(() => {
    console.log(notifications);
  }, [notifications]);

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
      setActiveMainTabKey("2");
      setApprovalOrderId(String(data_id));
    }
  };

  const readAllNotification = () => {
    if (notifications)
      notifications.forEach((notification) => {
        markAsReadNotification(notification.notification_id);
      });
  };

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
              >
                {`${
                  notification.notification_message
                } - ${formatNotificationDate(notification.created_at)}`}
              </div>
            ),
          }))
        : [
            {
              key: "no-data",
              label: "Нет новых уведомлений",
              disabled: true,
            },
          ]
    );
  }, [notifications]);

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#678098",
        },
      }}
    >
      <Dropdown
        menu={{ items }}
        trigger={["click"]}
        destroyPopupOnHide={false}
        dropdownRender={(menu) => (
          <div style={{
            backgroundColor: "#fff",
            boxShadow: "0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)",
            borderRadius: "8px",
            maxHeight: "200px", // Ограничиваем высоту
            display: "flex",
            flexDirection: "column", // Располагаем элементы вертикально
          }}>
            {/* Контейнер для прокрутки уведомлений */}
            <div style={{
              flex: 1, // Занимает всё доступное пространство
              overflowY: "auto", // Включаем вертикальный скролл
              padding: "8px 0", // Внутренний отступ
            }}>
              {React.cloneElement(
                menu as React.ReactElement<{ style: React.CSSProperties }>,
                { style: { boxShadow: "none", border: "none" } },
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
                    style={{ width: "100%" }} // Растягиваем кнопку на всю ширину
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
          <Badge
            count={notifications.length}
            size="small"
            style={{
              backgroundColor: "#678098",
              boxShadow: "none",
              marginTop: 1,
              marginRight: 2,
              fontSize: "9px",
            }}
            offset={[5, -5]}
          >
            <Bell
              color={"#678098"}
              size={30}
              style={{
                cursor: "pointer",
                transition: "all 0.3s",
              }}
            />
          </Badge>
        </Space>
      </Dropdown>
    </ConfigProvider>
  );
}
