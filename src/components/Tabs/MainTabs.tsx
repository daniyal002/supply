"use client";
import ApprovalTabs from "@/components/Tabs/ApprovalTabs";
import Tab from "@/components/Tabs/Tabs";
import { Tabs, TabsProps } from "antd";
import { useTabStore } from "../../../store/tabStore";
import DraftTabs from "./DraftTabs";
import ProductList from "../ProductList/ProductList";
import AllOrderTabs from "./AllOrderTabs";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/db/db";
import { useEffect, useState } from "react";

export const MainTabs = () => {
  const activeMainTabKey = useTabStore((state) => state.activeMainTabKey);
  const setActiveMainTabKey = useTabStore((state) => state.setActiveMainTabKey);
  const [items, setItems] = useState<TabsProps["items"]>([]);

  const handleTabChange = (key: string) => {
    setActiveMainTabKey(key); // Обновляем состояние при переключении вкладок
  };

  const GetMeData = useLiveQuery(() => db.getMe.toCollection().first(), []);

  useEffect(() => {
    const tabs: TabsProps["items"] = [
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

      {
        key: "5",
        label: "Все заявки",
        children: <AllOrderTabs />,
      },
    ];

    setItems(tabs);
  }, [GetMeData]);

  return (
    <div style={{ padding: "0 10px" }}>
      <Tabs
        defaultActiveKey={"1"}
        items={items}
        activeKey={activeMainTabKey}
        onChange={handleTabChange}
        animated={{ inkBar: true, tabPane: false }}
      />
    </div>
  );
};
