"use client";

import React, { useEffect, useRef, useState } from "react";
import {Tabs } from "antd";
import { useOrderIdStore } from "../../../store/orderIdStore";
import { useQueryClient } from "@tanstack/react-query";
import { useTabStore } from "../../../store/tabStore";
import DraftOrder from "@/app/draftOrder/[slug]/DraftOrder";

type TargetKey = React.MouseEvent | React.KeyboardEvent | string;

export default function DraftTabs() {
  const { tabsDraftOrders, addTabDraftOrders, removeTabDraftOrders, setTabsDraftOrders,activeTabDraftOrders,setActiveTabDraftOrders } = useTabStore();
  const draftOrderId = useOrderIdStore(state => state.draftOrderId);
  const setDraftOrderId = useOrderIdStore(state => state.setDraftOrderId);
  const queryClient = useQueryClient();

  const edit = (orderid: string) => {
    const newActiveKey = `order-${orderid}`;
    const existingPane = tabsDraftOrders.find(pane => pane.key === newActiveKey);

    if (!existingPane) {
      let lableOrderId  = draftOrderId.startsWith("copy") ? `Копия по №${orderid?.split("copy").join("")}` : `Черновик № ${draftOrderId}`
      const newTab = {
        label: lableOrderId,
        children: <DraftOrder type="Изменить" draftOrderid={orderid} remove={remove} targetKey={newActiveKey} />,
        key: newActiveKey,
        closable:true,
      };
      addTabDraftOrders(newTab); // Добавляем вкладку в глобальное состояние
    }else{
      setActiveKey(newActiveKey)
    }

    setActiveKey(newActiveKey);
  };

  useEffect(() => {
    setTabsDraftOrders(tabsDraftOrders); // Синхронизируем вкладки при монтировании
  }, [tabsDraftOrders]);



  useEffect(() => {
    if ((draftOrderId !== "0" && draftOrderId !== "newOrder") && draftOrderId) {
      edit(draftOrderId);
    }
    setDraftOrderId("0")
  }, [draftOrderId]);


  const [activeKey, setActiveKey] = useState(tabsDraftOrders[0].key);
  const newTabIndex = useRef(1);

  useEffect(() => {
    const id = activeKey.startsWith('order-') ? activeKey.split('order-')[1] : null;
    if (id) {
      queryClient.invalidateQueries({ queryKey: ['getOrderById',id]});
    }
  }, [activeKey]);


  const onChange = (newActiveKey: string) => {
    setActiveKey(newActiveKey);
    setActiveTabDraftOrders(newActiveKey)
  };


  const add = () => {
    const newActiveKey = `newTab`;
    const existingPane = tabsDraftOrders.find(pane => pane.key === newActiveKey); // Используем tabsOrders из Zustand store

    if (!existingPane) {
        const newTab = {
            label: "Новая заявка",
            children: <DraftOrder type="Добавить" draftOrderid="newOrder" remove={remove} targetKey={newActiveKey} />,
            key: newActiveKey,
            closable: true,
        };

        // Добавляем новую вкладку в Zustand store
        addTabDraftOrders(newTab);
    }

    setDraftOrderId("newOrder");
    setActiveKey(newActiveKey);
};


const remove = (targetKey: TargetKey) => {
    let newActiveKey = activeKey;
    let lastIndex = -1;

    // Находим индекс удаляемой вкладки
    tabsDraftOrders.forEach((item, i) => {
        if (item.key === targetKey) {
            lastIndex = i - 1; // Запоминаем индекс предыдущей вкладки
        }
    });

    // Удаляем вкладку из Zustand store
    removeTabDraftOrders(targetKey as string);

    // Обновляем активный ключ
    const newPanes = tabsDraftOrders.filter((item) => item.key !== targetKey);
    if (newPanes.length && newActiveKey === targetKey) {
        if (lastIndex >= 0) {
            newActiveKey = newPanes[lastIndex].key; // Устанавливаем предыдущую вкладку как активную
        } else {
            newActiveKey = newPanes[0].key; // Устанавливаем первую вкладку как активную
        }
    }

    setActiveKey(newActiveKey); // Обновляем активный ключ
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
      <Tabs
        hideAdd
        type="editable-card"
        onChange={onChange}
        activeKey={activeKey}
        onEdit={onEdit}
        items={tabsDraftOrders} // Используем вкладки из глобального состояния
        style={{ padding: "0 10px" }}
        destroyInactiveTabPane={false}
        defaultActiveKey={activeTabDraftOrders}
        animated={{ inkBar: true, tabPane: false }}
      />
  );
}