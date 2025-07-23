"use client";

import React, { useEffect, useRef, useState } from "react";
import {  Tabs } from "antd";
import { useOrderIdStore } from "../../../store/orderIdStore";
import { useQueryClient } from "@tanstack/react-query";
import { useTabStore } from "../../../store/tabStore";
import AdminOrder from "@/app/adminOrder/[slug]/AdminOrder";

type TargetKey = React.MouseEvent | React.KeyboardEvent | string;

export default function AdminOrderTab() {
  const { tabsAdminOrders, addTabAdminOrders, removeTabAdminOrders, setTabsAdminOrders,activeTabAdminOrders,setActiveTabAdminOrders } = useTabStore();
  const adminOrderId = useOrderIdStore(state => state.adminOrderId);
  const setAdminOrderId = useOrderIdStore(state => state.setAdminOrderId);
  const queryClient = useQueryClient();

  const edit = (orderid: string) => {
    const newActiveKey = `order-${orderid}`;
    const existingPane = tabsAdminOrders.find(pane => pane.key === newActiveKey);

    if (!existingPane) {
      const newTab = {
        label: `Заявка №${orderid}`,
        children: <AdminOrder type="Изменить" orderid={orderid} remove={remove} targetKey={newActiveKey} />,
        key: newActiveKey,
        closable:true,
      };
      addTabAdminOrders(newTab); // Добавляем вкладку в глобальное состояние
    }else{
      setActiveKey(newActiveKey)
    }

    setActiveKey(newActiveKey);
  };

  useEffect(() => {
    setTabsAdminOrders(tabsAdminOrders); // Синхронизируем вкладки при монтировании
  }, [tabsAdminOrders]);



  useEffect(() => {
    if ((adminOrderId !== "0" && adminOrderId !== "newOrder") && adminOrderId) {
      edit(adminOrderId);
    }
    setAdminOrderId("0")
  }, [adminOrderId]);


  const [activeKey, setActiveKey] = useState(tabsAdminOrders[0].key);
  const newTabIndex = useRef(1);

  useEffect(() => {
    const id = activeKey.startsWith('order-') ? activeKey.split('order-')[1] : null;
    if (id) {
      queryClient.invalidateQueries({ queryKey: ['getOrderById',id]});
    }
  }, [activeKey]);


  const onChange = (newActiveKey: string) => {
    setActiveKey(newActiveKey);
    setActiveTabAdminOrders(newActiveKey)
  };


  const add = () => {
    const newActiveKey = `newTab`;
    const existingPane = tabsAdminOrders.find(pane => pane.key === newActiveKey); // Используем tabsOrders из Zustand store

    if (!existingPane) {
        const newTab = {
            label: "Новая заявка",
            children: <AdminOrder type="Добавить" orderid="newOrder" remove={remove} targetKey={newActiveKey} />,
            key: newActiveKey,
            closable: true,
        };

        // Добавляем новую вкладку в Zustand store
        addTabAdminOrders(newTab);
    }

    setAdminOrderId("newOrder");
    setActiveKey(newActiveKey);
};


const remove = (targetKey: TargetKey) => {
    let newActiveKey = activeKey;
    let lastIndex = -1;

    // Находим индекс удаляемой вкладки
    tabsAdminOrders.forEach((item, i) => {
        if (item.key === targetKey) {
            lastIndex = i - 1; // Запоминаем индекс предыдущей вкладки
        }
    });

    // Удаляем вкладку из Zustand store
    removeTabAdminOrders(targetKey as string);

    // Обновляем активный ключ
    const newPanes = tabsAdminOrders.filter((item) => item.key !== targetKey);
    if (newPanes.length && newActiveKey === targetKey) {
        if (lastIndex >= 0) {
            newActiveKey = newPanes[lastIndex].key; // Устанавливаем предыдущую вкладку как активную
        } else {
            newActiveKey = newPanes[0].key; // Устанавливаем первую вкладку как активную
        }
    }

    setActiveKey(newActiveKey); // Обновляем активный ключ
    setAdminOrderId("0"); // Сбрасываем orderId
};

  const onEdit = (
    targetKey: React.MouseEvent | React.KeyboardEvent | string,
    action: "add" | "remove"
  ) => {
    if (action === "add") {
      add();
    } else {
      remove(targetKey);
    }
  };



  return (
      <Tabs
        type="editable-card"
        onChange={onChange}
        activeKey={activeKey}
        onEdit={onEdit}
        items={tabsAdminOrders} // Используем вкладки из глобального состояния
        style={{ padding: "0 10px" }}
        destroyInactiveTabPane={false}
        defaultActiveKey={activeTabAdminOrders}
        animated
      />
  );
}