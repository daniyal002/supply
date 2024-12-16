"use client";

import React, { useEffect, useRef, useState } from "react";
import OrderList from "../Order/OrderList/OrderList";
import { ConfigProvider, Tabs } from "antd";
import Order from "@/app/order/[slug]/Order";
import { useOrderIdStore } from "../../../store/orderIdStore";
import { useQueryClient } from "@tanstack/react-query";
import { useTabStore } from "../../../store/tabStore";

type TargetKey = React.MouseEvent | React.KeyboardEvent | string;

export default function Tab() {
  const { tabsOrders, addTabOrders, removeTabOrders, setTabsOrders,activeTabOrders,setActiveTabOrders } = useTabStore();
  const orderId = useOrderIdStore(state => state.orderId);
  const draftOrderId = useOrderIdStore(state => state.draftOrderId);
  const setOrderId = useOrderIdStore(state => state.setOrderId);
  const setDraftOrderId = useOrderIdStore(state => state.setDraftOrderId);
  const queryClient = useQueryClient();

  const edit = (orderid: string) => {
    const newActiveKey = `order-${orderid}`;
    const existingPane = tabsOrders.find(pane => pane.key === newActiveKey);

    if (!existingPane) {
      const newTab = {
        label: `Заявка №${orderid}`,
        children: <Order type="Изменить" orderid={orderid} remove={remove} targetKey={newActiveKey} />,
        key: newActiveKey,
        closable:true,
      };
      addTabOrders(newTab); // Добавляем вкладку в глобальное состояние
    }

    setActiveKey(newActiveKey);
  };

  useEffect(() => {
    setTabsOrders(tabsOrders); // Синхронизируем вкладки при монтировании
  }, [tabsOrders]);

  // const editDraft = (orderid: string) => {
  //   const newActiveKey = `draft`;
  //   const newPanes = [...items];
  //   const existingPane = newPanes.find(pane => pane.key === newActiveKey);

  //   if (!existingPane) {
  //     newPanes.push({
  //       label: `Черновик`,
  //       children: <Order type="Добавить" orderid={orderid} remove={remove} targetKey={newActiveKey} />,
  //       key: newActiveKey,
  //       closable: true,
  //     });
  //   }

  //   setItems(newPanes);
  //   setActiveKey(newActiveKey);
  // };


  useEffect(() => {
    if ((orderId !== "0" && orderId !== "newOrder") && orderId) {
      edit(orderId);
    }
  }, [orderId]);

  // useEffect(() => {
  //   if (draftOrderId !== "0" && draftOrderId) {
  //     editDraft(draftOrderId);
  //   }
  // }, [draftOrderId]);

  const [activeKey, setActiveKey] = useState(tabsOrders[0].key);
  const newTabIndex = useRef(1);

  useEffect(() => {
    const id = activeKey.startsWith('order-') ? activeKey.split('order-')[1] : null;
    if (id) {
      queryClient.invalidateQueries({ queryKey: ['getOrderById',id]});
    }
  }, [activeKey]);


  const onChange = (newActiveKey: string) => {
    setActiveKey(newActiveKey);
    setActiveTabOrders(newActiveKey)
  };


  const add = () => {
    const newActiveKey = `newTab`;
    const existingPane = tabsOrders.find(pane => pane.key === newActiveKey); // Используем tabsOrders из Zustand store

    if (!existingPane) {
        const newTab = {
            label: "Новая заявка",
            children: <Order type="Добавить" orderid="newOrder" remove={remove} targetKey={newActiveKey} />,
            key: newActiveKey,
            closable: true,
        };

        // Добавляем новую вкладку в Zustand store
        addTabOrders(newTab);
    }

    setOrderId("newOrder");
    setActiveKey(newActiveKey);
};


const remove = (targetKey: TargetKey) => {
    let newActiveKey = activeKey;
    let lastIndex = -1;

    // Находим индекс удаляемой вкладки
    tabsOrders.forEach((item, i) => {
        if (item.key === targetKey) {
            lastIndex = i - 1; // Запоминаем индекс предыдущей вкладки
        }
    });

    // Удаляем вкладку из Zustand store
    removeTabOrders(targetKey as string);

    // Обновляем активный ключ
    const newPanes = tabsOrders.filter((item) => item.key !== targetKey);
    if (newPanes.length && newActiveKey === targetKey) {
        if (lastIndex >= 0) {
            newActiveKey = newPanes[lastIndex].key; // Устанавливаем предыдущую вкладку как активную
        } else {
            newActiveKey = newPanes[0].key; // Устанавливаем первую вкладку как активную
        }
    }

    setActiveKey(newActiveKey); // Обновляем активный ключ
    setOrderId("0"); // Сбрасываем orderId
    setDraftOrderId("0"); // Сбрасываем draftOrderId
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
    <ConfigProvider theme={{token:{colorPrimary:"#678098"}}}>
      <Tabs
        type="editable-card"
        onChange={onChange}
        activeKey={activeKey}
        onEdit={onEdit}
        items={tabsOrders} // Используем вкладки из глобального состояния
        style={{ padding: "0 10px" }}
        destroyInactiveTabPane={false}
        defaultActiveKey={activeTabOrders}
      />
    </ConfigProvider>

  );
}