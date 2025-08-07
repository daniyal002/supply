"use client";

import React, { useEffect, useRef, useState } from "react";
import {Tabs } from "antd";
import { useQueryClient } from "@tanstack/react-query";
import { useApprovalStore } from "../../../store/approvalStore";
import ApprovalOrder from "@/app/approval/[slug]/ApprovalOrder";
import { useTabStore } from "../../../store/tabStore";
import { useOrderIdStore } from "../../../store/orderIdStore";

type TargetKey = React.MouseEvent | React.KeyboardEvent | string;

export default function AllOrderTabs() {
  const { tabsAllOrders, addTabAllOrders, removeTabAllOrders, setTabsAllOrders, activeTabAllOrders, setActiveTabAllOrders } = useTabStore();
  const allOrderId = useOrderIdStore((state) => state.allOrderId);
  const setAllOrderId = useOrderIdStore(
    (state) => state.setAllOrderId
  );
  const queryClient = useQueryClient();

  const edit = (orderid: string) => {
    const newActiveKey = `order-${orderid}`;
    const existingPane = tabsAllOrders.find((pane) => pane.key === newActiveKey);

    if (!existingPane) {
      const newTab = {
        label: `Заявка №${orderid}`,
        children: (
          <ApprovalOrder
            type="Изменить"
            orderid={orderid}
            remove={remove}
            targetKey={newActiveKey}
          />
      ),
        key: newActiveKey,
        closable:true
      };
      addTabAllOrders(newTab); // Добавляем вкладку в глобальное состояние
    }else{
      setActiveKey(newActiveKey)
    }

    setActiveKey(newActiveKey);
  };

  useEffect(() => {
    setTabsAllOrders(tabsAllOrders); // Синхронизируем вкладки при монтировании
  }, [tabsAllOrders]);


  useEffect(() => {
    if (allOrderId !== "0" && allOrderId) {
      edit(allOrderId);
    }
    setAllOrderId("0")
  }, [allOrderId]);

  const [activeKey, setActiveKey] = useState(tabsAllOrders[0].key);
  const newTabIndex = useRef(1);

  useEffect(() => {
    const id = activeKey.startsWith("order-")
      ? activeKey.split("order-")[1]
      : null;
    if (id) {
      queryClient.invalidateQueries({ queryKey: ["getOrderById", id] });
    }
  }, [activeKey]);

  const onChange = (newActiveKey: string) => {
    setActiveKey(newActiveKey);
    setActiveTabAllOrders(newActiveKey)
  };


  const remove = (targetKey: TargetKey) => {
    let newActiveKey = activeKey;
    let lastIndex = -1;

    // Находим индекс удаляемой вкладки
    tabsAllOrders.forEach((item, i) => {
        if (item.key === targetKey) {
            lastIndex = i - 1; // Запоминаем индекс предыдущей вкладки
        }
    });

    // Удаляем вкладку из Zustand store
    removeTabAllOrders(targetKey as string);

    // Обновляем активный ключ
    const newPanes = tabsAllOrders.filter((item) => item.key !== targetKey);
    if (newPanes.length && newActiveKey === targetKey) {
        if (lastIndex >= 0) {
            newActiveKey = newPanes[lastIndex].key; // Устанавливаем предыдущую вкладку как активную
        } else {
            newActiveKey = newPanes[0].key; // Устанавливаем первую вкладку как активную
        }
    }

    setActiveKey(newActiveKey); // Обновляем активный ключ
    setAllOrderId("0");
};

  const onEdit = (
    targetKey: React.MouseEvent | React.KeyboardEvent | string,
    action: "add" | "remove"
  ) => {
    if (action === "remove") {
      remove(targetKey);
    }
  };

  return (
      <Tabs
        hideAdd
        type="editable-card"
        onChange={onChange}
        activeKey={activeKey}
        onEdit={onEdit}
        items={tabsAllOrders} // Используем вкладки из глобального состояния
        style={{ padding: "0 10px" }}
        destroyInactiveTabPane={false}
        defaultActiveKey={activeTabAllOrders}
        animated
      />
  );
}
