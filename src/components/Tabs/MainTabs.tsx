"use client";
import ApprovalTabs from "@/components/Tabs/ApprovalTabs";
import Tab from "@/components/Tabs/Tabs";
import { Tabs, TabsProps } from "antd";
import { useTabStore } from "../../../store/tabStore";
import Notification from "../Notification/Notification";
import DraftTabs from "./DraftTabs";
import ProductList from "../ProductList/ProductList";

export const MainTabs = () => {
  const activeMainTabKey = useTabStore((state) => state.activeMainTabKey);
  const setActiveMainTabKey = useTabStore((state) => state.setActiveMainTabKey);

  const handleTabChange = (key: string) => {
    setActiveMainTabKey(key); // Обновляем состояние при переключении вкладок
  };

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Заявки",
      children: <Tab />,
    },
    {
      key: "2",
      label: "Черновики",
      children: <DraftTabs />,
    },
    {
      key: "3",
      label: "Согласования",
      children: <ApprovalTabs />,
    },
    {
      key: "4",
      label: "Товары",
      children: <ProductList />,
    },
  ];
  return (
    <div style={{ padding: "0 10px" }}>
      <Tabs
        defaultActiveKey={"1"}
        items={items}
        activeKey={activeMainTabKey}
        onChange={handleTabChange}
        animated
      />
      <Notification />
    </div>
  );
};
