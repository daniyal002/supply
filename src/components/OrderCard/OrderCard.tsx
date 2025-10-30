import { Card, Button, Space, Typography, Collapse, Tag } from "antd";
import { toast } from "sonner";
import { IOrderItem } from "@/interface/orderItem";
import { useResetOrderMutation } from "@/hook/orderHook";
import { EyeTwoTone, ReloadOutlined } from "@ant-design/icons";
import styles from "./OrderCard.module.scss";
import { ProductNameList } from "../UI/ProductNameList/ProductNameList";
import { useOrderIdStore } from "../../../store/orderIdStore";

const { Text, Title } = Typography;

interface OrderCardProps {
  order: IOrderItem;
  isDraft: boolean;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, isDraft }) => {
  const items = [
    {
      key: "1",
      label: "Товары",
      children: <ProductNameList orderId={order.order_id as number} />,
    },
  ];

  const { mutate: resetOrderMutation } = useResetOrderMutation();
  const setOrderId = useOrderIdStore((state) => state.setOrderId);

  const dateCreate = new Date(order.created_at?.toString() as string);
  const dateUpdate = new Date(order.updated_at?.toString() as string);

  const handleView = () => setOrderId(String(order.order_id));
  const handleReset = () => {
    toast.error("Вы точно хотите сбросить заявку?", {
      style: { color: "red" },
      action: {
        label: "Сбросить",
        onClick: () => resetOrderMutation(order.order_id as number),
      },
    });
  };

  return (
    <Card
      className={styles.card}
      title={
        <div className={styles.header}>
          { !isDraft && (
            <>
              <Title level={5} className={styles.orderNumber}>
                №{order?.order_number?.replace(/^0+/, "")}
              </Title>
              <Tag
                color={order.order_status.status_color}
                className={styles.statusTag}
              >
                {order.order_status.status_name}
              </Tag>
            </>
          )}

          <Space>
            <Button icon={<EyeTwoTone />} onClick={handleView} />
            {order.in_route && (
              <Button danger icon={<ReloadOutlined />} onClick={handleReset} />
            )}
          </Space>
        </div>
      }
    >
      <div className={styles.infoGrid}>
        <div className={styles.infoRow}>
          <Text type="secondary">Дата создания:</Text>
          <Text>
            {dateCreate.toLocaleString("ru-RU", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </Text>
        </div>

        { !isDraft && (
          <div className={styles.infoRow}>
            <Text type="secondary">Дата обновления:</Text>
            <Text>
              {dateUpdate.toLocaleString("ru-RU", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </Text>
          </div>
        )}

        <div className={styles.infoRow}>
          <Text type="secondary">Сотрудник:</Text>
          <Text>{order.buyer?.buyer_name}</Text>
        </div>

        <div className={styles.infoRow}>
          <Text type="secondary">Подразделение:</Text>
          <Text>{order.department?.department_name}</Text>
        </div>

        <div className={styles.infoRow}>
          <Text type="secondary">Категория:</Text>
          <Text>{order.product_group?.product_group_name}</Text>
        </div>

        <div className={styles.infoRow}>
          <Text type="secondary">Тип:</Text>
          <Text>
            {order.order_type === "warehouse" ? "На склад" : "На закупку"}
          </Text>
        </div>

        <div className={styles.infoRow}>
          <Text type="secondary">ОМС/ПУ:</Text>
          <Text>{order.oms ? "ОМС" : "ПУ"}</Text>
        </div>
      </div>

      <Collapse ghost items={items} />
      <div className={styles.viewButton}>
        <Button onClick={handleView}>Перейти к заявке</Button>
      </div>
    </Card>
  );
};

export default OrderCard;
